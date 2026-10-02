-- KPI de la bêta fermée Natanga (PostgreSQL) — aucune donnée nominative en sortie.
-- Sources : users, children, consents, reading_sessions, child_events (déjà collectées,
-- sous consentement). Aucun traceur tiers. Exécuter en lecture seule :
--   psql "$DATABASE_URL" -f docs/sql/kpi-beta.sql

-- 1. Entonnoir d'activation (cohorte : comptes créés sur la période)
WITH cohort AS (
  SELECT id, created_at FROM users
  WHERE role = 'parent' AND created_at >= now() - interval '30 days'
)
SELECT
  (SELECT count(*) FROM cohort)                                                  AS comptes_crees,
  (SELECT count(*) FROM users u JOIN cohort c USING (id) WHERE u.status = 'ACTIVE') AS emails_confirmes,
  (SELECT count(DISTINCT ch.user_id) FROM children ch JOIN cohort c ON c.id = ch.user_id) AS parents_avec_enfant,
  (SELECT count(DISTINCT ch.user_id) FROM children ch JOIN cohort c ON c.id = ch.user_id
     WHERE ch.status = 'ACTIVE')                                                 AS parents_accord_donne,
  (SELECT count(DISTINCT ch.user_id) FROM children ch JOIN cohort c ON c.id = ch.user_id
     JOIN reading_sessions rs ON rs.child_id = ch.id AND rs.completed)           AS parents_premiere_lecture;

-- 2. Rétention J7 / J14 des enfants (cohorte par date de 1re lecture terminée)
WITH first_read AS (
  SELECT child_id, min(created_at)::date AS d0
  FROM reading_sessions WHERE completed GROUP BY child_id
)
SELECT
  count(*)                                                                         AS enfants_actives,
  count(*) FILTER (WHERE d0 <= current_date - 7)                                   AS eligibles_j7,
  count(*) FILTER (WHERE d0 <= current_date - 7 AND EXISTS (
    SELECT 1 FROM reading_sessions r WHERE r.child_id = f.child_id
      AND r.created_at::date BETWEEN f.d0 + 7 AND f.d0 + 13))                      AS revenus_j7,
  count(*) FILTER (WHERE d0 <= current_date - 14 AND EXISTS (
    SELECT 1 FROM reading_sessions r WHERE r.child_id = f.child_id
      AND r.created_at::date BETWEEN f.d0 + 14 AND f.d0 + 20))                     AS revenus_j14
FROM first_read f;

-- 3. Engagement hebdomadaire
SELECT date_trunc('week', created_at)::date                      AS semaine,
       count(DISTINCT child_id)                                  AS enfants_lecteurs,
       count(*) FILTER (WHERE completed)                         AS lectures_terminees,
       round(avg(duration_sec) FILTER (WHERE completed) / 60.0, 1) AS minutes_par_lecture,
       round(100.0 * sum(correct_words) / NULLIF(sum(words_read), 0), 1) AS pct_mots_lus_seul
FROM reading_sessions
GROUP BY 1 ORDER BY 1 DESC LIMIT 8;

-- 4. Usage de l'aide (mots touchés, écoute du texte entier) par lecture ouverte
SELECT name, count(*) AS evenements, count(DISTINCT child_id) AS enfants
FROM child_events
WHERE created_at >= now() - interval '7 days'
GROUP BY name ORDER BY evenements DESC;

import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const MAIL_LOG = path.resolve(__dirname, '../../api-laravel/storage/logs/laravel.log');
const SHOTS = path.resolve(__dirname, '../e2e-results/screens');

/** Lit le lien de vérification dans l'email journalisé (MIME quoted-printable). */
function verificationLinkFor(email: string): string {
  const log = readFileSync(MAIL_LOG, 'utf8')
    .replace(/=\r?\n/g, '')
    .replace(/=3D/g, '=');
  const block = log
    .split('To: ')
    .filter((b) => b.startsWith(email))
    .pop();
  const match = block?.match(/https?:\/\/[^\s"<]+\/verifier\?token=[0-9a-f-]{36}/);
  if (!match) throw new Error(`aucun email de vérification pour ${email}`);
  return match[0];
}

/** Zéro violation a11y sérieuse/critique (WCAG 2.1 A/AA). */
async function expectAccessible(page: Page, label: string) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const serious = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical',
  );
  expect(serious.map((v) => `${label}: ${v.id} — ${v.help} (${v.nodes.length})`)).toEqual([]);
}

async function shot(page: Page, name: string) {
  await page.screenshot({
    path: `${SHOTS}/${test.info().project.name}-${name}.png`,
    fullPage: true,
  });
}

test('parcours complet : inscription → email → accord parental → lecture → étoiles → suivi → effacement', async ({
  page,
}) => {
  const email = `parent-${test.info().project.name}-${Date.now()}@e2e.test`;

  // 1. Accueil
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Apprendre à lire');
  await expectAccessible(page, 'accueil');
  await shot(page, '01-accueil');

  // 2. Inscription
  await page.getByRole('link', { name: 'Créer un compte parent' }).click();
  await page.getByLabel('Votre email').fill(email);
  await page.getByLabel('Mot de passe').fill('secret1234');
  await expectAccessible(page, 'inscription');
  await page.getByRole('button', { name: 'Créer mon compte' }).click();
  await expect(page.getByRole('heading', { name: 'Vérifiez votre boîte email' })).toBeVisible();
  await shot(page, '02-email-envoye');

  // Connexion refusée tant que l'email n'est pas confirmé
  await page.goto('/connexion');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Mot de passe').fill('secret1234');
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await expect(page.getByRole('main').getByRole('alert')).toContainText(
    "n'est pas encore confirmée",
  );

  // 3. Lien reçu par email
  const link = new URL(verificationLinkFor(email));
  await page.goto(link.pathname + link.search);
  await expect(page.getByText('Votre adresse est confirmée')).toBeVisible();
  await expectAccessible(page, 'verification');
  await shot(page, '03-email-confirme');

  // 4. Connexion
  await page.getByRole('link', { name: 'Se connecter' }).last().click();
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Mot de passe').fill('secret1234');
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await expect(page.getByRole('heading', { name: 'Espace parent' })).toBeVisible();

  // 5. Ajout de l'enfant
  await page.getByLabel('Prénom (ou surnom)').fill('Léa');
  await page.getByLabel('Année de naissance').selectOption(String(new Date().getFullYear() - 7));
  await page.getByRole('button', { name: 'Ajouter', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Léa' })).toBeVisible();
  await expect(page.getByText('Accord à donner')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Lancer la lecture' })).toHaveCount(0);
  await expectAccessible(page, 'espace-parent');
  await shot(page, '04-enfant-sans-accord');

  // 6. Accord parental
  await page.getByRole('button', { name: 'Je donne mon accord parental' }).click();
  await expect(page.getByText('Accord donné')).toBeVisible();
  await shot(page, '05-accord-donne');

  // 7. Bibliothèque
  await page.getByRole('link', { name: 'Lancer la lecture' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Bonjour Léa');
  const stories = page.getByRole('list', { name: 'Histoires' }).getByRole('link');
  await expect(stories).toHaveCount(30);
  await page.getByRole('button', { name: /Espace/ }).click();
  await expect(stories).toHaveCount(5);
  await expectAccessible(page, 'bibliotheque');
  await shot(page, '06-bibliotheque');

  // 8. Lecture : deux mots difficiles touchés
  await stories.first().click();
  const reader = page.getByRole('article');
  await expect(reader).toBeVisible();
  const words = reader.getByRole('button');
  const total = await words.count();
  expect(total).toBeGreaterThan(10);
  await words.nth(1).click();
  await words.nth(4).click();
  await expect(reader.locator('[aria-pressed="true"]')).toHaveCount(2);
  await expectAccessible(page, 'lecteur');
  await shot(page, '07-lecteur');

  // Réglage persistant : police standard
  await page.getByText('Réglages de lecture').last().click();
  await page.getByLabel('Police').selectOption('system');
  await expect(reader).toHaveClass(/font-system/);

  // 9. Fin de lecture → étoiles (2 mots touchés sur > 10 ⇒ précision ≥ 80 % ⇒ 2 étoiles)
  await page.getByRole('button', { name: "J'ai fini !" }).click();
  await expect(page.getByRole('heading', { name: 'Bravo, super lecture !' })).toBeVisible();
  await expect(page.getByLabel('2 étoiles gagnées')).toBeVisible();
  await expectAccessible(page, 'bravo');
  await shot(page, '08-bravo');

  // 10. Barrière parentale : après la lecture, l'espace parent est reverrouillé
  await expect(page.getByRole('button', { name: 'Se déconnecter' })).toHaveCount(0);
  await page.getByRole('link', { name: 'Espace parent' }).click();
  await expect(page.getByRole('heading', { name: 'Espace réservé aux parents' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Je donne mon accord parental' })).toHaveCount(0);
  await page.getByLabel(/Combien font/).fill('1');
  await page.getByRole('button', { name: 'Entrer' }).click();
  await expect(page.getByRole('main').getByRole('alert')).toContainText('pas la bonne réponse');
  await expectAccessible(page, 'barriere-parentale');
  await shot(page, '09-barriere-parentale');
  const question = (await page.getByText(/Combien font/).textContent()) ?? '';
  const [, a, b] = question.match(/(\d+) × (\d+)/) ?? [];
  await page.getByLabel(/Combien font/).fill(String(Number(a) * Number(b)));
  await page.getByRole('button', { name: 'Entrer' }).click();

  // 11. Suivi parent
  await page.getByRole('link', { name: 'Suivi et données de Léa' }).click();
  await expect(page.getByRole('heading', { name: 'Suivi de Léa' })).toBeVisible();
  const row = page.getByRole('table').getByRole('row').nth(1);
  await expect(row).toContainText(`${total - 2} / ${total}`);
  await expect(row).toContainText('★★');
  await expectAccessible(page, 'suivi');
  await shot(page, '10-suivi-parent');

  // Le réglage de police a été persisté côté API
  const token = await page.evaluate(() => localStorage.getItem('natanga.token'));
  const childId = page.url().split('/').pop();
  const settings = await page.request.get(`/api/children/${childId}/settings`, {
    headers: { authorization: `Bearer ${token}` },
  });
  expect((await settings.json()).settings.fontFamily).toBe('system');

  // 12. Effacement RGPD
  page.once('dialog', (d) => d.accept());
  await page.getByRole('button', { name: 'Supprimer son profil et ses données' }).click();
  await expect(page.getByRole('heading', { name: 'Espace parent' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Léa' })).toHaveCount(0);

  // 13. Déconnexion : l'espace parent redevient inaccessible
  await page.getByRole('button', { name: 'Se déconnecter' }).click();
  await page.goto('/parent');
  await expect(page).toHaveURL(/\/connexion/);
});

test("l'API reste protégée derrière le proxy (pas de jeton → 401 RFC 7807)", async ({
  request,
}) => {
  const res = await request.get('/api/children');
  expect(res.status()).toBe(401);
  expect((await res.json()).code).toBe('ERR_UNAUTHENTICATED');
});

test('un lien invalide ou expiré propose de recevoir un nouveau lien', async ({ page }) => {
  await page.goto('/verifier?token=00000000-0000-0000-0000-000000000000');
  await expect(page.getByRole('main').getByRole('alert')).toContainText('invalide ou a expiré');
  await page.getByLabel('Recevoir un nouveau lien de confirmation').fill('inconnu@e2e.test');
  await page.getByRole('button', { name: 'Renvoyer le lien' }).click();
  await expect(page.getByRole('status')).toContainText('Si un compte en attente existe');
});

test("la documentation interne de l'API n'est pas publiée par le web", async ({ request }) => {
  expect((await request.get('/api/documentation')).status()).toBe(404);
});

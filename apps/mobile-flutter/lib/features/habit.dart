/// Habitude de lecture, à la façon de Duolingo mais sans pression :
/// - **série** : nombre de jours d'affilée avec au moins une leçon ou une histoire ;
/// - **objectif du jour** : 1, 2 ou 3 activités, choisi par l'enfant ;
/// - **joker** : gagné tous les 7 jours de série (2 au plus), il protège automatiquement
///   un jour oublié. Une série perdue n'est jamais reprochée : on en recommence une.
///
/// Logique pure (dates locales `aaaa-mm-jj`), sans Flutter ni stockage.
library;

/// Objectifs proposés (activités par jour) et leur nom.
const dailyGoals = {1: 'Tranquille', 2: 'Régulier', 3: 'Champion'};
const defaultDailyGoal = 2;

/// Un joker tous les 7 jours de série ; on en garde 2 au plus.
const jokerEvery = 7;
const maxJokers = 2;

/// Paliers de série fêtés en fin de leçon.
const streakMilestones = [3, 7, 14, 30, 50, 100];

/// Historique conservé (jours).
const habitHistoryDays = 90;

String dayKey(DateTime d) => '${d.year.toString().padLeft(4, '0')}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';

DateTime _day(DateTime d) => DateTime(d.year, d.month, d.day);
DateTime _parse(String key) => DateTime.parse(key);

/// Nombre de jours entre deux dates (calendrier local, changements d'heure compris).
int daysBetween(DateTime from, DateTime to) => (_day(to).difference(_day(from)).inHours / 24).round();

class Habit {
  const Habit({this.days = const {}, this.frozen = const {}, this.dailyGoal = defaultDailyGoal, this.jokers = 0});

  /// Activités terminées par jour (`aaaa-mm-jj` → nombre).
  final Map<String, int> days;

  /// Jours oubliés protégés par un joker.
  final Set<String> frozen;
  final int dailyGoal;
  final int jokers;

  static const initial = Habit();

  bool _covered(String key) => (days[key] ?? 0) > 0 || frozen.contains(key);

  int doneOn(DateTime day) => days[dayKey(day)] ?? 0;
  bool activeOn(DateTime day) => doneOn(day) > 0;
  bool goalReachedOn(DateTime day) => doneOn(day) >= dailyGoal;

  /// Série en cours. Tant que la journée n'est pas finie, la série d'hier compte encore.
  int streak(DateTime today) {
    var d = _day(today);
    if (!_covered(dayKey(d))) d = d.subtract(const Duration(days: 1));
    var n = 0;
    while (_covered(dayKey(d))) {
      if ((days[dayKey(d)] ?? 0) > 0) n++; // un jour protégé garde la série sans l'allonger
      d = d.subtract(const Duration(days: 1));
    }
    return n;
  }

  /// La semaine en cours, du lundi au dimanche.
  List<WeekDay> week(DateTime today) {
    final t = _day(today);
    final monday = t.subtract(Duration(days: t.weekday - 1));
    return [
      for (var i = 0; i < 7; i++)
        () {
          final d = monday.add(Duration(days: i));
          final key = dayKey(d);
          final state = d.isAfter(t)
              ? DayState.future
              : (days[key] ?? 0) > 0
              ? DayState.done
              : frozen.contains(key)
              ? DayState.frozen
              : d == t
              ? DayState.today
              : DayState.missed;
          return WeekDay(d, state);
        }(),
    ];
  }

  Habit copyWith({Map<String, int>? days, Set<String>? frozen, int? dailyGoal, int? jokers}) => Habit(
    days: days ?? this.days,
    frozen: frozen ?? this.frozen,
    dailyGoal: dailyGoal ?? this.dailyGoal,
    jokers: jokers ?? this.jokers,
  );

  Map<String, Object?> toJson() => {'days': days, 'frozen': frozen.toList()..sort(), 'dailyGoal': dailyGoal, 'jokers': jokers};

  static Habit fromJson(Object? raw) {
    if (raw is! Map) return initial;
    final goal = (raw['dailyGoal'] as num?)?.toInt() ?? defaultDailyGoal;
    return Habit(
      days: {for (final e in (raw['days'] as Map? ?? {}).entries) e.key as String: (e.value as num).toInt()},
      frozen: {for (final d in raw['frozen'] as List? ?? []) d as String},
      dailyGoal: dailyGoals.containsKey(goal) ? goal : defaultDailyGoal,
      jokers: ((raw['jokers'] as num?)?.toInt() ?? 0).clamp(0, maxJokers),
    );
  }
}

enum DayState { done, frozen, today, missed, future }

class WeekDay {
  const WeekDay(this.date, this.state);
  final DateTime date;
  final DayState state;
}

/// Ce qu'une activité vient de changer, pour la fête de fin de leçon.
class HabitChange {
  const HabitChange({
    required this.streakBefore,
    required this.streakAfter,
    required this.doneToday,
    required this.goal,
    required this.jokerEarned,
    required this.jokersUsed,
  });

  /// Compare l'habitude avant et après une activité du jour [now].
  factory HabitChange.between(Habit before, Habit after, DateTime now) => HabitChange(
    streakBefore: before.streak(now),
    streakAfter: after.streak(now),
    doneToday: after.doneOn(now),
    goal: after.dailyGoal,
    jokerEarned: after.jokers > before.jokers,
    jokersUsed: after.frozen.difference(before.frozen).length,
  );

  final int streakBefore;
  final int streakAfter;
  final int doneToday;
  final int goal;
  final bool jokerEarned;
  final int jokersUsed;

  /// Première activité du jour : la série vient de grandir.
  bool get streakExtended => streakAfter > streakBefore;
  bool get goalJustReached => doneToday == goal;
  bool get goalReached => doneToday >= goal;

  /// Palier atteint aujourd'hui (3, 7, 14…), sinon null.
  int? get milestone => streakExtended && streakMilestones.contains(streakAfter) ? streakAfter : null;
}

/// Enregistre une activité terminée (leçon ou histoire) à la date [now].
/// Les jours oubliés juste avant sont protégés par les jokers disponibles, s'il y en a assez.
Habit recordActivity(Habit h, DateTime now) {
  final today = _day(now);
  final key = dayKey(today);
  final firstToday = (h.days[key] ?? 0) == 0;

  var jokers = h.jokers;
  final frozen = {...h.frozen};
  if (firstToday) {
    final covered = {...h.days.keys.where((k) => (h.days[k] ?? 0) > 0), ...h.frozen};
    if (covered.isNotEmpty) {
      final last = covered.map(_parse).reduce((a, b) => a.isAfter(b) ? a : b);
      final missed = daysBetween(last, today) - 1;
      if (missed > 0 && missed <= jokers) {
        for (var i = 1; i <= missed; i++) {
          frozen.add(dayKey(DateTime(last.year, last.month, last.day + i)));
        }
        jokers -= missed;
      }
    }
  }

  // Historique borné : on oublie au-delà de 90 jours.
  final cutoff = today.subtract(const Duration(days: habitHistoryDays));
  bool recent(String k) => !_parse(k).isBefore(cutoff);
  final next = h.copyWith(
    days: {
      for (final e in h.days.entries)
        if (recent(e.key)) e.key: e.value,
      key: (h.days[key] ?? 0) + 1,
    },
    frozen: frozen.where(recent).toSet(),
    jokers: jokers,
  );
  // Un joker tous les 7 jours de série, à la première activité du jour.
  final after = next.streak(today);
  final earned = firstToday && after > 0 && after % jokerEvery == 0 && next.jokers < maxJokers;
  return earned ? next.copyWith(jokers: next.jokers + 1) : next;
}

/// Change l'objectif du jour (1, 2 ou 3).
Habit setDailyGoal(Habit h, int goal) => dailyGoals.containsKey(goal) ? h.copyWith(dailyGoal: goal) : h;

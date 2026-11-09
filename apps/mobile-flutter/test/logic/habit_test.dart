import 'package:flutter_test/flutter_test.dart';
import 'package:natanga_mobile/features/habit.dart';
import 'package:natanga_mobile/features/progress.dart';

DateTime d(int day, [int hour = 10]) => DateTime(2026, 11, day, hour); // novembre 2026 : le 9 est un lundi

Habit play(List<int> days, {Habit from = Habit.initial}) {
  var h = from;
  for (final day in days) {
    h = recordActivity(h, d(day));
  }
  return h;
}

void main() {
  test('la série compte les jours d’affilée ; la journée en cours ne la casse pas encore', () {
    final h = play([5, 6, 7]);
    expect(h.streak(d(7)), 3);
    expect(h.streak(d(8)), 3, reason: 'le 8 au matin, rien n’est perdu');
    expect(h.streak(d(9)), 0, reason: 'un jour sans activité ni joker : nouvelle série');
    expect(Habit.initial.streak(d(9)), 0);
  });

  test('plusieurs leçons le même jour : un seul jour de série, objectif du jour compté', () {
    final h = play([9, 9, 9]);
    expect(h.streak(d(9)), 1);
    expect(h.doneOn(d(9)), 3);
    expect(h.goalReachedOn(d(9)), isTrue);
    expect(setDailyGoal(h, 3).goalReachedOn(d(9)), isTrue);
    expect(setDailyGoal(h, 7).dailyGoal, defaultDailyGoal, reason: 'objectif hors liste ignoré');
  });

  test('7 jours d’affilée rapportent un joker (2 au plus)', () {
    final h = play([1, 2, 3, 4, 5, 6, 7]);
    expect(h.jokers, 1);
    final before = play([1, 2, 3, 4, 5, 6]);
    final change = HabitChange.between(before, recordActivity(before, d(7)), d(7));
    expect(change.jokerEarned, isTrue);
    expect(change.milestone, 7);
    expect(play(List.generate(21, (i) => i + 1).where((x) => x <= 30).toList()).jokers, maxJokers);
  });

  test('un joker protège automatiquement un jour oublié ; sans joker, la série repart', () {
    final week = play([1, 2, 3, 4, 5, 6, 7]); // 1 joker
    final back = recordActivity(week, d(9)); // le 8 oublié
    expect(back.frozen, {'2026-11-08'});
    expect(back.jokers, 0);
    expect(back.streak(d(9)), 8, reason: 'le jour protégé garde la série sans l’allonger');
    expect(HabitChange.between(week, back, d(9)).jokersUsed, 1);
    // Deux jours oubliés avec un seul joker : pas assez, la série repart (sans reproche).
    final gap = recordActivity(week, d(10));
    expect(gap.frozen, isEmpty);
    expect(gap.streak(d(10)), 1);
  });

  test('semaine du lundi au dimanche : fait, protégé, oublié, aujourd’hui, à venir', () {
    var h = play([1, 2, 3, 4, 5, 6, 7, 9]); // le 8 protégé par le joker
    h = recordActivity(h, d(10));
    final week = h.week(d(12)); // jeudi 12
    expect(week.first.date, DateTime(2026, 11, 9));
    expect(week.map((w) => w.state), [
      DayState.done,
      DayState.done,
      DayState.missed,
      DayState.today,
      DayState.future,
      DayState.future,
      DayState.future,
    ]);
    expect(h.week(d(9)).first.state, DayState.done);
    expect(play([1, 2, 3, 4, 5, 6, 7, 9]).week(d(9)).length, 7);
    expect(recordActivity(play([1, 2, 3, 4, 5, 6, 7]), d(9)).week(d(9)).first.state, DayState.done);
    final frozenWeek = recordActivity(play([2, 3, 4, 5, 6, 7, 8]), d(10)).week(d(10));
    expect(frozenWeek[0].state, DayState.frozen, reason: 'lundi 9 oublié, protégé');
  });

  test('changement d’heure : un jour reste un jour', () {
    // Passage à l'heure d'hiver en Europe le 25 octobre 2026.
    var h = recordActivity(Habit.initial, DateTime(2026, 10, 24, 20));
    h = recordActivity(h, DateTime(2026, 10, 25, 9));
    h = recordActivity(h, DateTime(2026, 10, 26, 9));
    expect(h.streak(DateTime(2026, 10, 26, 22)), 3);
    expect(daysBetween(DateTime(2026, 10, 24), DateTime(2026, 10, 26)), 2);
  });

  test('l’historique est borné à 90 jours', () {
    var h = recordActivity(Habit.initial, DateTime(2026, 1, 1));
    h = recordActivity(h, DateTime(2026, 11, 9));
    expect(h.days.keys, ['2026-11-09']);
  });

  test('sauvegarde : relue à l’identique ; ancienne sauvegarde sans habitude → habitude neuve, reste gardé', () {
    final s = recordLesson(ProgressState.initial, nodeId: 'n-son-a', lessonId: 'l-son-a', correct: 4, total: 4, gems: 40, now: d(9));
    expect(s.habit.doneOn(d(9)), 1);
    final back = ProgressState.parse(s.toJsonString());
    expect(back.toJsonString(), s.toJsonString());
    final old = ProgressState.parse('{"version":1,"nodes":{"n-son-a":{"status":"mastered","bestScore":1}},"gems":40,"outbox":[]}');
    expect(old.gems, 40);
    expect(old.habit.dailyGoal, defaultDailyGoal);
    expect(old.habit.streak(d(9)), 0);
    final reading = recordReading(ProgressState.initial, lessonId: 't', durationSec: 60, wordsRead: 10, correctWords: 9, now: d(9));
    expect(reading.habit.doneOn(d(9)), 1, reason: 'une histoire compte aussi');
  });
}

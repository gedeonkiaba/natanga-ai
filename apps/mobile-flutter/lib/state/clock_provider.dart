import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Horloge de l'app (date du jour pour la série) ; remplaçable en test.
final clockProvider = Provider<DateTime Function()>((ref) => DateTime.now);

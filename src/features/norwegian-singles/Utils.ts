export class QualitySession {
  readonly name: string;
  readonly duration: number;
  readonly rest: number;
  readonly pace: string;

  constructor(format: string, duration: number, rest: number, pace: string) {
    this.name = format;
    this.duration = duration;
    this.rest = rest;
    this.pace = pace;
  }
}

export const QUALITY_SESSIONS = [
  new QualitySession('Short', 60, 30, '10 kilometers'),
  new QualitySession('Medium', 180, 60, '15 kilometers'),
  new QualitySession('Long A', 360, 60, 'Half Marathon'),
  new QualitySession('Long B', 600, 90, 'Half Marathon to 30 kilometers'),
  new QualitySession('Very Long', 900, 120, '30 kilometers'),
];

export const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export function formatDuration(durationSec: number, minParts = 1) {
  const parts = [
    Math.floor(durationSec / 3600),
    Math.floor((durationSec % 3600) / 60),
    Math.floor(durationSec % 60)
  ];

  const firstNonZeroIndex = Math.min(
    parts.length - minParts,
    parts.findIndex(part => part > 0)
  );

  return parts.slice(firstNonZeroIndex).map(part => part.toString().padStart(2, '0')).join(':');
}

export function formatDistance(distanceKm: number) {
  return distanceKm.toFixed(1);
}

export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

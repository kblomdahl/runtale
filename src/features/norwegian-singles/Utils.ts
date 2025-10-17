import CriticalSpeed from "./CriticalSpeed";

export class Distance {
  private readonly amount: number;

  private constructor(amount: number) {
    this.amount = amount;
  }

  static fromMeters(meters: number): Distance {
    return new Distance(meters);
  }

  format(): string {
    return this.toKilometers().toFixed(1);
  }

  add(other: Distance): Distance {
    return Distance.fromMeters(this.toMeters() + other.toMeters());
  }

  toMeters(): number {
    return this.amount;
  }

  toKilometers(): number {
    return this.amount / 1000;
  }
}

export class Duration {
  private readonly seconds: number;

  private constructor(seconds: number) {
    this.seconds = seconds;
  }

  static fromSeconds(seconds: number): Duration {
    return new Duration(seconds);
  }

  static fromMinutes(minutes: number): Duration {
    return new Duration(minutes * 60);
  }

  static fromHours(hours: number): Duration {
    return new Duration(hours * 3600);
  }

  format(minParts: number = 1): string {
    const parts = [
      Math.floor(this.toSeconds() / 3600),
      Math.floor((this.toSeconds() % 3600) / 60),
      Math.floor(this.toSeconds() % 60)
    ];

    const firstNonZeroIndex = Math.min(
      parts.length - minParts,
      parts.findIndex(part => part > 0)
    );

    return parts.slice(firstNonZeroIndex).map(part => part.toString().padStart(2, '0')).join(':');
  }

  multiply(factor: number): Duration {
    return Duration.fromSeconds(this.toSeconds() * factor);
  }

  divide(factor: number): Duration {
    return Duration.fromSeconds(this.toSeconds() / factor);
  }

  add(other: Duration): Duration {
    return Duration.fromSeconds(this.toSeconds() + other.toSeconds());
  }

  subtract(other: Duration): Duration {
    return Duration.fromSeconds(this.toSeconds() - other.toSeconds());
  }

  max(other: Duration): Duration {
    return Duration.fromSeconds(Math.max(this.toSeconds(), other.toSeconds()));
  }

  min(other: Duration): Duration {
    return Duration.fromSeconds(Math.min(this.toSeconds(), other.toSeconds()));
  }

  toSeconds(): number {
    return this.seconds;
  }

  toMinutes(): number {
    return this.seconds / 60;
  }

  toHours(): number {
    return this.seconds / 3600;
  }
}

export class Speed {
  private readonly metersPerSecond: number;

  private constructor(metersPerSecond: number) {
    this.metersPerSecond = metersPerSecond;
  }

  static fromMetersPerSecond(metersPerSecond: number): Speed {
    return new Speed(metersPerSecond);
  }

  static fromSecondsPerKilometer(secondsPerKilometer: number): Speed {
    return new Speed(1000 / secondsPerKilometer);
  }

  static fromHoursPerKilometer(hoursPerKilometer: number): Speed {
    return new Speed(1000 / (hoursPerKilometer * 3600));
  }

  toMetersPerSecond(): number {
    return this.metersPerSecond;
  }

  toMinutesPerKilometer(): string {
    const totalSeconds = 1000 / this.metersPerSecond;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.round(totalSeconds % 60);

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

export class QualitySession {
  readonly name: string;
  readonly interval: Duration;
  readonly rest: Duration;
  readonly distancePace: Distance;
  readonly paceDescription: string;

  constructor(format: string, interval: Duration, rest: Duration, distancePace: Distance, paceDescription: string) {
    this.name = format;
    this.interval = interval;
    this.distancePace = distancePace;
    this.rest = rest;
    this.paceDescription = paceDescription;
  }

  repetitions(qualityDuration: Duration): number {
    return Math.floor(qualityDuration.toSeconds() / this.interval.toSeconds());
  }

  speed(criticalSpeed: CriticalSpeed): Speed {
    return criticalSpeed.speedAtDistance(this.distancePace);
  }

  intensityFactor(criticalSpeed: CriticalSpeed): number {
    const thresholdSpeed = criticalSpeed.thresholdSpeed();
    const speed = this.speed(criticalSpeed);

    return speed.toMetersPerSecond() / thresholdSpeed.toMetersPerSecond();
  }
}

export const QUALITY_SESSIONS = [
  new QualitySession('Short', Duration.fromSeconds(60), Duration.fromSeconds(30), Distance.fromMeters(10000), '10 kilometers'),
  new QualitySession('Medium', Duration.fromSeconds(180), Duration.fromSeconds(60), Distance.fromMeters(15000), '15 kilometers'),
  new QualitySession('Long A', Duration.fromSeconds(360), Duration.fromSeconds(60), Distance.fromMeters(21097.5), 'Half Marathon'),
  new QualitySession('Long B', Duration.fromSeconds(600), Duration.fromSeconds(90), Distance.fromMeters(25548.75), 'Half Marathon to 30 kilometers'),
  new QualitySession('Very Long', Duration.fromSeconds(900), Duration.fromSeconds(120), Distance.fromMeters(30000), '30 kilometers'),
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

export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

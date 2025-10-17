import CriticalSpeed from "./CriticalSpeed";
import Distance from '../../utils/Distance';
import Duration from '../../utils/Duration';
import Speed from '../../utils/Speed';

export default class QualitySession {
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

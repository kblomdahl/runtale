import Distance from '../../utils/Distance';
import Duration from '../../utils/Duration';
import Speed from '../../utils/Speed';

class CriticalSpeed {
  readonly criticalSpeed: Speed;
  readonly anaerobicDistanceCapacity: Distance;

  private constructor(criticalSpeed: Speed, anaerobicDistanceCapacity: Distance) {
    this.criticalSpeed = criticalSpeed;
    this.anaerobicDistanceCapacity = anaerobicDistanceCapacity;
  }

  static fromRaces(distances: [Distance, Distance], times: [Duration, Duration]): CriticalSpeed {
    const deltaMeters = distances[1].toMeters() - distances[0].toMeters();
    const deltaSeconds = times[1].toSeconds() - times[0].toSeconds();
    const criticalSpeed = deltaMeters / deltaSeconds;
    const anaerobicDistanceCapacity = distances[0].toMeters() - criticalSpeed * times[0].toSeconds();

    return new CriticalSpeed(
      Speed.fromMetersPerSecond(criticalSpeed),
      Distance.fromMeters(anaerobicDistanceCapacity)
    );
  }

  speedAtDistance(distance: Distance): Speed {
    const deltaMeters = distance.toMeters() - this.anaerobicDistanceCapacity.toMeters();
    const seconds = deltaMeters / this.criticalSpeed.toMetersPerSecond();

    return Speed.fromMetersPerSecond(distance.toMeters() / seconds);
  }

  easySpeed(): Speed {
    const EASY_RUN_SPEED_FACTOR = (0.75 + 0.85) / 2.0;
    const easySpeed = this.criticalSpeed.toMetersPerSecond() * EASY_RUN_SPEED_FACTOR;

    return Speed.fromMetersPerSecond(easySpeed);
  }

  thresholdSpeed(): Speed {
    const THRESHOLD_SPEED_FACTOR = (0.95 + 0.98) / 2.0;
    const thresholdSpeed = this.criticalSpeed.toMetersPerSecond() * THRESHOLD_SPEED_FACTOR;

    return Speed.fromMetersPerSecond(thresholdSpeed);
  }
}

export default CriticalSpeed;

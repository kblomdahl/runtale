import CriticalSpeed from './CriticalSpeed';
import Distance from '../../utils/Distance';
import Duration from '../../utils/Duration';
import Speed from '../../utils/Speed';
import QualitySession, { QUALITY_SESSIONS } from './QualitySession';
import { WEEKDAYS, shuffle } from './Utils';
import styles from '../../styles/shared.module.css';

const WARM_UP_DURATION = Duration.fromMinutes(10);
const WARM_DOWN_DURATION = Duration.fromMinutes(10);
const WARM_UP_DOWN_DURATION = WARM_UP_DURATION.add(WARM_DOWN_DURATION);
const QUALITY_VOLUME_RATIO = 0.225; // between 20% and 25%
const MAX_LONG_RUN_DURATION = Duration.fromHours(2.5);
const MAX_LONG_RUN_WEEKLY_RATIO = 0.30;
const EASY_RUN_PACE_FACTOR = (1.15 + 1.30) / 2.0;
const EASY_INTENSITY_FACTOR = 1.0 / EASY_RUN_PACE_FACTOR;

function tssVolumeToDuration(targetTssVolume: number): Duration {
  return Duration.fromHours(targetTssVolume / (100 * ((1 - QUALITY_VOLUME_RATIO) * EASY_INTENSITY_FACTOR ** 2 + QUALITY_VOLUME_RATIO)));
}

enum WeekDayType {
  REST = 'Rest',
  EASY = 'Easy',
  QUALITY = 'Quality',
  LONG_RUN = 'Long Run'
}

abstract class WeekDay {
  readonly name: string;
  readonly type: WeekDayType;
  readonly speed: Speed;
  readonly duration: Duration;
  readonly intensityFactor: number;

  constructor(name: string, type: WeekDayType, speed: Speed, duration: Duration, intensityFactor: number) {
    this.name = name;
    this.type = type;
    this.speed = speed;
    this.duration = duration;
    this.intensityFactor = intensityFactor;
  }

  get tss() {
    return 100 * this.duration.toHours() * this.intensityFactor * this.intensityFactor;
  }

  get description() {
    return <>&nbsp;</>;
  }

  get distance() {
    return Distance.fromMeters(this.speed.toMetersPerSecond() * this.duration.toSeconds());
  }
}

class RestDay extends WeekDay {
  constructor(name: string) {
    super(name, WeekDayType.REST, Speed.fromMetersPerSecond(0), Duration.fromSeconds(0), 0);
  }
}

class EasyDay extends WeekDay {
  constructor(name: string, speed: Speed, duration: Duration) {
    super(name, WeekDayType.EASY, speed, duration, EASY_INTENSITY_FACTOR);
  }

  get description() {
    if (this.duration.toHours() >= 1) {
      const doublesDuration = this.duration.divide(2);

      return <table className={styles.inlineTable}>
        <thead>
          <tr>
            <th className={styles.center} colSpan={2}>Doubles</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={styles.fade}>{doublesDuration.format()}</td>
            <td className={styles.left}>Morning</td>
          </tr>
          <tr>
            <td className={styles.fade}>{doublesDuration.format()}</td>
            <td className={styles.left}>Evening</td>
          </tr>
        </tbody>
      </table>;
    }

    return super.description;
  }
}

class LongRunDay extends WeekDay {
  constructor(name: string, speed: Speed, duration: Duration) {
    super(name, WeekDayType.LONG_RUN, speed, duration, EASY_INTENSITY_FACTOR);
  }
}

class QualityDay extends WeekDay {
  readonly repetitions: number;
  readonly session: QualitySession;

  constructor(name: string, speed: Speed, duration: Duration, repetitions: number, intensityFactor: number, session: QualitySession) {
    super(name, WeekDayType.QUALITY, speed, duration, intensityFactor);

    this.repetitions = repetitions;
    this.session = session;
  }

  get description() {
    const qualityDuration = this.duration.subtract(WARM_UP_DOWN_DURATION);

    return <table className={styles.inlineTable}>
      <tbody>
        <tr>
          <td className={styles.fade}>{WARM_UP_DURATION.format()}</td>
          <td className={styles.left}>Warm up</td>
        </tr>
        <tr>
          <td className={styles.fade}>{qualityDuration.format()}</td>
          <td className={styles.left}>{Math.round(this.repetitions)} &times; {this.session.name}</td>
        </tr>
        <tr>
          <td className={styles.fade}>{WARM_DOWN_DURATION.format()}</td>
          <td className={styles.left}>Warm down</td>
        </tr>
      </tbody>
    </table>;
  }
}

function topQualitySessions(count: number, targetQualityDuration: Duration): QualitySession[] {
  const qualitySessions = QUALITY_SESSIONS.slice();

  shuffle(qualitySessions);
  qualitySessions.sort((a, b) => {
    const leftoverSecsA = targetQualityDuration.toSeconds() % a.interval.toSeconds();
    const leftoverSecsB = targetQualityDuration.toSeconds() % b.interval.toSeconds();

    return leftoverSecsA - leftoverSecsB;
  });

  qualitySessions.splice(count);
  shuffle(qualitySessions);

  return qualitySessions;
}

function scheduleWeekDays(
  longRunDay: number,
  restingDays: number[],
  qualityDays: number[],
  targetTssVolume: number,
  criticalSpeed: CriticalSpeed
): WeekDay[]
{
  const targetVolume = tssVolumeToDuration(targetTssVolume);

  const warmUpDownVolume = WARM_UP_DOWN_DURATION.multiply(qualityDays.length);
  const easyVolume = targetVolume.multiply(1 - QUALITY_VOLUME_RATIO);
  const longRunVolume = MAX_LONG_RUN_DURATION.min(targetVolume.multiply(MAX_LONG_RUN_WEEKLY_RATIO));
  const qualityVolume = targetVolume.multiply(QUALITY_VOLUME_RATIO);
  const qualitySessionDuration = qualityVolume.divide(qualityDays.length);

  const qualitySessions = topQualitySessions(qualityDays.length, qualitySessionDuration);
  const qualityRestVolume = qualitySessions.reduce((sum, session) => {
    const repetitions = session.repetitions(qualitySessionDuration);

    return sum.add(session.rest.multiply(repetitions - 1));
  }, Duration.fromSeconds(0));

  const effectiveEasyVolume = easyVolume.subtract(
    longRunVolume.add(warmUpDownVolume).add(qualityRestVolume)
  ).max(Duration.fromSeconds(0));

  return WEEKDAYS.map((day, index) => {
    if (restingDays.includes(index)) {
      return new RestDay(day);
    } else if (index === longRunDay) {
      return new LongRunDay(day, criticalSpeed.easySpeed(), longRunVolume);
    } else if (qualityDays.includes(index)) {
      const qualitySession = qualitySessions[qualityDays.indexOf(index)];
      const repetitions = qualitySession.repetitions(qualitySessionDuration);

      const qualityDuration = qualitySession.interval.multiply(repetitions);
      const qualityIntensityFactor = qualitySession.intensityFactor(criticalSpeed);
      const restDuration = qualitySession.rest.multiply((repetitions - 1));
      const totalSessionDuration = WARM_UP_DOWN_DURATION.add(qualityDuration).add(restDuration);
      const averageSpeed = Speed.fromMetersPerSecond(
        (
          WARM_UP_DOWN_DURATION.toSeconds() * criticalSpeed.easySpeed().toMetersPerSecond() +
          qualityDuration.toSeconds() * qualitySession.speed(criticalSpeed).toMetersPerSecond() +
          restDuration.toSeconds() * criticalSpeed.easySpeed().toMetersPerSecond()
        ) / totalSessionDuration.toSeconds()
      );

      const averageIntensityFactor = (
        WARM_UP_DOWN_DURATION.toSeconds() * EASY_INTENSITY_FACTOR +
        qualityDuration.toSeconds() * qualityIntensityFactor +
        restDuration.toSeconds() * EASY_INTENSITY_FACTOR
      ) / totalSessionDuration.toSeconds();

      return new QualityDay(day, averageSpeed, totalSessionDuration, repetitions, averageIntensityFactor, qualitySession);
    } else {
      const numberOfEasyDays = WEEKDAYS.length - restingDays.length - qualityDays.length - 1;
      const easyRunDuration = effectiveEasyVolume.divide(numberOfEasyDays);

      return new EasyDay(day, criticalSpeed.easySpeed(), easyRunDuration);
    }
  });
}

interface WeekScheduleProps {
  longRunDay: number;
  restingDays: number[];
  qualityDays: number[];
  targetTssVolume: number;
  criticalSpeed: CriticalSpeed
}

export default function WeekSchedule({
  longRunDay,
  restingDays,
  qualityDays,
  targetTssVolume: targetVolume,
  criticalSpeed
}: WeekScheduleProps)
{
  const weekDays = scheduleWeekDays(longRunDay, restingDays, qualityDays, targetVolume, criticalSpeed);

  return (
    <table>
      <thead>
        <tr>
          <th>&nbsp;</th>
          {WEEKDAYS.map(day => {
            return <th key={day} className={styles.center}>{day}</th>
          })}
          <th className={styles.narrow}>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Type</td>
          {weekDays.map((day) => <td key={day.name} className={styles.center}>{day.type}</td>)}
        </tr>
        <tr>
          <td>TSS</td>
          {weekDays.map((day) => (
            <td key={day.name} className={`${styles.center} ${styles.small} ${styles.fade}`}>
              {day.tss > 0 && Math.round(day.tss)}
            </td>
          ))}
          <td className={`${styles.small} ${styles.fade} ${styles.narrow}`}>
            {Math.round(weekDays.reduce((sum, day) => sum + day.tss, 0))}
          </td>
        </tr>
        <tr>
          <td>Duration</td>
          {weekDays.map((day) => (
            <td key={day.name} className={`${styles.center} ${styles.small} ${styles.fade}`}>
              {day.duration.toSeconds() > 0 && day.duration.format()}
            </td>
          ))}
          <td className={`${styles.small} ${styles.fade} ${styles.narrow}`}>
            {weekDays.reduce((sum, day) => sum.add(day.duration), Duration.fromSeconds(0)).format()}
          </td>
        </tr>
        <tr>
          <td>Distance</td>
          {weekDays.map((day) => (
            <td key={day.name} className={`${styles.center} ${styles.small} ${styles.fade}`}>
              {day.distance.toMeters() > 0 && <> {day.distance.format()} km</>}
            </td>
          ))}
          <td className={`${styles.small} ${styles.fade} ${styles.narrow}`}>
            {weekDays.reduce((sum, day) => sum.add(day.distance), Distance.fromMeters(0)).format()} km
          </td>
        </tr>
        <tr>
          <td>Description</td>
          {weekDays.map((day) => (
            <td key={day.name} className={`${styles.center} ${styles.small}`}>
              {day.description}
            </td>
          ))}
          <td>&nbsp;</td>
        </tr>
      </tbody>
    </table>
  );
}

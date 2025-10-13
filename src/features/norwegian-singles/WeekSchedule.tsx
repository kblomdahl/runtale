import { QUALITY_SESSIONS, WEEKDAYS, QualitySession, formatDuration, formatDistance, shuffle } from './Utils';

const WARM_UP_DOWN_DURATION_HOURS = 20 / 60; // 20 minutes
const QUALITY_VOLUME_RATIO = 0.225; // between 20% and 25%
const MAX_LONG_RUN_DURATION_HOURS = 2.5;
const MAX_LONG_RUN_WEEKLY_RATIO = 0.30;

function tssVolumeToHours(
  targetTssVolume: number,
  easyRunPace: number,
  functionalThresholdPace: number
): number {
  const easyRunSpeed = 1000 / easyRunPace;
  const functionalThresholdSpeed = 1000 / functionalThresholdPace;
  const easyIntensityFactor = easyRunSpeed / functionalThresholdSpeed;

  return targetTssVolume / (100 * ((1 - QUALITY_VOLUME_RATIO) * easyIntensityFactor ** 2 + QUALITY_VOLUME_RATIO));
}

function functionalThresholdToEasyPace(functionalThresholdPace: number) {
  const EASY_RUN_PACE_FACTOR = (1.15 + 1.30) / 2.0;

  return functionalThresholdPace * EASY_RUN_PACE_FACTOR;
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
  readonly pace: number;
  readonly duration: number;
  readonly intensityFactor: number;

  constructor(name: string, type: WeekDayType, pace: number, duration: number, intensityFactor: number) {
    this.name = name;
    this.type = type;
    this.pace = pace;
    this.duration = duration;
    this.intensityFactor = intensityFactor;
  }

  get tss() {
    const durationHours = this.duration / 3600;

    return 100 * durationHours * this.intensityFactor * this.intensityFactor;
  }

  get description() {
    return <>&nbsp;</>;
  }

  get distance() {
    if (this.pace === 0) {
      return 0;
    }

    return this.duration / this.pace;
  }
}

class RestDay extends WeekDay {
  constructor(name: string) {
    super(name, WeekDayType.REST, 0, 0, 0);
  }
}

class EasyDay extends WeekDay {
  constructor(name: string, pace: number, duration: number, intensityFactor: number) {
    super(name, WeekDayType.EASY, pace, duration, intensityFactor);
  }

  get description() {
    if (this.duration >= 3600) {
      return <table className='-inline'>
        <thead>
          <tr>
            <th className='-center' colSpan={2}>Doubles</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='-fade'>{formatDuration(this.duration / 2)}</td>
            <td className='-left'>Morning</td>
          </tr>
          <tr>
            <td className='-fade'>{formatDuration(this.duration / 2)}</td>
            <td className='-left'>Evening</td>
          </tr>
        </tbody>
      </table>;
    }

    return super.description;
  }
}

class LongRunDay extends WeekDay {
  constructor(name: string, pace: number, duration: number, intensityFactor: number) {
    super(name, WeekDayType.LONG_RUN, pace, duration, intensityFactor);
  }
}

class QualityDay extends WeekDay {
  readonly session: QualitySession;

  constructor(name: string, pace: number, duration: number, intensityFactor: number, session: QualitySession) {
    super(name, WeekDayType.QUALITY, pace, duration, intensityFactor);

    this.session = session;
  }

  get description() {
    const warmUpDuration = 3600 * WARM_UP_DOWN_DURATION_HOURS / 2;
    const warmDownDuration = 3600 * WARM_UP_DOWN_DURATION_HOURS / 2;
    const qualityDuration = this.duration - warmUpDuration - warmDownDuration;
    const repetitions = (qualityDuration + this.session.rest) / (this.session.duration + this.session.rest);

    return <table className='-inline'>
      <tbody>
        <tr>
          <td className='-fade'>{formatDuration(warmUpDuration)}</td>
          <td className='-left'>Warm up</td>
        </tr>
        <tr>
          <td className='-fade'>{formatDuration(qualityDuration)}</td>
          <td className='-left'>{Math.round(repetitions)} &times; {this.session.name}</td>
        </tr>
        <tr>
          <td className='-fade'>{formatDuration(warmDownDuration)}</td>
          <td className='-left'>Warm down</td>
        </tr>
      </tbody>
    </table>;
  }
}

function topQualitySessions(count: number, targetQualityDuration: number): QualitySession[] {
  const qualitySessions = QUALITY_SESSIONS.slice();

  shuffle(qualitySessions);
  qualitySessions.sort((a, b) => {
    const leftoverSecsA = targetQualityDuration % a.duration;
    const leftoverSecsB = targetQualityDuration % b.duration;

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
  functionalThresholdPace: number
): WeekDay[]
{
  const easyRunPace = functionalThresholdToEasyPace(functionalThresholdPace);
  const targetVolumeHours = tssVolumeToHours(targetTssVolume, easyRunPace, functionalThresholdPace);

  const warmUpDownVolumeHours = WARM_UP_DOWN_DURATION_HOURS * qualityDays.length;
  const easyVolumeHours = targetVolumeHours * (1 - QUALITY_VOLUME_RATIO);
  const longRunVolumeHours = Math.min(MAX_LONG_RUN_DURATION_HOURS, MAX_LONG_RUN_WEEKLY_RATIO * targetVolumeHours);
  const qualityVolumeHours = targetVolumeHours * QUALITY_VOLUME_RATIO;
  const qualitySessionDurationHours = qualityVolumeHours / qualityDays.length;
  const qualitySessionDurationSecs = 3600 * qualitySessionDurationHours;
  const qualitySessions = topQualitySessions(qualityDays.length, qualitySessionDurationSecs);
  const qualityRestVolumeHours = qualitySessions.reduce((sum, session) => {
      const repetitions = Math.floor(qualitySessionDurationSecs / session.duration);

      return sum + Math.max(session.rest * (repetitions - 1), 0) / 3600;
  }, 0);

  const effectiveEasyVolumeHours = Math.max(easyVolumeHours - longRunVolumeHours - warmUpDownVolumeHours - qualityRestVolumeHours, 0);

  return WEEKDAYS.map((day, index) => {
    if (restingDays.includes(index)) {
      return new RestDay(day);
    } else if (index === longRunDay) {
      const longRunDuration = longRunVolumeHours * 3600;

      return new LongRunDay(day, easyRunPace, longRunDuration, functionalThresholdPace / easyRunPace);
    } else if (qualityDays.includes(index)) {
      const qualitySession = qualitySessions[qualityDays.indexOf(index)];
      const repetitions = Math.floor(qualitySessionDurationSecs / qualitySession.duration);

      const warmUpDownDuration = WARM_UP_DOWN_DURATION_HOURS * 3600;
      const qualityDuration = repetitions * qualitySession.duration;
      const restDuration = Math.max(0, (repetitions - 1) * qualitySession.rest);

      const totalSessionDuration = qualityDuration + warmUpDownDuration + restDuration;
      const averageQualityPace = (
        qualityDuration * functionalThresholdPace +
        (warmUpDownDuration + restDuration) * easyRunPace
      ) / totalSessionDuration;
      const intensityFactor = functionalThresholdPace / averageQualityPace;

      return new QualityDay(day, averageQualityPace, totalSessionDuration, intensityFactor, qualitySession);
    } else {
      const numberOfEasyDays = WEEKDAYS.length - restingDays.length - qualityDays.length - 1;
      const easyRunDuration = (effectiveEasyVolumeHours * 3600) / numberOfEasyDays;

      return new EasyDay(day, easyRunPace, easyRunDuration, functionalThresholdPace / easyRunPace);
    }
  });
}

interface WeekScheduleProps {
  longRunDay: number;
  restingDays: number[];
  qualityDays: number[];
  targetTssVolume: number;
  functionalThresholdPace: number;
}

export default function WeekSchedule({
  longRunDay,
  restingDays,
  qualityDays,
  targetTssVolume: targetVolume,
  functionalThresholdPace
}: WeekScheduleProps)
{
  const weekDays = scheduleWeekDays(longRunDay, restingDays, qualityDays, targetVolume, functionalThresholdPace);

  return (
    <table>
      <thead>
        <tr>
          <th>&nbsp;</th>
          {WEEKDAYS.map(day => {
            return <th key={day} className='-center'>{day}</th>
          })}
          <th className='-narrow'>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Type</td>
          {weekDays.map((day) => <td key={day.name} className='-center'>{day.type}</td>)}
        </tr>
        <tr>
          <td>TSS</td>
          {weekDays.map((day) => (
            <td key={day.name} className='-center -small -fade'>
              {day.tss > 0 && Math.round(day.tss)}
            </td>
          ))}
          <td className='-small -fade -narrow'>
            {Math.round(weekDays.reduce((sum, day) => sum + day.tss, 0))}
          </td>
        </tr>
        <tr>
          <td>Duration</td>
          {weekDays.map((day) => (
            <td key={day.name} className='-center -small -fade'>
              {day.duration > 0 && formatDuration(day.duration)}
            </td>
          ))}
          <td className='-small -fade -narrow'>
            {formatDuration(weekDays.reduce((sum, day) => sum + day.duration, 0))}
          </td>
        </tr>
        <tr>
          <td>Distance</td>
          {weekDays.map((day) => (
            <td key={day.name} className='-center -small -fade'>
              {day.distance > 0 && <> {formatDistance(day.distance)} km</>}
            </td>
          ))}
          <td className='-small -fade -narrow'>
            {formatDistance(weekDays.reduce((sum, day) => sum + day.distance, 0))} km
          </td>
        </tr>
        <tr>
          <td>Description</td>
          {weekDays.map((day) => (
            <td key={day.name} className='-center -small'>
              {day.description}
            </td>
          ))}
          <td>&nbsp;</td>
        </tr>
      </tbody>
    </table>
  );
}

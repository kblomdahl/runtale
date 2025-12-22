import { useMemo } from 'preact/hooks';

import Distance from '../../utils/Distance';
import Duration from '../../utils/Duration';
import { scheduleQualityDays } from './Scheduler'
import WeekSchedule from './WeekSchedule';
import QualitySessions from './QualitySessions';
import { WEEKDAYS } from './Utils';
import DurationInputField from '../../components/DurationInputField';
import CriticalSpeed from './CriticalSpeed';
import useLocalStorage from '../../utils/UseLocalStorage';
import { getNumberFromForm, getNumbersFromForm } from '../../utils/Form';
import sharedStyles from '../../styles/shared.module.css';
import styles from './NorwegianSingles.module.css';

const INPUT_TARGET_TRAINING_LOAD = 'targetTrainingLoad';
const INPUT_LONG_RUN_DAY = 'longRunDay';
const INPUT_RESTING_DAYS = 'restingDays';
const INPUT_DISTANCES = 'distances[]';
const INPUT_TIMES = 'times[]';
const INPUT_MAX_QUALITY_DAYS = 'maxQualityDays';

const DEFAULT_TARGET_VOLUME = 350;
const DEFAULT_LONG_RUN_DAY = 6; // Sunday
const DEFAULT_RESTING_DAYS = [0]; // Monday
const DEFAULT_MAX_QUALITY_DAYS = 3;
const DEFAULT_TT_DISTANCES: [Distance, Distance] = [
  Distance.fromMeters(1609.34),
  Distance.fromMeters(5000)
];
const DEFAULT_TT_TIMES: [Duration, Duration] = [
  Duration.fromMinutes(5.42),
  Duration.fromMinutes(19)
];

function NorwegianSingles() {
  const [distances, setDistances] = useLocalStorage<[Distance, Distance]>('NorwegianSingles/distances', DEFAULT_TT_DISTANCES, (distances) => JSON.parse(distances).map((d: number) => Distance.fromJSON(d)));
  const [times, setTimes] = useLocalStorage<[Duration, Duration]>('NorwegianSingles/times', DEFAULT_TT_TIMES, (times) => JSON.parse(times).map((t: number) => Duration.fromJSON(t)));
  const [targetTssVolume, setTargetVolume] = useLocalStorage<number>('NorwegianSingles/targetTssVolume', DEFAULT_TARGET_VOLUME);
  const [longRunDay, setLongRunDay] = useLocalStorage<number>('NorwegianSingles/longRunDay', DEFAULT_LONG_RUN_DAY);
  const [restingDays, setRestingDays] = useLocalStorage<number[]>('NorwegianSingles/restingDays', DEFAULT_RESTING_DAYS);
  const [maxQualityDays, setMaxQualityDays] = useLocalStorage<number>('NorwegianSingles/maxQualityDays', DEFAULT_MAX_QUALITY_DAYS);
  const criticalSpeed = useMemo(() => CriticalSpeed.fromRaces(distances, times), [distances, times]);
  const qualityDays = useMemo(() => {
    const days = WEEKDAYS
      .map((_, index) => index)
      .filter(day => !restingDays.includes(day) && day !== longRunDay);

    return scheduleQualityDays(days, maxQualityDays);
  }, [restingDays, longRunDay, maxQualityDays]);

  const setTrainingParameters = (e: SubmitEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const targetTrainingLoad = getNumberFromForm(formData, INPUT_TARGET_TRAINING_LOAD);
    const longRunDay = getNumberFromForm(formData, INPUT_LONG_RUN_DAY);
    const restingDays = getNumbersFromForm(formData, INPUT_RESTING_DAYS);
    const maxQualityDays = getNumberFromForm(formData, INPUT_MAX_QUALITY_DAYS);
    const distances = getNumbersFromForm(formData, INPUT_DISTANCES).map(value => Distance.fromMeters(value)) as [Distance, Distance];
    const times = getNumbersFromForm(formData, INPUT_TIMES).map(value => Duration.fromSeconds(value)) as [Duration, Duration];

    setMaxQualityDays(maxQualityDays);
    setTargetVolume(targetTrainingLoad);
    setLongRunDay(longRunDay);
    setRestingDays(restingDays);
    setDistances(distances);
    setTimes(times);
  };

  return <>
    <form onSubmit={setTrainingParameters} className={styles.form}>
      <div className={sharedStyles.layout__responsive}>
        <section className={sharedStyles.form}>
          <b>
            Training Plan Parameters
          </b>
          <label>
            <span>Target Training Load (ATL)</span>
            <input type='number' name={INPUT_TARGET_TRAINING_LOAD} defaultValue={DEFAULT_TARGET_VOLUME} />
          </label>
          <label>
            <span>Quality Days</span>
            <input type='number' name={INPUT_MAX_QUALITY_DAYS} defaultValue={DEFAULT_MAX_QUALITY_DAYS} min={1} max={3} />
          </label>
          <label>
            <span>Long Run Day</span>
            <select name={INPUT_LONG_RUN_DAY}>
              {WEEKDAYS.map((day, index) => (
                <option key={day} value={index} selected={DEFAULT_LONG_RUN_DAY === index}>{day}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Resting Days</span>
            <select name={INPUT_RESTING_DAYS} multiple>
              {WEEKDAYS.map((day, index) => (
                <option key={day} value={index} selected={DEFAULT_RESTING_DAYS.includes(index)}>{day}</option>
              ))}
            </select>
          </label>
        </section>
        <section className={sharedStyles.form}>
          <b>
            Critical Speed from Time Trials
          </b>
          <label>
            <span>Time Trial 1</span>
            <span className={sharedStyles.layout__cluster}>
              <input type='number' name={INPUT_DISTANCES} defaultValue={distances[0].toMeters()} placeholder={'1609.34'} width='40%' />
              <DurationInputField name={INPUT_TIMES} defaultValue={times[0]} />
            </span>
          </label>
          <label>
            <span>Time Trial 2</span>
            <span className={sharedStyles.layout__cluster}>
              <input type='number' name={INPUT_DISTANCES} defaultValue={distances[1].toMeters()} placeholder={'5000'} width='40%' />
              <DurationInputField name={INPUT_TIMES} defaultValue={times[1]} />
            </span>
          </label>
        </section>
        <button type='submit' className={sharedStyles.layout__full}>Plan</button>
      </div>
    </form>
    <hr />
    {qualityDays ?
      <>
        <WeekSchedule
          restingDays={restingDays}
          longRunDay={longRunDay}
          qualityDays={qualityDays}
          targetTssVolume={targetTssVolume}
          criticalSpeed={criticalSpeed}
        />
        <QualitySessions criticalSpeed={criticalSpeed} />
      </>
      : <p>No feasible plan found</p>
    }
  </>;
}

export default NorwegianSingles;

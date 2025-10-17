import { FormEvent, useMemo } from 'react';

import Distance from '../../utils/Distance';
import Duration from '../../utils/Duration';
import { scheduleQualityDays } from './Scheduler'
import WeekSchedule from './WeekSchedule';
import QualitySessions from './QualitySessions';
import { WEEKDAYS } from './Utils';
import DurationInputField from '../../components/DurationInputField';
import CriticalSpeed from './CriticalSpeed';
import useLocalStorage from '../../utils/UseLocalStorage';

const DEFAULT_TARGET_VOLUME = 350;
const DEFAULT_LONG_RUN_DAY = 6; // Sunday
const DEFAULT_RESTING_DAYS = [0]; // Monday
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
  const criticalSpeed = useMemo(() => CriticalSpeed.fromRaces(distances, times), [distances, times]);
  const qualityDays = useMemo(() => {
    const days = WEEKDAYS
      .map((_, index) => index)
      .filter(day => !restingDays.includes(day) && day !== longRunDay);

    return scheduleQualityDays(days);
  }, [restingDays, longRunDay]);

  const setTrainingParameters = (e: FormEvent<HTMLFormElement>) => {
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const targetTrainingLoad = (form.targetTrainingLoad as HTMLInputElement).valueAsNumber;
    const longRunDay = +(form.longRunDay as HTMLSelectElement).value;
    const restingDays = Array.from((form.restingDays as HTMLSelectElement).selectedOptions).map(option => +option.value);
    const distances = formData.getAll('distances[]').map(value => Distance.fromMeters(Number(value))) as [Distance, Distance];
    const times = formData.getAll('times[]').map(value => Duration.fromSeconds(Number(value))) as [Duration, Duration];

    setTargetVolume(targetTrainingLoad);
    setLongRunDay(longRunDay);
    setRestingDays(restingDays);
    setDistances(distances);
    setTimes(times);
    e.preventDefault();

    return true;
  };

  return <>
    <form onSubmit={e => setTrainingParameters(e)} className='-inline-block'>
      <div className='-responsive-container'>
        <section className='-aligned-form -half'>
          <b>
            Training Plan Parameters
          </b>
          <label>
            <span>Target Training Load (ATL)</span>
            <input type='number' name='targetTrainingLoad' defaultValue={DEFAULT_TARGET_VOLUME} />
          </label>
          <label>
            <span>Long Run Day</span>
            <select name='longRunDay' defaultValue={DEFAULT_LONG_RUN_DAY}>
              {WEEKDAYS.map((day, index) => (
                <option key={day} value={index}>{day}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Resting Days</span>
            <select name='restingDays' multiple defaultValue={DEFAULT_RESTING_DAYS.map(day => day.toString())}>
              {WEEKDAYS.map((day, index) => (
                <option key={day} value={index}>{day}</option>
              ))}
            </select>
          </label>
        </section>
        <section className='-aligned-form -half'>
          <b>
            Critical Speed from Time Trials
          </b>
          <label>
            <span>Time Trial 1</span>
            <span className='-flex'>
              <input type='number' name='distances[]' defaultValue={distances[0].toMeters()} placeholder={'1609.34'} width='40%' />
              <DurationInputField name='times[]' defaultValue={times[0]} />
            </span>
          </label>
          <label>
            <span>Time Trial 2</span>
            <span className='-flex'>
              <input type='number' name='distances[]' defaultValue={distances[1].toMeters()} placeholder={'5000'} width='40%' />
              <DurationInputField name='times[]' defaultValue={times[1]} />
            </span>
          </label>
        </section>
        <button type='submit' className='-width-100'>Plan</button>
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

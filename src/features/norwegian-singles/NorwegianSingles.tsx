import { useState, FormEvent, useMemo } from 'react';

import { scheduleQualityDays } from './Scheduler'
import WeekSchedule from './WeekSchedule';
import QualitySessions from './QualitySessions';
import { WEEKDAYS } from './Utils';

const DEFAULT_TARGET_VOLUME = 350;
const DEFAULT_LT2_PACE = '04:12';
const DEFAULT_LT2_PACE_NUM = parsePace(15120000);
const DEFAULT_LONG_RUN_DAY = 6; // Sunday
const DEFAULT_RESTING_DAYS = [0]; // Monday

function parsePace(hhmm: number) {
  const MILLISECONDS_PER_HOUR = 3600 * 1000;
  const hours = Math.floor(hhmm / MILLISECONDS_PER_HOUR);
  const minutes = (hhmm % MILLISECONDS_PER_HOUR) * (60 / MILLISECONDS_PER_HOUR);

  return 60 * hours + minutes;
}

function NorwegianSingles() {
  const [targetTssVolume, setTargetVolume] = useState(DEFAULT_TARGET_VOLUME);
  const [functionalThresholdPace, setFunctionalThresholdPace] = useState(DEFAULT_LT2_PACE_NUM);
  const [longRunDay, setLongRunDay] = useState(DEFAULT_LONG_RUN_DAY);
  const [restingDays, setRestingDays] = useState(DEFAULT_RESTING_DAYS);
  const qualityDays = useMemo(() => {
    const days = WEEKDAYS
      .map((_, index) => index)
      .filter(day => !restingDays.includes(day) && day !== longRunDay);

    return scheduleQualityDays(days);
  }, [restingDays, longRunDay]);

  const setTrainingParameters = (e: FormEvent<HTMLFormElement>) => {
    const form = e.target as HTMLFormElement;
    const targetTrainingLoad = (form.targetTrainingLoad as HTMLInputElement).valueAsNumber;
    const functionalThresholdPace = (form.functionalThresholdPace as HTMLInputElement).valueAsNumber;
    const longRunDay = +(form.longRunDay as HTMLSelectElement).value;
    const restingDays = Array.from((form.restingDays as HTMLSelectElement).selectedOptions).map(option => +option.value);

    setTargetVolume(targetTrainingLoad);
    setFunctionalThresholdPace(parsePace(functionalThresholdPace));
    setLongRunDay(longRunDay);
    setRestingDays(restingDays);
    e.preventDefault();

    return true;
  };

  return <>
    <form onSubmit={e => setTrainingParameters(e)} className='-multiple'>
      <label>
        <span>Target Training Load (ATL)</span>
        <input type='number' name='targetTrainingLoad' defaultValue={DEFAULT_TARGET_VOLUME} />
      </label>
      <label>
        <span>LT₂ Pace (min/km)</span>
        <input type='time' name='functionalThresholdPace' defaultValue={DEFAULT_LT2_PACE} />
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
      <button type='submit'>Plan</button>
    </form>
    <hr />
    {qualityDays ?
      <>
        <WeekSchedule
          restingDays={restingDays}
          longRunDay={longRunDay}
          qualityDays={qualityDays}
          targetTssVolume={targetTssVolume}
          functionalThresholdPace={functionalThresholdPace}
        />
        <QualitySessions />
      </>
      : <p>No feasible plan found</p>
    }
  </>;
}

export default NorwegianSingles;
 
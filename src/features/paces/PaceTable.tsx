import { useState, FormEvent } from 'react';
import DurationInputField from '../../components/DurationInputField';

const DEFAULT_PACES = Array.from({ length: 10 }, (_, i) => 390 - i * 10)
  .concat(Array.from({ length: 24 }, (_, i) => 295 - i * 5));

const DISTANCE_1_MILE_KM = 1.60934;
const DISTANCE_5_KM = 5.0;
const DISTANCE_10_KM = 10.0;
const DISTANCE_30_KM = 30.0;
const DISTANCE_HALF_MARATHON_KM = 21.0975;
const DISTANCE_MARATHON_KM = 42.195;
const SECONDS_PER_HOUR = 3600.0;
const NUMBER_FORMAT = new Intl.NumberFormat(undefined, {
  minimumIntegerDigits: 2,
  maximumFractionDigits: 0
});

function formatSeconds(seconds: number) {
  const parts = [
    Math.floor(seconds / 3600),
    Math.floor(seconds / 60),
    seconds,
  ];

  return parts.filter(part => part > 0).map(part => NUMBER_FORMAT.format(part % 60)).join(':');
}

function formatDecimals(x: number) {
  return x.toFixed(1);
}

function PaceTable() {
  const [paces, setPaces] = useState(DEFAULT_PACES);
  const [customPaces, setCustomPaces] = useState(new Set());
  const addPace = (e: FormEvent<HTMLFormElement>) => {
    const form = e.target as HTMLFormElement;
    const newPace = +(form.pace as HTMLInputElement).value;
    const newPaces = [...new Set([...paces, newPace])];

    newPaces.sort((a, b) => b - a);
    setPaces(newPaces);
    setCustomPaces(new Set([...customPaces, newPace]));
    e.preventDefault();

    return true;
  };

  return <>
    <p>
      This table shows the time it would take to run a certain distance at a certain pace.
    </p>
    <form onSubmit={e => addPace(e)} className='-single'>
      <label>
          <span>Pace</span>
          <DurationInputField name="pace" defaultValue={'04:00'} />
      </label>
      <button type='submit'>Add to table</button>
    </form>
    <table>
      <thead>
        <tr>
          <th>Pace (min/km)</th>
          <th>Pace (km/h)</th>
          <th>1 mile</th>
          <th>5 kilometers</th>
          <th>10 kilometers</th>
          <th>Half Marathon</th>
          <th>30 kilometers</th>
          <th>Marathon</th>
        </tr>
      </thead>
      <tbody>
        {
          paces.map(pace => {
            return <tr key={pace} className={customPaces.has(pace) ? '-highlight' : ''}>
              <td>{formatSeconds(pace)}</td>
              <td>{formatDecimals(SECONDS_PER_HOUR / pace)}</td>
              <td>{formatSeconds(pace * DISTANCE_1_MILE_KM)}</td>
              <td>{formatSeconds(pace * DISTANCE_5_KM)}</td>
              <td>{formatSeconds(pace * DISTANCE_10_KM)}</td>
              <td>{formatSeconds(pace * DISTANCE_HALF_MARATHON_KM)}</td>
              <td>{formatSeconds(pace * DISTANCE_30_KM)}</td>
              <td>{formatSeconds(pace * DISTANCE_MARATHON_KM)}</td>
            </tr>;
          })
        }
      </tbody>
    </table>
  </>;
}

export default PaceTable;

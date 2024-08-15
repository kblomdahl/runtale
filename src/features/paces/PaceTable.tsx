import { useState, FormEvent } from 'react';

const DEFAULT_PACES = Array.from({ length: 10 }, (_, i) => 390 - i * 10)
  .concat(Array.from({ length: 24 }, (_, i) => 295 - i * 5));

const DISTANCE_1_MILE_KM = 1.60934;
const DISTANCE_5_KM = 5.0;
const DISTANCE_10_KM = 10.0;
const DISTANCE_HALF_MARATHON_KM = 21.0975;
const DISTANCE_MARATHON_KM = 42.195;
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

// The time input fields use the format `HH:mm` but we're using it as if it
// was a `mm:ss` format. So we need to convert between them, for example
// `hhmm` is `14220000` is equivalent to `3:57`.
function parsePace(hhmm: number) {
  const MILLISECONDS_PER_HOUR = 3600 * 1000;
  const hours = Math.floor(hhmm / MILLISECONDS_PER_HOUR);
  const minutes = (hhmm % MILLISECONDS_PER_HOUR) * (60 / MILLISECONDS_PER_HOUR);

  return 60 * hours + minutes;
}

function PaceTable() {
  const [paces, setPaces] = useState(DEFAULT_PACES);
  const [customPaces, setCustomPaces] = useState(new Set());
  const addPace = (e: FormEvent<HTMLFormElement>) => {
    const form = e.target as HTMLFormElement;
    const newPace = parsePace(form?.pace?.valueAsNumber);
    const newPaces = [...new Set([...paces, newPace])];

    newPaces.sort((a, b) => b - a);
    setPaces(newPaces);
    setCustomPaces(new Set([...customPaces, newPace]));
    e.preventDefault();
  };

  return <>
    <p>
      This table shows the time it would take to run a certain distance at a certain pace.
    </p>
    <form onSubmit={e => addPace(e)} className='-single'>
      <label>
          <span>Pace</span>
          <input type="time" name="pace" max={'10:00'} defaultValue={'04:00'} />
      </label>
      <button type='submit'>Add to table</button>
    </form>
    <table>
      <thead>
        <tr>
          <th>Pace (min/km)</th>
          <th>1 mile</th>
          <th>5 kilometers</th>
          <th>10 kilometers</th>
          <th>Half Marathon</th>
          <th>Marathon</th>
        </tr>
      </thead>
      <tbody>
        {
          paces.map(pace => {
            return <tr key={pace} className={customPaces.has(pace) ? '-highlight' : ''}>
              <td>{formatSeconds(pace)}</td>
              <td>{formatSeconds(pace * DISTANCE_1_MILE_KM)}</td>
              <td>{formatSeconds(pace * DISTANCE_5_KM)}</td>
              <td>{formatSeconds(pace * DISTANCE_10_KM)}</td>
              <td>{formatSeconds(pace * DISTANCE_HALF_MARATHON_KM)}</td>
              <td>{formatSeconds(pace * DISTANCE_MARATHON_KM)}</td>
            </tr>;
          })
        }
      </tbody>
    </table>
  </>;
}

export default PaceTable;

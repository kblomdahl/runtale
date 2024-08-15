import { useState, FormEvent } from "react";

const DEFAULT_RESTING = 42;
const DEFAULT_MAXIMUM = 196;
const DEFAULT_LACTATE_THRESHOLD = 174;

function calculateLactateThreshold(resting: number, lactateThreshold: number) {
  return [
    resting,
    0.85 * lactateThreshold,
    0.90 * lactateThreshold,
    0.95 * lactateThreshold,
    1.00 * lactateThreshold,
    1.06 * lactateThreshold,
  ];
}

function calculateReserve(resting: number, maximum: number) {
  const reserve = maximum - resting;

  return [
    resting + 0.5 * reserve,
    resting + 0.6 * reserve,
    resting + 0.7 * reserve,
    resting + 0.8 * reserve,
    resting + 0.9 * reserve,
    resting + 1.0 * reserve,
  ];
}

function calculateMaximum(maximum: number) {
  return [
    0.5 * maximum,
    0.6 * maximum,
    0.7 * maximum,
    0.8 * maximum,
    0.9 * maximum,
    1.0 * maximum,
  ];
}

function calculateZones(resting: number, maximum: number, lactateThreshold: number) {
  const mhr = calculateMaximum(maximum);
  const hrr = calculateReserve(resting, maximum);
  const lthr = calculateLactateThreshold(resting, lactateThreshold);

  return [
    '(Recovery) 1',
    '(Aerobic) 2',
    '(Tempo) 3',
    '(Threshold) 4',
    '(Maximum) 5',
  ].map((zone, i) => {
    return {
      zone,
      mhr: { lower: mhr[i], upper: mhr[i+1] },
      hrr: { lower: hrr[i], upper: hrr[i+1] },
      lthr: { lower: lthr[i], upper: lthr[i+1] },
    };
  });
}

function HeartZones() {
  const [zones, setZones] = useState(calculateZones(DEFAULT_RESTING, DEFAULT_MAXIMUM, DEFAULT_LACTATE_THRESHOLD));
  const updateZoneValues = (e: FormEvent<HTMLFormElement>) => {
    const form = e.target as HTMLFormElement;
    const resting = form?.resting?.valueAsNumber;
    const maximum = form?.maximum?.valueAsNumber;
    const lactateThreshold = form?.lactateThreshold?.valueAsNumber;

    setZones(calculateZones(resting, maximum, lactateThreshold));
    e.preventDefault();
  };

  return <>
    <p>
      This table shows the heart rate zones based on your resting heart rate,
      maximum heart rate, and lactate threshold.
    </p>
    <form onSubmit={e => updateZoneValues(e)} className='-multiple'>
      <label>
        <span>Resting</span>
        <input type='number' name='resting' defaultValue={DEFAULT_RESTING} />
      </label>
      <label>
        <span>Maximum</span>
        <input type='number' name='maximum' defaultValue={DEFAULT_MAXIMUM} />
      </label>
      <label>
        <span>Lactate Threshold</span>
        <input type='number' name='lactateThreshold' defaultValue={DEFAULT_LACTATE_THRESHOLD} />
      </label>
      <button type='submit'>Calculate zones</button>
    </form>
    <table>
      <thead>
        <tr>
          <th>Zone</th>
          <th>MHR%</th>
          <th>HRR%</th>
          <th>LTHR%</th>
        </tr>
      </thead>
      <tbody>
        {
          zones.map(({zone, mhr, hrr, lthr}) => {
            return <tr key={zone}>
              <td>{zone}</td>
              <td>{mhr.lower.toFixed(0)} - {mhr.upper.toFixed(0)}</td>
              <td>{hrr.lower.toFixed(0)} - {hrr.upper.toFixed(0)}</td>
              <td>{lthr.lower.toFixed(0)} - {lthr.upper.toFixed(0)}</td>
            </tr>;
          })
        }
      </tbody>
    </table>
  </>;
}

export default HeartZones;

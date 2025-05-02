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
    ['(Recovery) 1', 'Muscle recovery'],
    ['(Aerobic) 2', 'Muscle recovery and improves aerobic capacity'],
    ['(Tempo) 3', 'Improves aerobic capacity'],
    ['(Threshold) 4', 'Improves lactate threshold'],
    ['(Maximum) 5', 'Improves V̇O₂ max and speed'],
  ].map(([zone, benefit], i) => {
    return {
      zone,
      benefit,
      mhr: { lower: mhr[i], upper: mhr[i+1] },
      hrr: { lower: hrr[i], upper: hrr[i+1] },
      lthr: { lower: lthr[i], upper: lthr[i+1] },
    };
  });
}

interface HeartZonesProps {
  resting: number;
  maximum: number;
  lactateThreshold: number;
}

function HeartZones({ resting, maximum, lactateThreshold }: HeartZonesProps) {
  const zones = calculateZones(resting, maximum, lactateThreshold);

  return <>
    <p>
      This table shows the heart rate zones together with their benefits based
      on your resting heart rate, maximum heart rate, and lactate threshold.
    </p>
    <table>
      <thead>
        <tr>
          <th>Zone</th>
          <th>MHR%</th>
          <th>HRR%</th>
          <th>LTHR%</th>
          <th className="-left -wide">Benefits</th>
        </tr>
      </thead>
      <tbody>
        {
          zones.map(({zone, benefit, mhr, hrr, lthr}) => {
            return <tr key={zone}>
              <td>{zone}</td>
              <td>{mhr.lower.toFixed(0)} - {mhr.upper.toFixed(0)}</td>
              <td>{hrr.lower.toFixed(0)} - {hrr.upper.toFixed(0)}</td>
              <td>{lthr.lower.toFixed(0)} - {lthr.upper.toFixed(0)}</td>
              <td className="-left">{benefit}</td>
            </tr>;
          })
        }
      </tbody>
    </table>
  </>;
}

export default HeartZones;

function calculateMaximum(maximum: number) {
  const vt_1 = maximum * 0.65;
  const vt_2 = maximum * 0.75;

  return { name: 'MHR%', vt_1: vt_1, vt_2: vt_2 };
}

function calculateReserve(resting: number, maximum: number) {
  const reserve = maximum - resting;
  const vt_1 = resting + reserve * 0.625;
  const vt_2 = resting + reserve * 0.85;

  return { name: 'HRR%', vt_1: vt_1, vt_2: vt_2 };
}

function calculateZones(resting: number, maximum: number) {
  return [
    calculateMaximum(maximum),
    calculateReserve(resting, maximum),
  ].map(({ name, vt_1, vt_2 }) => {
    return {
      name: name,
      low_aerobic: {
        lower: resting,
        upper: vt_1
      },
      high_aerobic: {
        lower: vt_1,
        upper: vt_2
      },
      anaerobic: {
        lower: vt_2,
        upper: maximum
      }
    };  
  });
}

interface LactateZonesProps {
  resting: number;
  maximum: number;
}

function LactateZones({ resting, maximum }: LactateZonesProps) {
  const zones = calculateZones(resting, maximum);

  return <>
    <p>
      This table shows the three zone system based on lactate threshold (LT₁, LT₂) that
      is commonly used in academic literature. The heart rate estimates are very rough
      and should not be used.
    </p>
    <table>
      <thead>
        <tr>
          <th>Zone</th>
          {zones.map(zone => <th key={zone.name}>{zone.name}</th>)}
          <th>LTHR%</th>
          <th>Lactate (mM)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>(Low Aerobic) 1</td>
          {zones.map(zone => <td key={zone.name}>{zone.low_aerobic.lower.toFixed(0)} - {zone.low_aerobic.upper.toFixed(0)}</td>)}
          <td>x &le; LT₁</td>
          <td>x &le; 2.0</td>
        </tr>
        <tr>
          <td>(High Aerobic) 2</td>
          {zones.map(zone => <td key={zone.name}>{zone.high_aerobic.lower.toFixed(0)} - {zone.high_aerobic.upper.toFixed(0)}</td>)}
          <td>LT₁ &lt; x &lt; LT₂</td>
          <td>2.0 &lt; x &lt; 4.0</td>
        </tr>
        <tr>
          <td>(Anaerobic) 3</td>
          {zones.map(zone => <td key={zone.name}>{zone.anaerobic.lower.toFixed(0)} - {zone.anaerobic.upper.toFixed(0)}</td>)}
          <td>x &ge; LT₂</td>
          <td>x &ge; 4.0</td>
        </tr>
      </tbody>
    </table>
  </>;
}

export default LactateZones;
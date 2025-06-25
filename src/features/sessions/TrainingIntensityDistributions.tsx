const DISTRIBUTIONS = [
  {
    name: 'Polarized',
    low_aerobic: 0.8,
    high_aerobic: 0.05,
    anaerobic: 0.15,
  },
  {
    name: 'Pyramid',
    low_aerobic: 0.7,
    high_aerobic: 0.2,
    anaerobic: 0.1,
  },
  {
    name: 'Threshold',
    low_aerobic: 0.4,
    high_aerobic: 0.5,
    anaerobic: 0.1,
  },
  {
    name: 'High',
    low_aerobic: 0.2,
    high_aerobic: 0.1,
    anaerobic: 0.7,
  }
];

function TrainingIntensityDistributions() {
  return <>
    <p>
      This table shows a few common training intensity distributions (TID) for endurance training. The percentages are the proportion of heart rate time in zone (HR TIZ).
    </p>
    <table>
      <thead>
        <tr>
          <th>Zone</th>
          {DISTRIBUTIONS.map(tid => <th key={tid.name}>{tid.name}</th>)}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Anaerobic</td>
          {DISTRIBUTIONS.map(tid => <td key={tid.name}>{Math.round(100.0 * tid.anaerobic)}%</td>)}
        </tr>
        <tr>
          <td>High Aerobic</td>
          {DISTRIBUTIONS.map(tid => <td key={tid.name}>{Math.round(100.0 * tid.high_aerobic)}%</td>)}
        </tr>
        <tr>
          <td>Low Aerobic</td>
          {DISTRIBUTIONS.map(tid => <td key={tid.name}>{Math.round(100.0 * tid.low_aerobic)}%</td>)}
        </tr>
      </tbody>
    </table>
  </>;
}

export default TrainingIntensityDistributions;

const RPE_TABLE = [
  { rpe: 1, intensity: 'Very Easy' },
  { rpe: 2, intensity: 'Easy' },
  { rpe: 3, intensity: 'Moderate' },
  { rpe: 4, intensity: 'Somewhat Hard', breakpoint: 'LT₁' },
  { rpe: 5, intensity: 'Hard' },
  { rpe: 6, intensity: 'Hard', breakpoint: 'LT₂' },
  { rpe: 7, intensity: 'Very Hard' },
  { rpe: 8, intensity: 'Very Hard' },
  { rpe: 9, intensity: 'Extremely Hard' },
  { rpe: 10, intensity: 'Maximal' },
];

function SessionRPENumber() {
  return <>
    <p>
      This table shows the rated perceived exertion (RPE) number based on your perception of the intensity, or physical stress, of an entire training session.
    </p>
    <table>
      <thead>
        <tr>
          <th>RPE Number</th>
          <th>Intensity</th>
        </tr>
      </thead>
      <tbody>
        {RPE_TABLE.map(({ rpe, intensity, breakpoint }) => {
          return <>
            <tr key={rpe}>
              <td>{rpe}</td>
              <td>{intensity}</td>
            </tr>
            { breakpoint && (
              <tr key={breakpoint}>
                <td colSpan={2} className="-center -bold">{breakpoint}</td>
              </tr>
            )}
          </>;
        })}
      </tbody>
    </table>
  </>;
}

export default SessionRPENumber;

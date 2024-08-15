import { RPE_TABLE } from './RPETable';

function RPENumber() {
  return <>
    <p>This table shows the rated perceived exertion (RPE) number based on your repetitions in reserve (RIR) at the end of a set.</p>
    <table>
      <thead>
        <tr>
          <th>RPE Number</th>
          <th>In Reserve</th>
        </tr>
      </thead>
      <tbody>
        {RPE_TABLE.map(({ rpe, reserve }) => {
          return <tr key={rpe}>
            <td>{rpe}</td>
            <td>{reserve} rep</td>
          </tr>;
        })}
      </tbody>
    </table>
  </>;
}

export default RPENumber;

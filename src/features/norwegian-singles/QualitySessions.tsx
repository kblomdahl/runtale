import { QUALITY_SESSIONS, formatDuration } from "./Utils";

export default function QualitySessions() {
  return <>
    <p className='-bold'>Quality Session</p>
    <p>
      This table show the time based interval sessions for your quality days.

      The pace is useful as a starting point but is highly variable and should be adjusted based on effort and heart rate.
    </p>
    <p>
      Each interval should feel comfortably hard, but strictly below your LT₂ heart rate for the entire duration.

      Avoid over-recovery between intervals, prefer a slow jog to clear metabolic byproducts during rest.
    </p>

    <table>
      <thead>
        <tr>
          <th>Format</th>
          <th className='-center'>Interval Duration</th>
          <th className='-center'>Rest Duration</th>
          <th className='-left -wide'>Pace</th>
        </tr>
      </thead>
      <tbody>
        {QUALITY_SESSIONS.map(session => (
          <tr key={session.name}>
            <td>{session.name}</td>
            <td className='-center'>{formatDuration(session.duration, 2)}</td>
            <td className='-center'>{formatDuration(session.rest, 2)}</td>
            <td className='-left -wide'>{session.pace}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>;
}

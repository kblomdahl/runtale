import { QUALITY_SESSIONS } from "./QualitySession";
import CriticalSpeed from "./CriticalSpeed";

interface QualitySessionsProps {
  criticalSpeed: CriticalSpeed;
}

export default function QualitySessions({ criticalSpeed }: QualitySessionsProps) {
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
          <th className='-right'>Pace (min/km)</th>
          <th className='-left -wide'>Description</th>
        </tr>
      </thead>
      <tbody>
        {QUALITY_SESSIONS.map(session => (
          <tr key={session.name}>
            <td>{session.name}</td>
            <td className='-center'>{session.interval.format(2)}</td>
            <td className='-center'>{session.rest.format(2)}</td>
            <td className='-right'>{session.speed(criticalSpeed).toMinutesPerKilometer()}</td>
            <td className='-left -wide'>{session.paceDescription}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>;
}

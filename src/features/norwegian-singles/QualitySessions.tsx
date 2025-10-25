import { QUALITY_SESSIONS } from "./QualitySession";
import CriticalSpeed from "./CriticalSpeed";
import styles from '../../styles/shared.module.css';

interface QualitySessionsProps {
  criticalSpeed: CriticalSpeed;
}

export default function QualitySessions({ criticalSpeed }: QualitySessionsProps) {
  return <>
    <p className={styles.text__heading}>Quality Session</p>
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
          <th className={styles.table__headerCenter}>Interval Duration</th>
          <th className={styles.table__headerCenter}>Rest Duration</th>
          <th>Pace (min/km)</th>
          <th className={`${styles.table__headerLabel} ${styles.table__colWide}`}>Description</th>
        </tr>
      </thead>
      <tbody>
        {QUALITY_SESSIONS.map(session => (
          <tr key={session.name}>
            <td>{session.name}</td>
            <td className={styles.table__cell}>{session.interval.format(2)}</td>
            <td className={styles.table__cell}>{session.rest.format(2)}</td>
            <td className={styles.table__cellValue}>{session.speed(criticalSpeed).toMinutesPerKilometer()}</td>
            <td className={`${styles.table__cellLabel} ${styles.table__colWide}`}>{session.paceDescription}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>;
}

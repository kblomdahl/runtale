import { Fragment } from "preact";
import styles from '../../styles/shared.module.css';

const ANAEROBIC_SESSIONS = [
  {
    name: '🔵 Sprint',
    description: 'Very short, all-out efforts typically between 10 to 15 seconds long. Prioritize full recovery, usually involing walking or resting in between sprints. Focus on maintaining good running form and technique.',
  },
  {
    name: '🔵 Anaerobic Capacity',
    description: 'Short intervals, controlled very-fast efforts typically between 30 seconds to a few minutes long. Prioritize full recovery, usually involving a very slow jog or walking in between intervals.',
  }
];

const HIGH_AEROBIC_SESSIONS = [
  {
    name: '🟠 V̇O₂ Max',
    description: 'Short intervals of very hard efforts, typically between 3 to 5 minutes long. Avoid over-recovery between intervals, prefer a very slow jog to clear metabolic byproducts between intervals.',
  },
  {
    name: '🟠 Threshold',
    description: 'Hard but controlled efforts, typically between 20 to 40 minutes long at or just above your lactate threshold. Focus on maintaining your effort, not pace, to avoid slipping into higher intensities.  Avoid over-recovery between intervals, prefer a very slow jog to clear metabolic byproducts between intervals.',
  },
  {
    name: '🟠 Tempo',
    description: 'Comfortably hard efforts, typically between 20 to 60+ minutes long just below your lactate threshold. Focus on maintaining your effort, not pace, to avoid slipping into higher intensities. Avoid over-recovery between intervals, prefer a very slow jog to clear metabolic byproducts between intervals.',
  }
];

const LOW_AEROBIC_SESSIONS = [
  {
    name: '🟢 Base',
    description: 'Long to very long comfortable efforts. Focus on maintaining your effort, not pace, due to heart rate drift.',
  },
  {
    name: '🟢 Recovery',
    description: 'Very light effort, typically at most 45 minutes long. Focus on maintaining a very light effort to aid active recovery and clear metabolic byproducts.',
  }
];

function TrainingSession(props: { name: string, description: string }) {
  return <p>
    <span className={styles.text__label}>{props.name}</span>
    <br />
    {props.description}
  </p>;
}

function TrainingSessions() {
  const session_types = [
    { name: 'Anaerobic', sessions: ANAEROBIC_SESSIONS },
    { name: 'High Aerobic', sessions: HIGH_AEROBIC_SESSIONS },
    { name: 'Low Aerobic', sessions: LOW_AEROBIC_SESSIONS },
  ];

  return <>
    {session_types.map(({ name, sessions }, index) => <Fragment key={name}>
        {index > 0 && <hr />}
        <p className={styles.text__heading}>
          {name}
        </p>
        {sessions.map(session => (
          <TrainingSession {...session} key={session.name} />
        ))}
      </Fragment>
    )}
  </>;
}

export default TrainingSessions;

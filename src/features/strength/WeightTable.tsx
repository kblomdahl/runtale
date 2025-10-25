import { Fragment } from "preact";
import { useMemo } from "preact/hooks";
import { RPE_TABLE } from './RPETable';
import useLocalStorage from "../../utils/UseLocalStorage";
import { getNumberFromForm } from '../../utils/Form';
import sharedStyles from '../../styles/shared.module.css';
import styles from './WeightTable.module.css';

const INPUT_WEIGHT = 'weight';
const INPUT_REPS = 'reps';
const INPUT_RPE = 'rpe';

const DEFAULT_WEIGHT = 55.0;
const DEFAULT_REPS = 8.0;
const DEFAULT_RPE = 7.5;

/// This is based on https://www.rpecalculator.com/index.html
const REPETITION_PCT = [
  { reps: 1, pct: 1.000 },
  { reps: 2, pct: 0.955 },
  { reps: 3, pct: 0.922 },
  { reps: 4, pct: 0.892 },
  { reps: 5, pct: 0.863 },
  { reps: 6, pct: 0.837 },
  { reps: 7, pct: 0.811 },
  { reps: 8, pct: 0.786 },
  { reps: 9, pct: 0.762 },
  { reps: 10, pct: 0.739 },
  { reps: 11, pct: 0.707 },
  { reps: 12, pct: 0.680 },
  { reps: 13, pct: 0.653 },
  { reps: 14, pct: 0.626 },
  { reps: 15, pct: 0.599 },
  { reps: 16, pct: 0.574 },
];

function interp(xs: number[], ys: number[], x: number) {
  const indices = Array.from(xs.keys());
  indices.sort((i, j) => xs[j] - xs[i]);

  const minIndex = indices.findIndex(i => xs[i] <= x) || indices.length - 1;
  const maxIndex = minIndex - 1;

  if (maxIndex < 0) {
    return ys[indices[minIndex]];
  } else {
    const x0 = xs[indices[minIndex]];
    const x1 = xs[indices[maxIndex]];
    const y0 = ys[indices[minIndex]];
    const y1 = ys[indices[maxIndex]];

    return y0 + (x - x0) * (y1 - y0) / (x1 - x0);
  }
}

function calculateOneRepMax(weight: number, reps: number, rpe: number) {
  const reserve = interp(
    RPE_TABLE.map(({ rpe }) => rpe),
    RPE_TABLE.map(({ reserve }) => reserve),
    rpe
  );
  const pct = interp(
    REPETITION_PCT.map(({ reps }) => reps),
    REPETITION_PCT.map(({ pct }) => pct),
    reps + reserve
  );

  return weight / pct;
}

function WeightTableHead() {
  return <thead>
    <tr>
      <th>Repetitions</th>
      {RPE_TABLE.map(({ rpe }) => <th key={rpe} colSpan={2}>{rpe} RPE</th>)}
    </tr>
  </thead>;
}

interface WeightTableBodyProps {
  oneRepMax: number;
}

function WeightTableBody({ oneRepMax }: WeightTableBodyProps) {
  return <tbody>
    {REPETITION_PCT.map(({ reps }, index, array) => <tr key={reps}>
      <td>{reps}</td>
      {RPE_TABLE.map(({ rpe, reserve }) => {
        const pct = array[index + reserve]?.pct;

        return <Fragment key={rpe}>
          <td className={styles.text__secondary}>{pct && `${Math.round(pct * 100).toString()}%`}</td>
          <td>{pct && Math.round(oneRepMax * pct)}</td>
        </Fragment>;
      })}
    </tr>)}
  </tbody>;
}

function WeightTable() {
  const [weight, setWeight] = useLocalStorage('WeightTable/weight', DEFAULT_WEIGHT);
  const [reps, setReps] = useLocalStorage('WeightTable/reps', DEFAULT_REPS);
  const [rpe, setRpe] = useLocalStorage('WeightTable/rpe', DEFAULT_RPE);
  const oneRepMax = useMemo(() => calculateOneRepMax(weight, reps, rpe), [weight, reps, rpe]);
  const updateRepRPEValues = (e: SubmitEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const weight = getNumberFromForm(formData, INPUT_WEIGHT);
    const reps = getNumberFromForm(formData, INPUT_REPS);
    const rpe = getNumberFromForm(formData, INPUT_RPE);

    setWeight(weight);
    setReps(reps);
    setRpe(rpe);
  };

  return <>
    <p>This table shows the weight to maintain a given RPE and number of repetitions based on an estimated one-rep max.</p>
    <form onSubmit={updateRepRPEValues} className={styles.form}>
      <section className={sharedStyles.form}>
        <label>
          <span>Weight</span>
          <input type='number' step={0.5} name={INPUT_WEIGHT} defaultValue={weight} />
        </label>
        <label>
          <span>Repetitions</span>
          <input type='number' name={INPUT_REPS} defaultValue={reps} />
        </label>
        <label>
          <span>RPE Number</span>
          <input type='number' step={0.25} name={INPUT_RPE} defaultValue={rpe} />
        </label>
        <button type='submit'>Calculate weights</button>
      </section>
    </form>
    <table>
      <WeightTableHead />
      <WeightTableBody oneRepMax={oneRepMax} />
    </table>
  </>;
}

export default WeightTable;

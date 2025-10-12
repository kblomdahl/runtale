import { useState, useMemo, FormEvent, useEffect } from 'react';
import { XGBoost } from '@fractal-solutions/xgboost-js';

const DEFAULT_VO2MAX = 57;
const DEFAULT_LT2_PACE = "04:12";
const DEFAULT_AGE = 38;
const DEFAULT_GENDER = "male";
const DISTANCES = [
  { label: '1 mile', value: 1609 },
  { label: '5 kilometers', value: 5000 },
  { label: '10 kilometers', value: 10000 },
  { label: 'Half Marathon', value: 21097.5 },
  { label: 'Marathon', value: 42195 },
];
const NUMBER_FORMAT = new Intl.NumberFormat(undefined, {
  minimumIntegerDigits: 2,
  maximumFractionDigits: 0
});

interface Racer {
  vo2max: number;
  lt2pace: number;
  gender: string;
  age: number;
}

function formatSeconds(seconds: number) {
  const parts = [
    Math.floor(seconds / 3600),
    Math.floor(seconds / 60),
    seconds,
  ];

  return parts.filter(part => part > 0).map(part => NUMBER_FORMAT.format(part % 60)).join(':');
}

function parsePace(hhmm: number) {
  const MILLISECONDS_PER_HOUR = 3600 * 1000;
  const hours = Math.floor(hhmm / MILLISECONDS_PER_HOUR);
  const minutes = (hhmm % MILLISECONDS_PER_HOUR) * (60 / MILLISECONDS_PER_HOUR);

  return 60 * hours + minutes;
}

function predictPace(model: XGBoost, racer: Racer, distance: number) {
  const x = [
    racer.lt2pace,
    racer.vo2max,
    racer.age,
    racer.gender === "male" ? 1 : 0,
    distance,
  ];
  let regressionValue = 0.0;

  for (const tree of model.trees) {
    regressionValue += model.learningRate * model._predict(x, tree.root);
  }

  return regressionValue;
}

interface RacePredictionProps {
  model: XGBoost;
  racer: Racer;
  distance: number;
}

function RacePrediction({ model, racer, distance }: RacePredictionProps) {
  const prediction = useMemo(() => predictPace(model, racer, distance), [model, racer, distance]);

  return <>{formatSeconds(prediction)}</>;
}

function RacePredictor() {
  const [racePredictorModel, setRacePredictorModel] = useState<XGBoost | null>(null);
  const [racers, setRacers] = useState<Racer[]>([]);
  const addRacer = (e: FormEvent<HTMLFormElement>) => {
    const form = e.target as HTMLFormElement;
    const vo2max = (form.vo2max as HTMLInputElement).valueAsNumber;
    const lt2pace = parsePace((form.lactateThresholdPace as HTMLInputElement).valueAsNumber);
    const gender = (form.gender as HTMLInputElement).value;
    const age = (form.age as HTMLInputElement).valueAsNumber;

    e.preventDefault();
    setRacers(prev => [
      ...prev,
      { vo2max, lt2pace, gender, age }
    ]);

    return true;
  };

  useEffect(() => {
    const fetchData = async() => {
      const response = await fetch(`models/race-predictor.json`);
      const modelData = await response.json();
      const model = XGBoost.fromJSON(modelData);

      setRacePredictorModel(model);
    };

    fetchData();
  }, []);

  return <>
    <form onSubmit={e => addRacer(e)} className='-multiple'>
      <label>
        <span>Age</span>
        <input type='number' name='age' defaultValue={DEFAULT_AGE} />
      </label>
      <label>
        <span>Gender</span>
        <select name="gender" defaultValue={DEFAULT_GENDER} required>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </label>
      <label>
        <span>V̇O₂ max</span>
        <input type='number' name='vo2max' defaultValue={DEFAULT_VO2MAX} />
      </label>
      <label>
        <span>LT₂ Pace (min/km)</span>
        <input type='time' name='lactateThresholdPace' defaultValue={DEFAULT_LT2_PACE} />
      </label>
      <button type='submit'>Add Predictions</button>
    </form>

    <hr />

    <table>
      <thead>
        <tr>
          <th>Age</th>
          <th>Gender</th>
          <th>V̇O₂ max</th>
          <th>LT₂ Pace</th>
          {DISTANCES.map(distance => <th key={distance.value}>{distance.label}</th>)}
        </tr>
      </thead>
      <tbody>
        {racers.map((racer, index) => <tr key={index}>
          <td>{racer.age}</td>
          <td>{racer.gender === "male" ? "Male" : "Female"}</td>
          <td>{racer.vo2max}</td>
          <td>{formatSeconds(racer.lt2pace)}</td>
          {DISTANCES.map(distance => {
            if (!racePredictorModel) {
              return <td key={distance.value} colSpan={2}>...</td>;
            }

            return <td key={distance.value}>
              <RacePrediction model={racePredictorModel} racer={racer} distance={distance.value} />
            </td>;
          })}
        </tr>)}
      </tbody>
    </table>
  </>;
}

export default RacePredictor;

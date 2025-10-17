import { FormEvent, useState } from "react";
import HeartZones from "./HeartZones";
import LactateZones from "./LactateZones";
import SessionRPENumber from './SessionRPENumber';

export const DEFAULT_RESTING = 42;
export const DEFAULT_MAXIMUM = 183;
export const DEFAULT_LACTATE_THRESHOLD = 168;

function Zones() {
  const [resting, setResting] = useState(DEFAULT_RESTING);
  const [maximum, setMaximum] = useState(DEFAULT_MAXIMUM);
  const [lactateThreshold, setLactateThreshold] = useState(DEFAULT_LACTATE_THRESHOLD);

  const updateZoneValues = (e: FormEvent<HTMLFormElement>) => {
    const form = e.target as HTMLFormElement;
    setResting((form.resting as HTMLInputElement).valueAsNumber);
    setMaximum((form.maximum as HTMLInputElement).valueAsNumber);
    setLactateThreshold((form.lactateThreshold as HTMLInputElement).valueAsNumber);

    e.preventDefault();

    return true;
  };

  return <>
    <form onSubmit={e => updateZoneValues(e)}>
      <section className='-aligned-form'>
        <label>
          <span>Resting</span>
          <input type='number' name='resting' defaultValue={DEFAULT_RESTING} />
        </label>
        <label>
          <span>Maximum</span>
          <input type='number' name='maximum' defaultValue={DEFAULT_MAXIMUM} />
        </label>
        <label>
          <span>Lactate Threshold</span>
          <input type='number' name='lactateThreshold' defaultValue={DEFAULT_LACTATE_THRESHOLD} />
        </label>
        <button type='submit'>Calculate zones</button>
      </section>
    </form>
    <hr />
    <HeartZones resting={resting} maximum={maximum} lactateThreshold={lactateThreshold} />
    <hr />
    <LactateZones resting={resting} maximum={maximum} />
    <hr />
    <SessionRPENumber />
  </>;
}

export default Zones;

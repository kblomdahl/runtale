import type { JSX } from "preact";
import HeartZones from "./HeartZones";
import LactateZones from "./LactateZones";
import SessionRPENumber from './SessionRPENumber';
import useLocalStorage from '../../utils/UseLocalStorage';

export const DEFAULT_RESTING = 42;
export const DEFAULT_MAXIMUM = 183;
export const DEFAULT_LACTATE_THRESHOLD = 168;

function Zones() {
  const [resting, setResting] = useLocalStorage('Zones/resting', DEFAULT_RESTING);
  const [maximum, setMaximum] = useLocalStorage('Zones/maximum', DEFAULT_MAXIMUM);
  const [lactateThreshold, setLactateThreshold] = useLocalStorage('Zones/lactateThreshold', DEFAULT_LACTATE_THRESHOLD);

  const updateZoneValues = (e: JSX.TargetedEvent<HTMLFormElement>) => {
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
          <input type='number' name='resting' defaultValue={resting} />
        </label>
        <label>
          <span>Maximum</span>
          <input type='number' name='maximum' defaultValue={maximum} />
        </label>
        <label>
          <span>Lactate Threshold</span>
          <input type='number' name='lactateThreshold' defaultValue={lactateThreshold} />
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

import HeartZones from "./HeartZones";
import LactateZones from "./LactateZones";
import SessionRPENumber from './SessionRPENumber';
import useLocalStorage from '../../utils/UseLocalStorage';
import { getNumberFromForm } from '../../utils/Form';
import sharedStyles from '../../styles/shared.module.css';
import styles from './Zones.module.css';

const INPUT_RESTING = 'resting';
const INPUT_MAXIMUM = 'maximum';
const INPUT_LACTATE_THRESHOLD = 'lactateThreshold';

export const DEFAULT_RESTING = 42;
export const DEFAULT_MAXIMUM = 183;
export const DEFAULT_LACTATE_THRESHOLD = 168;

function Zones() {
  const [resting, setResting] = useLocalStorage('Zones/resting', DEFAULT_RESTING);
  const [maximum, setMaximum] = useLocalStorage('Zones/maximum', DEFAULT_MAXIMUM);
  const [lactateThreshold, setLactateThreshold] = useLocalStorage('Zones/lactateThreshold', DEFAULT_LACTATE_THRESHOLD);

  const updateZoneValues = (e: SubmitEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    setResting(getNumberFromForm(formData, INPUT_RESTING));
    setMaximum(getNumberFromForm(formData, INPUT_MAXIMUM));
    setLactateThreshold(getNumberFromForm(formData, INPUT_LACTATE_THRESHOLD));
  };

  return <>
    <form onSubmit={updateZoneValues} className={styles.form}>
      <section className={sharedStyles.form}>
        <label>
          <span>Resting</span>
          <input type='number' name={INPUT_RESTING} defaultValue={resting} />
        </label>
        <label>
          <span>Maximum</span>
          <input type='number' name={INPUT_MAXIMUM} defaultValue={maximum} />
        </label>
        <label>
          <span>Lactate Threshold</span>
          <input type='number' name={INPUT_LACTATE_THRESHOLD} defaultValue={lactateThreshold} />
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

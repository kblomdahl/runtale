import Header from '../components/Header';
import Paces from '../features/paces/Paces';
import Zones from '../features/zones/Zones';
import Sessions from '../features/sessions/Sessions';
import Strength from '../features/strength/Strength';
import NorwegianSingles from '../features/norwegian-singles/NorwegianSingles';
import { useEffect, useState } from 'preact/hooks';

function App() {
  const [route, setRoute] = useState(window.location.hash.slice(1) || '/');

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash.slice(1) || '/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <>
      <Header />
      {route === '/' && <Paces />}
      {route === '/zones' && <Zones />}
      {route === '/sessions' && <Sessions />}
      {route === '/norwegian-singles' && <NorwegianSingles />}
      {route === '/strength' && <Strength />}
    </>
  );
}

export default App;

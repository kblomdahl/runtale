import Header from '../components/Header';
import Paces from '../features/paces/Paces';
import Zones from '../features/zones/Zones';
import Sessions from '../features/sessions/Sessions';
import Strength from '../features/strength/Strength';
import NorwegianSingles from '../features/norwegian-singles/NorwegianSingles';
import Router, { Route } from 'preact-router';
import './App.css'

function App() {
  return (
    <div>
      <Header />
      <Router>
        <Route path="/" component={Paces} />
        <Route path="/zones" component={Zones} />
        <Route path="/sessions" component={Sessions} />
        <Route path="/norwegian-singles" component={NorwegianSingles} />
        <Route path="/strength" component={Strength} />
      </Router>
    </div>
  );
}

export default App;

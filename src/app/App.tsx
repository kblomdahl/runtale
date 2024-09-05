import Header from '../components/Header';
import Paces from '../features/paces/Paces';
import Zones from '../features/zones/Zones';
import Sessions from '../features/sessions/Sessions';
import Strength from '../features/strength/Strength';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'

function App() {
  return <BrowserRouter basename={import.meta.env.BASE_URL}>
    <Header />
    <Routes>
      <Route path="/" element={<Paces />} />
      <Route path="/zones" element={<Zones />} />
      <Route path="/sessions" element={<Sessions />} />
      <Route path="/strength" element={<Strength />} />
    </Routes>
  </BrowserRouter>;
}

export default App;

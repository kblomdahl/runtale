import Header from '../components/Header';
import Paces from '../features/paces/Paces';
import Zones from '../features/zones/Zones';
import Strength from '../features/strength/Strength';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Paces />
    },
    {
      path: '/zones',
      element: <Zones />
    },
    {
      path: '/strength',
      element: <Strength />
    },
  ]);

  return <>
    <Header />
    <RouterProvider router={router} />
  </>;
}

export default App;

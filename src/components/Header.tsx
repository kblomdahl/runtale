import { Link } from 'react-router-dom';
import logoUrl from '../assets/logo.svg';

function Header() {
  return <header>
    <img src={logoUrl} height="36" alt="logo" />
    <nav>
      <ul>
        <li><Link to="/">Paces</Link></li>
        <li><Link to="/zones">Zones</Link></li>
        <li><Link to="/sessions">Sessions</Link></li>
        <li><Link to="/strength">Strength</Link></li>
      </ul>
    </nav>
  </header>;
}

export default Header;

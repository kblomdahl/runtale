import logoUrl from '../assets/logo.svg';

function Header() {
  return <header>
    <img src={logoUrl} height="36" alt="logo" />
    <nav>
      <ul>
        <li><a href="/">Paces</a></li>
        <li><a href="/zones">Zones</a></li>
        <li><a href="/strength">Strength</a></li>
      </ul>
    </nav>
  </header>;
}

export default Header;

import logoUrl from '../assets/logo.svg';

function Header() {
  return <header>
    <img src={logoUrl} height="36" alt="logo" />
    <nav>
      <ul>
        <li><a href="/">Paces</a></li>
        <li><a href="/zones">Zones</a></li>
        <li><a href="/sessions">Sessions</a></li>
        <li><a href="/strength">Strength</a></li>
        <li><a href="/norwegian-singles">Norwegian Singles</a></li>
      </ul>
    </nav>
  </header>;
}

export default Header;

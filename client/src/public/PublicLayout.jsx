import { Link, Outlet } from 'react-router-dom';
import logo from '../assets/kephas-logo.svg';

export default function PublicLayout() {
  return (
    <div className="public-layout">
      <header className="site-header">
        <Link className="brand-block" to="/" aria-label="KEPHAS Young Builders home">
          <img src={logo} alt="KEPHAS Young Builders" className="brand-logo" />
        </Link>

        <nav className="top-nav" aria-label="Main navigation">
          <a href="/#programme">The programme</a>
          <a href="/#register">Registration</a>
        </nav>

      </header>
      <Outlet />
      <footer className="public-footer">
        <span>KEPHAS Young Builders</span>
        <span>Building digital confidence for the next generation.</span>
      </footer>
    </div>
  );
}
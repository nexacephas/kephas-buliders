import { useCallback, useEffect, useState } from 'react';
import { BadgeCheck, ClipboardList, LayoutDashboard, LogOut, RefreshCw, ShieldCheck } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import logo from '../assets/kephas-logo.svg';

const apiBase = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');
const tokenKey = 'kephas-admin-token';

function tokenExpiry(token) {
  try {
    const encodedPayload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(encodedPayload));
    return Number(payload.exp) || 0;
  } catch {
    return 0;
  }
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const logout = useCallback((message = '') => {
    localStorage.removeItem(tokenKey);
    setToken('');
    navigate('/admin/login', { replace: true, state: message ? { message } : null });
  }, [navigate]);

  const adminRequest = useCallback(async (path, options = {}) => {
    const activeToken = localStorage.getItem(tokenKey);
    const response = await fetch(`${apiBase}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {}),
        Authorization: `Bearer ${activeToken || ''}`
      }
    });

    if (response.status === 401 || response.status === 403) {
      logout(response.status === 401
        ? 'Your admin session has expired. Please sign in again.'
        : 'Administrator access is required. Please sign in again.');
    }

    return response;
  }, [logout]);

  const refreshRegistrations = useCallback(async () => {
    try {
      const response = await adminRequest('/admin/registrations');
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setLoadError(data.message || 'Unable to load registrations.');
        return false;
      }
      setLoadError('');
      setRegistrations(data.registrations || []);
      return true;
    } catch {
      setLoadError('Unable to connect to the registration service. Please try again.');
      return false;
    }
  }, [adminRequest]);

  useEffect(() => {
    let active = true;
    const storedToken = localStorage.getItem(tokenKey);
    const expiresAt = storedToken ? tokenExpiry(storedToken) : 0;

    if (!storedToken || !expiresAt || expiresAt <= Date.now() / 1000) {
      localStorage.removeItem(tokenKey);
      navigate('/admin/login', { replace: true });
      return undefined;
    }

    setToken(storedToken);
    const timeout = window.setTimeout(() => {
      if (active) logout('Your admin session has expired. Please sign in again.');
    }, Math.min((expiresAt * 1000) - Date.now(), 2147483647));

    refreshRegistrations().finally(() => {
      if (active) setAuthLoading(false);
    });

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [navigate, logout, refreshRegistrations]);

  if (authLoading) {
    return <main className="admin-loading"><span className="spinner admin-spinner" />Checking secure session...</main>;
  }

  if (!token || !localStorage.getItem(tokenKey)) return null;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <NavLink className="admin-brand" to="/admin/dashboard" aria-label="Admin dashboard">
          <img src={logo} alt="KEPHAS Young Builders" />
          <span>ADMIN PORTAL</span>
        </NavLink>

        <div className="sidebar-label">Workspace</div>
        <nav className="admin-side-nav" aria-label="Admin navigation">
          <NavLink to="/admin/dashboard" end>
            <LayoutDashboard size={18} /> Overview
          </NavLink>
          <a href="/admin/dashboard#registrations">
            <ClipboardList size={18} /> Registrations
          </a>
        </nav>

        <div className="sidebar-security">
          <ShieldCheck size={18} />
          <div><strong>Secure workspace</strong><span>Administrator access only</span></div>
        </div>

        <button className="sidebar-logout" onClick={() => logout()}>
          <LogOut size={17} /> Sign out
        </button>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-breadcrumb"><BadgeCheck size={17} /> KEPHAS <span>/</span> Administration</div>
          <button className="admin-refresh" onClick={refreshRegistrations} aria-label="Refresh registrations" title="Refresh registrations">
            <RefreshCw size={17} /> <span>Refresh data</span>
          </button>
        </header>
        <main className="admin-content">
          {loadError && <div className="form-status error">{loadError}</div>}
          <Outlet context={{ token, registrations, refreshRegistrations, adminRequest, logout }} />
        </main>
      </div>
    </div>
  );
}
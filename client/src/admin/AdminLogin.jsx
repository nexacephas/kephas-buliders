import { useState } from 'react';
import { ArrowLeft, ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/kephas-logo.svg';

const apiBase = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState(location.state?.message || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${apiBase}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.token) throw new Error(data.message || 'Unable to sign in.');

      localStorage.setItem('kephas-admin-token', data.token);
      navigate('/admin/dashboard', { replace: true });
    } catch (loginError) {
      setError(loginError.message || 'Unable to sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="admin-login-page">
      <Link to="/" className="login-back-link"><ArrowLeft size={16} /> Public website</Link>
      <section className="admin-login-layout">
        <div className="admin-login-brand-panel">
          <img src={logo} alt="KEPHAS Young Builders" />
          <div className="login-brand-copy">
            <p className="eyebrow">Programme administration</p>
            <h1>Good work starts with a clear view.</h1>
            <p>Manage applications and keep every young builder moving forward.</p>
          </div>
          <div className="login-shield"><ShieldCheck size={21} /> Protected administrator access</div>
        </div>

        <div className="admin-login-form-panel">
          <div className="login-form-heading">
            <span className="login-lock"><LockKeyhole size={20} /></span>
            <p className="eyebrow dark">Welcome back</p>
            <h2>Sign in to your portal</h2>
            <p>Use your administrator credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="field-wrap">
              <label htmlFor="admin-username">Username</label>
              <input id="admin-username" autoComplete="username" required value={credentials.username} onChange={(event) => setCredentials((current) => ({ ...current, username: event.target.value }))} />
            </div>
            <div className="field-wrap">
              <label htmlFor="admin-password">Password</label>
              <input id="admin-password" type="password" autoComplete="current-password" required value={credentials.password} onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))} />
            </div>
            {error && <div className="form-status error" role="alert">{error}</div>}
            <button type="submit" className="primary-button login-button" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Sign in'} <ArrowRight size={17} />
            </button>
          </form>
          <p className="login-footnote">Your session is protected and expires automatically.</p>
        </div>
      </section>
    </main>
  );
}
import { useMemo, useState } from 'react';
import { Download, Eye, Search, UsersRound, X } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const statusOptions = ['pending', 'reviewed', 'approved', 'rejected'];

export default function AdminDashboard() {
  const { registrations, refreshRegistrations, adminRequest, logout } = useOutletContext();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });
  const [busyId, setBusyId] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  const stats = useMemo(() => ({
    total: registrations.length,
    pending: registrations.filter((item) => item.status === 'pending').length,
    reviewed: registrations.filter((item) => item.status === 'reviewed').length,
    approved: registrations.filter((item) => item.status === 'approved').length
  }), [registrations]);

  const filteredRegistrations = registrations.filter((item) => {
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || [item.reference, item.parentFullName, item.childFullName]
      .some((value) => String(value || '').toLowerCase().includes(term));
    return matchesSearch && (statusFilter === 'all' || item.status === statusFilter);
  });

  const updateStatus = async (id, status) => {
    setBusyId(id);
    setActionMessage({ type: '', text: '' });
    try {
      const response = await adminRequest(`/admin/registrations/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Status update failed.');
      setActionMessage({ type: 'success', text: 'Registration status updated.' });
      await refreshRegistrations();
    } catch (error) {
      setActionMessage({ type: 'error', text: error.message || 'Status update failed.' });
    } finally {
      setBusyId('');
    }
  };

  const resendEmail = async (id) => {
    setBusyId(id);
    setActionMessage({ type: '', text: '' });
    try {
      const response = await adminRequest(`/admin/registrations/${id}/resend-email`, { method: 'PATCH' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Unable to resend email.');
      setActionMessage({ type: 'success', text: data.message || 'Email retry completed.' });
      await refreshRegistrations();
    } catch (error) {
      setActionMessage({ type: 'error', text: error.message || 'Unable to resend email.' });
    } finally {
      setBusyId('');
    }
  };

  const exportCsv = async () => {
    try {
      const response = await adminRequest('/admin/registrations/export');
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'CSV export failed.');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'kephas-registrations.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      setActionMessage({ type: 'error', text: error.message || 'CSV export failed.' });
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-heading">
        <div>
          <p className="eyebrow dark">Overview</p>
          <h1>Registration management</h1>
          <p>Review applications and keep programme records up to date.</p>
        </div>
        <div className="dashboard-count-chip"><UsersRound size={17} /> {registrations.length} applications</div>
      </div>

      <section className="dashboard-stats" aria-label="Registration statistics">
        <article className="stat-card total"><span>Total applications</span><strong>{stats.total}</strong><small>All submitted registrations</small></article>
        <article className="stat-card"><span>Pending review</span><strong>{stats.pending}</strong><small>Awaiting an update</small></article>
        <article className="stat-card"><span>Reviewed</span><strong>{stats.reviewed}</strong><small>Currently in progress</small></article>
        <article className="stat-card approved-stat"><span>Approved</span><strong>{stats.approved}</strong><small>Ready for next steps</small></article>
      </section>

      <section className="dashboard-panel" id="registrations">
        <div className="registrations-heading">
          <div><h2>Applications</h2><p>{filteredRegistrations.length} matching records</p></div>
          <button className="secondary-button export-button" onClick={exportCsv}><Download size={16} /> Export CSV</button>
        </div>

        <div className="dashboard-toolbar">
          <label className="search-field">
            <Search size={16} />
            <input aria-label="Search registrations" placeholder="Search name or reference" value={search} onChange={(event) => setSearch(event.target.value)} />
          </label>
          <label className="filter-field">
            <span>Status</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">All statuses</option>
              {statusOptions.map((status) => <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>)}
            </select>
          </label>
        </div>

        {actionMessage.text && <div className={`form-status ${actionMessage.type}`} role="status">{actionMessage.text}</div>}

        <div className="table-wrap admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Reference</th><th>Parent / guardian</th><th>Child</th><th>Submitted</th><th>Status</th><th>Manage</th></tr></thead>
            <tbody>
              {filteredRegistrations.map((item) => (
                <tr key={item._id}>
                  <td><strong className="registration-reference">{item.reference}</strong></td>
                  <td><strong>{item.parentFullName}</strong><span className="cell-secondary">{item.parentEmail}</span></td>
                  <td><strong>{item.childFullName}</strong><span className="cell-secondary">Age {item.childAge}</span></td>
                  <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}</td>
                  <td><span className={`status-badge ${item.status}`}>{item.status}</span></td>
                  <td>
                    <div className="status-actions">
                      <select aria-label={`Set status for ${item.reference}`} value={item.status} disabled={busyId === item._id} onChange={(event) => updateStatus(item._id, event.target.value)}>
                        {statusOptions.map((status) => <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>)}
                      </select>
                      <button type="button" className="small-button details-button" aria-label={`View details for ${item.reference}`} onClick={() => setSelectedRegistration(item)}>
                        <Eye size={14} /> Details
                      </button>
                      <button type="button" className="small-button" disabled={busyId === item._id} onClick={() => resendEmail(item._id)}>
                        {busyId === item._id ? 'Working...' : 'Resend email'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRegistrations.length === 0 && <tr><td className="empty-table" colSpan="6">No registrations match these filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {selectedRegistration && (
        <div className="registration-dialog-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSelectedRegistration(null);
        }}>
          <section className="registration-dialog" role="dialog" aria-modal="true" aria-labelledby="registration-dialog-title">
            <header className="registration-dialog-header">
              <div>
                <p className="eyebrow dark">Application record</p>
                <h2 id="registration-dialog-title">{selectedRegistration.childFullName}</h2>
                <span>{selectedRegistration.reference}</span>
              </div>
              <button type="button" className="dialog-close" aria-label="Close registration details" onClick={() => setSelectedRegistration(null)}>
                <X size={19} />
              </button>
            </header>

            <div className="registration-detail-grid">
              <div className="detail-group">
                <h3>Parent / guardian</h3>
                <Detail label="Full name" value={selectedRegistration.parentFullName} />
                <Detail label="Email" value={selectedRegistration.parentEmail} />
                <Detail label="Phone" value={selectedRegistration.parentPhone} />
                <Detail label="Relationship" value={selectedRegistration.relationship} />
              </div>
              <div className="detail-group">
                <h3>Child</h3>
                <Detail label="Date of birth" value={selectedRegistration.childDob} />
                <Detail label="Age" value={selectedRegistration.childAge} />
                <Detail label="Gender" value={selectedRegistration.childGender || 'Not provided'} />
                <Detail label="School level" value={selectedRegistration.schoolLevel || 'Not provided'} />
              </div>
              <div className="detail-group">
                <h3>Programme</h3>
                <Detail label="Technology access" value={selectedRegistration.technologyAccess} />
                <Detail label="Laptop available" value={selectedRegistration.hasDevice === 'yes' ? 'Yes' : 'No'} />
                <Detail label="Stable internet confirmed" value={selectedRegistration.stableInternetConfirmed ? 'Yes' : 'No'} />
                <Detail label="Learning interests" value={selectedRegistration.learningInterests?.join(', ') || 'Not specified'} />
                <Detail label="Class schedule" value={selectedRegistration.weekendAvailability?.join(', ') || 'Not specified'} />
                <Detail label="Expectations" value={selectedRegistration.expectations || 'Not provided'} />
              </div>
              <div className="detail-group">
                <h3>Consents and delivery</h3>
                <Detail label="Guardian consent" value={selectedRegistration.guardianConsent ? 'Confirmed' : 'Not confirmed'} />
                <Detail label="Media consent" value={selectedRegistration.mediaConsent ? 'Granted' : 'Not granted'} />
                <Detail label="Privacy consent" value={selectedRegistration.privacyConsent ? 'Confirmed' : 'Not confirmed'} />
                <Detail label="Admin email" value={selectedRegistration.emailDelivery?.admin?.status || 'Unknown'} />
                <Detail label="Parent email" value={selectedRegistration.emailDelivery?.parent?.status || 'Unknown'} />
                <Detail label="Registration status" value={selectedRegistration.status} />
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="registration-detail">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
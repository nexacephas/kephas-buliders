import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  GraduationCap,
  MonitorSmartphone,
  ShieldCheck,
  Sparkles,
  Users,
  Rocket,
  Zap,
  FileText
} from 'lucide-react';

const apiBase = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

const initialForm = {
  parentFullName: '',
  parentEmail: '',
  parentPhone: '',
  relationship: 'Parent',
  childFullName: '',
  childDob: '',
  childAge: '',
  childGender: '',
  schoolLevel: '',
  technologyAccess: 'at-home',
  hasDevice: 'yes',
  learningInterests: [],
  weekendAvailability: ['Saturday'],
  expectations: '',
  guardianConsent: false,
  mediaConsent: false,
  privacyConsent: false
};

const learningOptions = [
  'Web Development',
  'AI & Online Safety',
  'Coding Basics',
  'Creative Digital Skills',
  'Robotics',
  'Entrepreneurship',
  'Problem Solving'
];

const validationFieldLabels = {
  parentFullName: 'Parent / guardian full name',
  parentEmail: 'Parent email',
  parentPhone: 'Parent phone',
  relationship: 'Relationship to child',
  childFullName: 'Child full name',
  childDob: 'Date of birth',
  childGender: 'Gender',
  schoolLevel: 'School level',
  technologyAccess: 'Technology access',
  hasDevice: 'Personal device',
  learningInterests: 'Learning interests',
  weekendAvailability: 'Class schedule',
  expectations: 'Expectations',
  guardianConsent: 'Guardian consent',
  privacyConsent: 'Privacy consent'
};

const programmeCards = [
  {
    title: 'Web Development',
    description: 'Build and launch a real website.',
    icon: MonitorSmartphone,
    accent: 'teal'
  },
  {
    title: 'Artificial Intelligence',
    description: 'Learn to use AI to write code and build faster.',
    icon: BrainCircuit,
    accent: 'sand'
  },
  {
    title: 'AI Creativity',
    description: 'Create AI-generated images and videos.',
    icon: Sparkles,
    accent: 'ink'
  },
  {
    title: 'Online Safety',
    description: 'Understand data protection and responsible internet usage.',
    icon: ShieldCheck,
    accent: 'stone'
  }
];

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || 'Request failed.';
    const error = new Error(message);
    error.validationErrors = data?.errors || {};
    throw error;
  }

  return data;
}

function calculateAge(dob) {
  if (!dob) return '';
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
}

function fieldError(errors, name) {
  const error = errors[name];
  return typeof error === 'string' ? error : error?.msg;
}

export default function App() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const childAge = useMemo(() => calculateAge(form.childDob), [form.childDob]);

  useEffect(() => {
    setForm((prev) => ({ ...prev, childAge: childAge || '' }));
  }, [childAge]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setErrors((previous) => {
      const next = { ...previous };
      delete next[name];
      return next;
    });
    setStatus({ type: '', message: '' });

    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (name, value) => {
    setErrors((previous) => {
      const next = { ...previous };
      delete next[name];
      return next;
    });
    setStatus({ type: '', message: '' });
    setForm((prev) => {
      const current = prev[name] || [];
      const alreadySelected = current.includes(value);
      return {
        ...prev,
        [name]: alreadySelected
          ? current.filter((item) => item !== value)
          : [...current, value]
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const payload = {
        ...form,
        childAge: Number(calculateAge(form.childDob) || 0),
        learningInterests: form.learningInterests,
        weekendAvailability: form.weekendAvailability
      };

      const result = await requestJson(`${apiBase}/registrations`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      setForm(initialForm);
      setErrors({});
      sessionStorage.setItem('kephas-registration-reference', result.registration.reference);
      navigate(`/registration/success?reference=${encodeURIComponent(result.registration.reference)}`);
    } catch (error) {
      setErrors(error.validationErrors || {});
      setStatus({
        type: 'error',
        message: error.message || 'Something went wrong while submitting.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleExploreClick = () => {
    document.getElementById('programme')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleRegisterClick = () => {
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="app-shell public-home">
      <main className="page-content">
        <section className="hero-section" id="top">
          <div className="hero-copy">
            <p className="eyebrow">Online • Ages 10–19 • Saturdays, 9 AM–3 PM</p>
            <h1>
              BUILD THE FUTURE.
              <span>START YOUNG.</span>
            </h1>
            <p className="lead">
              Give your child the opportunity to explore technology, build real websites, create with AI and develop the digital skills needed for tomorrow.
            </p>

            <div className="hero-meta-grid">
              <div>
                <span className="meta-label">Programme</span>
                <strong>Online</strong>
              </div>
              <div>
                <span className="meta-label">Age</span>
                <strong>10–19</strong>
              </div>
              <div>
                <span className="meta-label">Fee</span>
                <strong>₦35,000</strong>
              </div>
              <div>
                <span className="meta-label">First session</span>
                <strong>Free</strong>
              </div>
            </div>

            <div className="hero-cta-row">
              <button className="primary-button" onClick={handleRegisterClick}>
                Register your child
                <ArrowRight size={18} />
              </button>
              <button className="secondary-button" onClick={handleExploreClick}>
                Explore the programme
              </button>
            </div>
          </div>

          <div className="hero-visual" aria-label="Young builders programme preview">
            <div className="visual-card main-card">
              <div className="visual-heading">
                <div className="visual-badge">Limited spots</div>
                <div className="floating-panel">FREE FIRST SESSION</div>
              </div>
              <div className="visual-stack">
                <div className="mini-stat">
                  <Rocket size={18} />
                  <span>Real building</span>
                </div>
                <div className="mini-stat">
                  <Zap size={18} />
                  <span>AI + digital learning</span>
                </div>
              </div>
              <div className="visual-grid">
                <div className="visual-box box-1">
                  <Users size={32} />
                </div>
                <div className="visual-box box-2">
                  <Sparkles size={32} />
                </div>
                <div className="visual-box box-3">
                  <GraduationCap size={32} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell" id="programme">
          <div className="section-heading">
            <p className="eyebrow dark">What young learners will gain</p>
            <h2>Designed for curiosity, creativity and confidence.</h2>
          </div>

          <div className="programme-grid">
            {programmeCards.map(({ title, description, icon: Icon, accent }) => (
              <article key={title} className={`programme-card ${accent}`}>
                <div className="card-icon">
                  <Icon size={22} />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell form-section" id="register">
          <div className="section-heading adjust-left">
            <p className="eyebrow dark">Registration</p>
            <h2>Register your child for KEPHAS Young Builders.</h2>
          </div>

          <div className="registration-layout">
            <form onSubmit={handleSubmit} className="registration-form">
              <div className="field-section">
                <div className="field-header">
                  <h3>Section A: Parent / Guardian Information</h3>
                  <p>Tell us who is completing the registration.</p>
                </div>

                <div className="form-grid two-col">
                  <div className="field-wrap">
                    <label>
                      Parent / Guardian Full Name <span>*</span>
                    </label>
                    <input name="parentFullName" value={form.parentFullName} onChange={handleChange} placeholder="e.g. Jane Okafor" />
                    {fieldError(errors, 'parentFullName') && <small>{fieldError(errors, 'parentFullName')}</small>}
                  </div>

                  <div className="field-wrap">
                    <label>Relationship to Child</label>
                    <select name="relationship" value={form.relationship} onChange={handleChange}>
                      <option>Parent</option>
                      <option>Guardian</option>
                      <option>Carer</option>
                    </select>
                    {fieldError(errors, 'relationship') && <small>{fieldError(errors, 'relationship')}</small>}
                  </div>
                </div>

                <div className="form-grid two-col">
                  <div className="field-wrap">
                    <label>Parent Email <span>*</span></label>
                    <input type="email" name="parentEmail" value={form.parentEmail} onChange={handleChange} placeholder="parent@email.com" />
                    {fieldError(errors, 'parentEmail') && <small>{fieldError(errors, 'parentEmail')}</small>}
                  </div>

                  <div className="field-wrap">
                    <label>Parent Phone <span>*</span></label>
                    <input name="parentPhone" value={form.parentPhone} onChange={handleChange} placeholder="080 0000 0000" />
                    {fieldError(errors, 'parentPhone') && <small>{fieldError(errors, 'parentPhone')}</small>}
                  </div>
                </div>
              </div>

              <div className="field-section">
                <div className="field-header">
                  <h3>Section B: Child’s Information</h3>
                  <p>Share your child’s details so we can assess the right fit.</p>
                </div>

                <div className="form-grid two-col">
                  <div className="field-wrap">
                    <label>Child Full Name <span>*</span></label>
                    <input name="childFullName" value={form.childFullName} onChange={handleChange} placeholder="e.g. Aisha Okafor" />
                    {fieldError(errors, 'childFullName') && <small>{fieldError(errors, 'childFullName')}</small>}
                  </div>

                  <div className="field-wrap">
                    <label>Date of Birth <span>*</span></label>
                    <input type="date" name="childDob" value={form.childDob} onChange={handleChange} />
                    {fieldError(errors, 'childDob') && <small>{fieldError(errors, 'childDob')}</small>}
                  </div>
                </div>

                <div className="form-grid three-col">
                  <div className="field-wrap">
                    <label>Age</label>
                    <input name="childAge" value={form.childAge} readOnly />
                  </div>

                  <div className="field-wrap">
                    <label>Gender</label>
                    <input name="childGender" value={form.childGender} onChange={handleChange} placeholder="e.g. Female" />
                    {fieldError(errors, 'childGender') && <small>{fieldError(errors, 'childGender')}</small>}
                  </div>

                  <div className="field-wrap">
                    <label>School Level</label>
                    <input name="schoolLevel" value={form.schoolLevel} onChange={handleChange} placeholder="e.g. Junior Secondary" />
                    {fieldError(errors, 'schoolLevel') && <small>{fieldError(errors, 'schoolLevel')}</small>}
                  </div>
                </div>
              </div>

              <div className="field-section">
                <div className="field-header">
                  <h3>Section C: Technology Access</h3>
                  <p>We want to understand how your child will participate online.</p>
                </div>

                <div className="form-grid two-col">
                  <div className="field-wrap">
                    <label>Technology Access</label>
                    <select name="technologyAccess" value={form.technologyAccess} onChange={handleChange}>
                      <option value="at-home">At home</option>
                      <option value="school">At school</option>
                      <option value="shared-device">Shared device</option>
                    </select>
                  </div>

                  <div className="field-wrap">
                    <label>Has Personal Device?</label>
                    <select name="hasDevice" value={form.hasDevice} onChange={handleChange}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                      <option value="sometimes">Sometimes</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="field-section">
                <div className="field-header">
                  <h3>Section D: Learning Interests</h3>
                  <p>Choose the areas your child is excited about.</p>
                </div>

                <div className="pill-grid">
                  {learningOptions.map((option) => (
                    <button
                      type="button"
                      key={option}
                      className={form.learningInterests.includes(option) ? 'pill active' : 'pill'}
                      onClick={() => handleMultiSelect('learningInterests', option)}
                      aria-pressed={form.learningInterests.includes(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {fieldError(errors, 'learningInterests') && <small className="selection-error">{fieldError(errors, 'learningInterests')}</small>}
              </div>

              <div className="field-section">
                <div className="field-header">
                  <h3>Section E: Class Schedule</h3>
                  <p>Classes are held on Saturdays from 9:00 AM to 3:00 PM.</p>
                </div>
                <div className="schedule-details">
                  <strong>Saturday</strong>
                  <span>9:00 AM–3:00 PM</span>
                </div>
                {fieldError(errors, 'weekendAvailability') && <small className="selection-error">{fieldError(errors, 'weekendAvailability')}</small>}
              </div>

              <div className="field-section">
                <div className="field-header">
                  <h3>Section F: Expectations and Consent</h3>
                  <p>Let us know what you hope your child gains and confirm consent.</p>
                </div>

                <div className="field-wrap">
                  <label>Expectations</label>
                  <textarea name="expectations" rows="4" value={form.expectations} onChange={handleChange} placeholder="Tell us what you hope your child will learn or enjoy during the programme." />
                </div>

                <div className="privacy-notice">
                  <div className="notice-icon"><FileText size={18} /></div>
                  <div>
                    <h4>Privacy notice</h4>
                    <p>
                      KEPHAS Young Builders uses this information only for registration, programme review,
                      and communication about participation. Parent and guardian contact details are kept
                      confidential and used only for this programme.
                    </p>
                  </div>
                </div>

                <div className="checkbox-stack">
                  <label className="check-row">
                    <input type="checkbox" name="guardianConsent" checked={form.guardianConsent} onChange={handleChange} />
                    <span>I confirm I am the legal guardian and consent to this registration.</span>
                  </label>
                  {fieldError(errors, 'guardianConsent') && <small className="consent-error">{fieldError(errors, 'guardianConsent')}</small>}
                  <label className="check-row">
                    <input type="checkbox" name="mediaConsent" checked={form.mediaConsent} onChange={handleChange} />
                    <span>Optional: I consent to media release for approved programme publicity.</span>
                  </label>
                  <label className="check-row">
                    <input type="checkbox" name="privacyConsent" checked={form.privacyConsent} onChange={handleChange} />
                    <span>I agree to the privacy notice and data handling terms.</span>
                  </label>
                  {fieldError(errors, 'privacyConsent') && <small className="consent-error">{fieldError(errors, 'privacyConsent')}</small>}
                </div>
              </div>

              {status.message && (
                <div className={`form-status ${status.type}`} role="alert">
                  <p>{status.message}</p>
                  {status.type === 'error' && Object.entries(errors).length > 0 && (
                    <ul>
                      {Object.entries(errors).map(([field, error]) => (
                        <li key={field}>
                          <strong>{validationFieldLabels[field] || field}:</strong> {fieldError(errors, field)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <button type="submit" className="primary-button form-submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit registration
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <aside className="info-panel">
              <div className="info-card">
                <div className="info-icon"><BadgeCheck size={20} /></div>
                <div>
                  <h3>Why families choose KEPHAS</h3>
                  <p>Technology education designed to build confidence, creativity and responsible digital habits.</p>
                </div>
              </div>

              <div className="info-card muted">
                <div className="info-icon"><Rocket size={20} /></div>
                <div>
                  <h3>What to expect</h3>
                  <p>Three months of guided digital learning across web development, AI and online safety.</p>
                </div>
              </div>
            </aside>
          </div>
        </section>

      </main>
    </div>
  );
}

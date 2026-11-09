import { CheckCircle2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export default function RegistrationSuccess() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference') || sessionStorage.getItem('kephas-registration-reference');

  return (
    <main className="success-panel">
      <section className="success-card">
        <div className="success-icon-wrap"><CheckCircle2 size={58} /></div>
        <p className="success-kicker">Registration received</p>
        <h1>Thank you for registering.</h1>
        <p className="success-copy">
          Your child’s registration has been received. We will review your submission and contact you with the next steps.
        </p>
        {reference && (
          <div className="reference-box">
            <span>Registration reference</span>
            <strong>{reference}</strong>
          </div>
        )}
        <div className="success-meta">
          <div><span>Programme</span><strong>KEPHAS Young Builders</strong></div>
          <div><span>Next steps</span><strong>Review and confirmation email</strong></div>
        </div>
        <Link className="primary-button" to="/">Return to the programme</Link>
      </section>
    </main>
  );
}
import { CheckCircle2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export default function RegistrationSuccess() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference') || sessionStorage.getItem('kephas-registration-reference');
  const whatsappMessage = reference
    ? `Hello, I have completed a KEPHAS Young Builders registration. My registration reference is ${reference}.`
    : '';
  const whatsappUrl = `https://wa.me/2348131495622?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <main className="success-panel">
      <section className="success-card">
        <div className="success-icon-wrap"><CheckCircle2 size={58} /></div>
        <p className="success-kicker">Registration received</p>
        <h1>Thank you for registering.</h1>
        <p className="success-copy">
          Your child’s registration has been received. Classes are held live on Zoom every Saturday from 9:00 AM to 3:00 PM. A WhatsApp group will be created for programme information; joining details will be shared after registration.
        </p>
        {reference && (
          <div className="reference-box">
            <span>Registration reference</span>
            <strong>{reference}</strong>
          </div>
        )}
        <section className="payment-instructions" aria-labelledby="payment-heading">
          <h2 id="payment-heading">Payment details</h2>
          <p>Programme fee: <strong>₦35,000</strong></p>
          <dl>
            <div><dt>Bank</dt><dd>Moniepoint</dd></div>
            <div><dt>Account number</dt><dd>8131495622</dd></div>
            <div><dt>Account name</dt><dd>Adekeye Cephas Precious</dd></div>
          </dl>
          <p className="payment-note">Use your registration reference as the payment narration so we can match your transfer.</p>
        </section>
        <div className="success-meta">
          <div><span>Class schedule</span><strong>Zoom · Saturday, 9:00 AM–3:00 PM</strong></div>
          <div><span>Next steps</span><strong>Review and confirmation email</strong></div>
        </div>
        {reference && (
          <a className="primary-button whatsapp-button" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            Send registration reference on WhatsApp
          </a>
        )}
        <p className="whatsapp-contact">
          Questions? <a href="https://wa.me/2348131495622?text=Hello%2C%20I%20have%20a%20question%20about%20KEPHAS%20Young%20Builders." target="_blank" rel="noopener noreferrer">Message us on WhatsApp: 08131495622</a>
        </p>
        <Link className="primary-button" to="/">Return to the programme</Link>
      </section>
    </main>
  );
}
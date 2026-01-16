import { useState, useMemo } from 'react';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name: string;
  email: string;
  message: string;
}

export default function ContactForm() {
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: FormErrors = { name: '', email: '', message: '' };

    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (form.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!isValidEmail(form.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!form.message.trim()) {
      newErrors.message = 'Message is required';
      isValid = false;
    } else if (form.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = useMemo(() => {
    return form.name && form.email && form.message;
  }, [form]);

  return (
    <section id="contact" className="contact-section">
      <h2>Get in Touch</h2>
      <div className="form-container">
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                type="text"
                placeholder="Your name"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                placeholder="your@email.com"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="How can we help?"
                rows={4}
                className={errors.message ? 'error' : ''}
              />
              {errors.message && <span className="error-message">{errors.message}</span>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="submit-btn"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        ) : (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h3>Thank you!</h3>
            <p>Your message has been sent successfully. We&apos;ll get back to you soon.</p>
            <button onClick={() => setIsSubmitted(false)} className="reset-btn">
              Send Another Message
            </button>
          </div>
        )}
      </div>
      <style>{`
        .contact-section {
          padding: 4rem 2rem;
          background: #f5f5f5;
        }
        .contact-section h2 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 2rem;
          color: #1a1a2e;
        }
        .form-container {
          max-width: 500px;
          margin: 0 auto;
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #1a1a2e;
        }
        input, textarea {
          width: 100%;
          padding: 0.875rem;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s;
          font-family: inherit;
        }
        input:focus, textarea:focus {
          outline: none;
          border-color: #667eea;
        }
        input.error, textarea.error {
          border-color: #e74c3c;
        }
        .error-message {
          display: block;
          color: #e74c3c;
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }
        .submit-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .success-message {
          text-align: center;
          padding: 2rem;
        }
        .success-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin: 0 auto 1rem;
        }
        .success-message h3 {
          font-size: 1.5rem;
          color: #1a1a2e;
          margin-bottom: 0.5rem;
        }
        .success-message p {
          color: #666;
          margin-bottom: 1.5rem;
        }
        .reset-btn {
          background: none;
          border: 2px solid #667eea;
          color: #667eea;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s;
        }
        .reset-btn:hover {
          background: #667eea;
          color: white;
        }
      `}</style>
    </section>
  );
}

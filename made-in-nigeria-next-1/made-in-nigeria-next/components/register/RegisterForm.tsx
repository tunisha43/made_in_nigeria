'use client';

import { FormEvent, useState } from 'react';

const BUSINESS_TYPES = ['Tailoring', 'Farming', 'Cooking', 'Construction', 'Trading', 'Manufacturing', 'Services'];
const STATES = ['Abia', 'Bayelsa', 'Lagos', 'Rivers', 'Akwa Ibom', 'Enugu', 'Other'];

export default function RegisterForm() {
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0]);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Placeholder for a real submit, e.g.:
    //   const { error } = await supabase.from('businesses').insert({ ... })
    setSubmitted(true);
  }

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="bizname">Business name</label>
          <input id="bizname" type="text" placeholder="e.g. Adaeze Textiles" required />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="city">
              Location <span className="hint">(city / village)</span>
            </label>
            <input id="city" type="text" placeholder="e.g. Aba" required />
          </div>
          <div className="field">
            <label htmlFor="state">State</label>
            <select id="state" required defaultValue="">
              <option value="" disabled>Select state</option>
              {STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label>Type of business</label>
          <div className="pill-select">
            {BUSINESS_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                className={`pill-opt${businessType === type ? ' is-active' : ''}`}
                onClick={() => setBusinessType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label htmlFor="desc">
            Short description <span className="hint">(what do you do?)</span>
          </label>
          <textarea
            id="desc"
            rows={3}
            placeholder="Tell us in a sentence or two — this becomes the first thing customers read."
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', marginTop: 6 }}
        >
          Create My Business Profile Draft
        </button>

        {submitted && (
          <div
            style={{
              marginTop: 18,
              textAlign: 'center',
              fontSize: 13.5,
              color: 'var(--forest-800)',
              background: 'var(--forest-050)',
              padding: 14,
              borderRadius: 12,
            }}
          >
            Draft created. Your business is now Registered — the next step is adding photos to move toward Verified.
          </div>
        )}
      </form>
    </div>
  );
}

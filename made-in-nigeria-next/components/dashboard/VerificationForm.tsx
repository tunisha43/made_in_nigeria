'use client';

import { FormEvent, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type Business = Database['public']['Tables']['businesses']['Row'];
type Submission = Database['public']['Tables']['business_verification_submissions']['Row'];
type Document = Database['public']['Tables']['business_verification_documents']['Row'];

const DOCS = [
  { key: 'registration', label: 'Business registration document', hint: 'CAC certificate, registration certificate, or equivalent.', required: true },
  { key: 'identity', label: 'Owner identity document', hint: 'Government-issued ID for the business owner.', required: true },
  { key: 'address', label: 'Proof of business address', hint: 'Utility bill, tenancy document, or another recent proof of address.', required: true },
] as const;

function statusLabel(status?: string | null) {
  if (status === 'pending') return 'Under review';
  if (status === 'approved') return 'Verified';
  if (status === 'rejected') return 'Changes requested';
  return 'Not submitted';
}

export default function VerificationForm({ business, submission, documents }: { business: Business; submission: Submission | null; documents: Document[] }) {
  const supabase = createClient();
  const [businessName, setBusinessName] = useState(business.name);
  const [category, setCategory] = useState(business.category);
  const [city, setCity] = useState(business.city ?? '');
  const [state, setState] = useState(business.state ?? '');
  const [notes, setNotes] = useState(submission?.notes ?? '');
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setMessage(null);

    const missing = DOCS.filter((doc) => doc.required && !files[doc.key] && !documents.some((d) => d.document_type === doc.key));
    if (missing.length) {
      setMessage({ type: 'error', text: `Please provide: ${missing.map((m) => m.label).join(', ')}.` });
      setLoading(false); return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: businessError } = await (supabase.from('businesses') as any).update({
      name: businessName.trim(), category: category.trim(), city: city.trim() || null, state: state.trim() || null,
    }).eq('id', business.id);
    if (businessError) { setMessage({ type: 'error', text: businessError.message }); setLoading(false); return; }

    for (const doc of DOCS) {
      const file = files[doc.key];
      if (!file) continue;
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-');
      if (file.size > 10 * 1024 * 1024) { setMessage({ type: 'error', text: `${doc.label} is larger than 10 MB.` }); setLoading(false); return; }
      const path = `${business.id}/${doc.key}-${Date.now()}-${safeName}`;
      const { error: uploadError } = await supabase.storage.from('verification-documents').upload(path, file, { upsert: false, contentType: file.type || undefined });
      if (uploadError) { setMessage({ type: 'error', text: `Could not upload ${doc.label}: ${uploadError.message}` }); setLoading(false); return; }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: docError } = await (supabase.from('business_verification_documents') as any).insert({ business_id: business.id, document_type: doc.key, file_name: file.name, storage_path: path, mime_type: file.type || null, size_bytes: file.size });
      if (docError) { setMessage({ type: 'error', text: `Could not save ${doc.label}: ${docError.message}` }); setLoading(false); return; }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: submissionError } = await (supabase.from('business_verification_submissions') as any).upsert({ business_id: business.id, status: 'pending', notes: notes.trim() || null, submitted_at: new Date().toISOString() }, { onConflict: 'business_id' });
    if (submissionError) { setMessage({ type: 'error', text: submissionError.message }); setLoading(false); return; }

    setMessage({ type: 'success', text: 'Your verification submission has been sent for review.' });
    setLoading(false);
  }

  return (
    <>
      <div className="widget span-4">
        <div className="widget-head"><h3>Verification status</h3><span className="badge badge-verified">{statusLabel(submission?.status)}</span></div>
        <p style={{ color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          Current badge: <strong>{business.verification_level === 'registered' ? 'Registered' : business.verification_level === 'verified' ? 'Verified' : 'Advanced Verified'}</strong>. Submit complete documents to move your business into review.
        </p>
        {submission?.review_notes && <div className="form-note" style={{ marginTop: 14 }}><span>!</span><span>{submission.review_notes}</span></div>}
      </div>

      <form className="widget span-4" onSubmit={submit}>
        <div className="widget-head"><h3>Business details</h3><span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Required</span></div>
        <div className="field-row">
          <div className="field"><label htmlFor="verify-name">Business name</label><input id="verify-name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required /></div>
          <div className="field"><label htmlFor="verify-category">Business category</label><input id="verify-category" value={category} onChange={(e) => setCategory(e.target.value)} required /></div>
        </div>
        <div className="field-row">
          <div className="field"><label htmlFor="verify-city">City / village</label><input id="verify-city" value={city} onChange={(e) => setCity(e.target.value)} /></div>
          <div className="field"><label htmlFor="verify-state">State</label><input id="verify-state" value={state} onChange={(e) => setState(e.target.value)} /></div>
        </div>

        <div className="widget-head" style={{ marginTop: 18 }}><h3>Verification documents</h3></div>
        <p style={{ color: 'var(--ink-soft)', fontSize: 13, marginBottom: 14 }}>PDF, JPG or PNG. Keep each file under 10 MB.</p>
        {DOCS.map((doc) => {
          const existing = documents.find((d) => d.document_type === doc.key);
          return <div className="field" key={doc.key}>
            <label htmlFor={`doc-${doc.key}`}>{doc.label} {doc.required && <span className="hint">(required)</span>}</label>
            <input id={`doc-${doc.key}`} type="file" accept="application/pdf,image/jpeg,image/png" onChange={(e) => setFiles((prev) => ({ ...prev, [doc.key]: e.target.files?.[0] ?? null }))} />
            <span className="hint">{files[doc.key]?.name || (existing ? `Uploaded: ${existing.file_name}` : doc.hint)}</span>
          </div>;
        })}

        <div className="field"><label htmlFor="verify-notes">Anything we should know?</label><textarea id="verify-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional context for the verification team." /></div>
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Submitting…' : 'Submit for verification'}</button>
        {message && <div style={{ marginTop: 16, color: message.type === 'error' ? '#9A3B2E' : 'var(--forest-800)', background: message.type === 'error' ? '#FBEAE7' : 'var(--forest-050)', padding: 12, borderRadius: 10, fontSize: 13.5 }}>{message.text}</div>}
      </form>
    </>
  );
}

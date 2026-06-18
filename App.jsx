import React, { useState, useMemo } from 'react';
import { Hammer, FileText, Receipt, PiggyBank, Plus, Trash2, ChevronRight, LogOut, Clock, CheckCircle2, Send, X, ArrowLeft } from 'lucide-react';

// ---------- Brand tokens ----------
const C = {
  black: '#0a0a0a',
  panel: '#141414',
  panel2: '#1c1c1c',
  border: '#2a2a2a',
  text: '#f5f5f5',
  textDim: '#8a8a8a',
  textFaint: '#5c5c5c',
  blue1: '#7EC8E3',
  blue2: '#4A9ECC',
  blue3: '#2A6F95',
  danger: '#c0392b',
};

const metalGrad = `linear-gradient(135deg, ${C.blue1} 0%, ${C.blue2} 45%, ${C.blue3} 100%)`;

function Logo({ size = 22 }) {
  return (
    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: size, letterSpacing: '-0.02em' }}>
      <span style={{ color: C.text }}>Trade</span>
      <span style={{
        background: metalGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      }}>AI</span>
    </span>
  );
}

function GradText({ children, style }) {
  return <span style={{ background: metalGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', ...style }}>{children}</span>;
}

// ---------- Mock "backend" helpers (in-memory only) ----------
const TAX_RATE = 0.20; // basic rate approximation for prototype
const NI_RATE = 0.09;  // class 4 NI approximation

function calcTax(profit) {
  const taxable = Math.max(0, profit - 12570); // personal allowance approx
  const incomeTax = taxable * TAX_RATE;
  const ni = Math.max(0, profit - 12570) * NI_RATE;
  return { incomeTax: Math.round(incomeTax), ni: Math.round(ni), total: Math.round(incomeTax + ni) };
}

const uid = () => Math.random().toString(36).slice(2, 9);

// ---------- Auth Screen ----------
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('login'); // login | register
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [trade, setTrade] = useState('Plumber');
  const [error, setError] = useState('');

  function submit(e) {
    e.preventDefault();
    if (!email || !password || (mode === 'register' && !name)) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    onAuth({ name: name || email.split('@')[0], email, trade });
  }

  return (
    <div style={{ minHeight: '100vh', background: C.black, color: C.text, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Inter', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -180, right: -180, width: 480, height: 480, background: 'radial-gradient(circle, rgba(74,158,204,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ marginBottom: 36 }}><Logo size={32} /></div>

      <div style={{ width: '100%', maxWidth: 380, background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 32, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: 4, background: C.panel2, borderRadius: 8, padding: 4, marginBottom: 24 }}>
          <button onClick={() => setMode('login')} style={{
            flex: 1, padding: '10px 0', borderRadius: 6, border: 'none', cursor: 'pointer',
            background: mode === 'login' ? metalGrad : 'transparent',
            color: mode === 'login' ? C.black : C.textDim, fontWeight: 600, fontSize: 14,
          }}>Log in</button>
          <button onClick={() => setMode('register')} style={{
            flex: 1, padding: '10px 0', borderRadius: 6, border: 'none', cursor: 'pointer',
            background: mode === 'register' ? metalGrad : 'transparent',
            color: mode === 'register' ? C.black : C.textDim, fontWeight: 600, fontSize: 14,
          }}>Register</button>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'register' && (
            <Field label="Your name">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Dave Mitchell" style={inputStyle} />
            </Field>
          )}
          <Field label="Email">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="dave@example.com" style={inputStyle} />
          </Field>
          <Field label="Password">
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} />
          </Field>
          {mode === 'register' && (
            <Field label="Trade">
              <select value={trade} onChange={e => setTrade(e.target.value)} style={{ ...inputStyle, appearance: 'none' }}>
                {['Plumber', 'Electrician', 'Builder', 'Carpenter', 'Decorator', 'Tiler', 'Other'].map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
          )}
          {error && <p style={{ color: C.danger, fontSize: 13, margin: 0 }}>{error}</p>}
          <button type="submit" style={{
            marginTop: 8, background: metalGrad, color: C.black, border: 'none', borderRadius: 8,
            padding: '13px 0', fontWeight: 700, fontSize: 15, cursor: 'pointer',
          }}>{mode === 'login' ? 'Log in' : 'Create account'}</button>
        </form>
        <p style={{ color: C.textFaint, fontSize: 12, textAlign: 'center', marginTop: 18, lineHeight: 1.6 }}>
          This is a working prototype. Data is stored only for this session and isn't saved permanently yet.
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 12.5, color: C.textDim, fontWeight: 500 }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle = {
  background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 7, padding: '11px 13px',
  color: C.text, fontSize: 14.5, outline: 'none', fontFamily: "'Inter', sans-serif",
};

// ---------- Shell / Nav ----------
function Shell({ user, screen, setScreen, onLogout, children }) {
  const nav = [
    { id: 'dashboard', label: 'Dashboard', icon: Hammer },
    { id: 'quotes', label: 'Quotes', icon: FileText },
    { id: 'invoices', label: 'Invoices', icon: Receipt },
    { id: 'tax', label: 'Tax', icon: PiggyBank },
  ];
  return (
    <div style={{ minHeight: '100vh', background: C.black, color: C.text, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
        <Logo size={20} />
        <button onClick={onLogout} style={{ background: 'none', border: 'none', color: C.textDim, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
          <LogOut size={15} /> Log out
        </button>
      </div>

      <div style={{ padding: '20px 20px 100px', maxWidth: 720, margin: '0 auto' }}>
        {children}
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: C.panel, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-around', padding: '10px 0 14px' }}>
        {nav.map(n => {
          const Icon = n.icon;
          const active = screen === n.id;
          return (
            <button key={n.id} onClick={() => setScreen(n.id)} style={{
              background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              color: active ? C.blue1 : C.textFaint, cursor: 'pointer', fontSize: 11, fontWeight: 600, padding: '4px 14px',
            }}>
              <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
              {n.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Dashboard ----------
function Dashboard({ user, quotes, invoices, taxOwed, setScreen }) {
  const pendingQuotes = quotes.filter(q => q.status === 'sent').length;
  const unpaidTotal = invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.total, 0);

  return (
    <div>
      <p style={{ color: C.textDim, fontSize: 13, marginBottom: 2 }}>Welcome back,</p>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, margin: '0 0 24px' }}>{user.name.split(' ')[0]} 👋</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <StatCard label="Pending quotes" value={pendingQuotes} onClick={() => setScreen('quotes')} />
        <StatCard label="Unpaid invoices" value={`£${unpaidTotal.toLocaleString()}`} onClick={() => setScreen('invoices')} />
      </div>

      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: metalGrad }} />
        <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.textDim, marginBottom: 8, fontWeight: 600 }}>Estimated tax owed</p>
        <GradText style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 34, fontWeight: 700 }}>£{taxOwed.total.toLocaleString()}</GradText>
        <p style={{ color: C.textFaint, fontSize: 12.5, marginTop: 6 }}>Updated live as you log income · <span onClick={() => setScreen('tax')} style={{ color: C.blue1, cursor: 'pointer' }}>View breakdown →</span></p>
      </div>

      <button onClick={() => setScreen('quotes')} style={{
        width: '100%', background: metalGrad, color: C.black, border: 'none', borderRadius: 10,
        padding: '15px 0', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <Plus size={18} /> Create a new quote
      </button>
    </div>
  );
}

function StatCard({ label, value, onClick }) {
  return (
    <div onClick={onClick} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}>
      <p style={{ color: C.textDim, fontSize: 12, marginBottom: 6 }}>{label}</p>
      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, margin: 0 }}>{value}</p>
    </div>
  );
}

// ---------- Quotes ----------
function QuotesList({ quotes, setScreen, setActiveQuoteId, startNewQuote }) {
  return (
    <div>
      <PageHeader title="Quotes" action={{ label: 'New quote', onClick: startNewQuote }} />
      {quotes.length === 0 && <EmptyState text="No quotes yet. Create your first one to send a job estimate in minutes." />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {quotes.slice().reverse().map(q => (
          <div key={q.id} onClick={() => { setActiveQuoteId(q.id); setScreen('quote-detail'); }} style={rowCardStyle}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14.5, margin: 0 }}>{q.customer || 'Untitled job'}</p>
              <p style={{ color: C.textFaint, fontSize: 12.5, margin: '3px 0 0' }}>{q.jobDesc.slice(0, 40) || 'No description'}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>£{q.total.toFixed(0)}</p>
              <StatusPill status={q.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    draft: { c: C.textFaint, bg: '#1a1a1a', label: 'Draft' },
    sent: { c: C.blue1, bg: '#0a1520', label: 'Sent' },
    accepted: { c: '#5fc97f', bg: '#0a1f0f', label: 'Accepted' },
    paid: { c: '#5fc97f', bg: '#0a1f0f', label: 'Paid' },
    unpaid: { c: '#e0a93a', bg: '#1f1608', label: 'Unpaid' },
    overdue: { c: C.danger, bg: '#1a0a0a', label: 'Overdue' },
  };
  const s = map[status] || map.draft;
  return <span style={{ fontSize: 11, fontWeight: 700, color: s.c, background: s.bg, padding: '3px 9px', borderRadius: 20, display: 'inline-block', marginTop: 4 }}>{s.label}</span>;
}

function EmptyState({ text }) {
  return (
    <div style={{ border: `1px dashed ${C.border}`, borderRadius: 12, padding: '32px 20px', textAlign: 'center', color: C.textFaint, fontSize: 13.5, marginBottom: 16 }}>
      {text}
    </div>
  );
}

const rowCardStyle = {
  background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px',
  display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
};

function PageHeader({ title, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, margin: 0 }}>{title}</h1>
      {action && (
        <button onClick={action.onClick} style={{
          background: metalGrad, color: C.black, border: 'none', borderRadius: 7, padding: '8px 14px',
          fontWeight: 700, fontSize: 12.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
        }}><Plus size={14} /> {action.label}</button>
      )}
    </div>
  );
}

// ---------- New Quote Builder ----------
function QuoteBuilder({ onSave, onCancel }) {
  const [customer, setCustomer] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [materials, setMaterials] = useState([{ id: uid(), name: '', cost: '' }]);
  const [labourHours, setLabourHours] = useState('');
  const [labourRate, setLabourRate] = useState('35');

  const materialTotal = materials.reduce((s, m) => s + (parseFloat(m.cost) || 0), 0);
  const labourTotal = (parseFloat(labourHours) || 0) * (parseFloat(labourRate) || 0);
  const total = materialTotal + labourTotal;

  function updateMaterial(id, field, val) {
    setMaterials(materials.map(m => m.id === id ? { ...m, [field]: val } : m));
  }
  function addMaterial() { setMaterials([...materials, { id: uid(), name: '', cost: '' }]); }
  function removeMaterial(id) { setMaterials(materials.filter(m => m.id !== id)); }

  function save(status) {
    onSave({
      id: uid(), customer, jobDesc, materials, labourHours: parseFloat(labourHours) || 0,
      labourRate: parseFloat(labourRate) || 0, materialTotal, labourTotal, total, status,
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <div>
      <BackHeader title="New quote" onBack={onCancel} />

      <Field label="Customer name">
        <input value={customer} onChange={e => setCustomer(e.target.value)} placeholder="e.g. Sarah Jones" style={inputStyle} />
      </Field>
      <div style={{ height: 14 }} />
      <Field label="Job description">
        <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} placeholder="Describe the job — e.g. Re-tile bathroom, 8sqm, supply and fit" style={{ ...inputStyle, minHeight: 70, resize: 'vertical', fontFamily: "'Inter', sans-serif" }} />
      </Field>

      <p style={{ fontSize: 12.5, color: C.textDim, fontWeight: 600, margin: '22px 0 10px' }}>MATERIALS</p>
      {materials.map(m => (
        <div key={m.id} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input value={m.name} onChange={e => updateMaterial(m.id, 'name', e.target.value)} placeholder="Material" style={{ ...inputStyle, flex: 2 }} />
          <input value={m.cost} onChange={e => updateMaterial(m.id, 'cost', e.target.value)} placeholder="£0" type="number" style={{ ...inputStyle, flex: 1 }} />
          <button onClick={() => removeMaterial(m.id)} style={{ background: 'none', border: 'none', color: C.textFaint, cursor: 'pointer' }}><Trash2 size={17} /></button>
        </div>
      ))}
      <button onClick={addMaterial} style={{ background: 'none', border: `1px dashed ${C.border}`, color: C.blue1, borderRadius: 7, padding: '8px 14px', fontSize: 12.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Plus size={14} /> Add material
      </button>

      <p style={{ fontSize: 12.5, color: C.textDim, fontWeight: 600, margin: '22px 0 10px' }}>LABOUR</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <Field label="Hours">
          <input value={labourHours} onChange={e => setLabourHours(e.target.value)} type="number" placeholder="0" style={inputStyle} />
        </Field>
        <Field label="Rate per hour (£)">
          <input value={labourRate} onChange={e => setLabourRate(e.target.value)} type="number" style={inputStyle} />
        </Field>
      </div>

      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginTop: 24 }}>
        <Row label="Materials" value={`£${materialTotal.toFixed(2)}`} />
        <Row label="Labour" value={`£${labourTotal.toFixed(2)}`} />
        <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 10, paddingTop: 10 }}>
          <Row label="Total" value={`£${total.toFixed(2)}`} bold />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button onClick={() => save('draft')} style={{ flex: 1, background: C.panel2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 9, padding: '13px 0', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Save draft</button>
        <button onClick={() => save('sent')} style={{ flex: 1, background: metalGrad, border: 'none', color: C.black, borderRadius: 9, padding: '13px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
          <Send size={15} /> Send to customer
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
      <span style={{ color: bold ? C.text : C.textDim, fontSize: bold ? 15 : 13.5, fontWeight: bold ? 700 : 400 }}>{label}</span>
      <span style={{ color: bold ? C.text : C.textDim, fontSize: bold ? 16 : 13.5, fontWeight: bold ? 700 : 600 }}>{value}</span>
    </div>
  );
}

function BackHeader({ title, onBack }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.textDim, cursor: 'pointer', display: 'flex' }}><ArrowLeft size={20} /></button>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, margin: 0 }}>{title}</h1>
    </div>
  );
}

// ---------- Quote Detail ----------
function QuoteDetail({ quote, onBack, onConvertToInvoice, onUpdateStatus }) {
  if (!quote) return null;
  return (
    <div>
      <BackHeader title={quote.customer || 'Untitled job'} onBack={onBack} />
      <StatusPill status={quote.status} />
      <p style={{ color: C.textDim, fontSize: 14, margin: '14px 0 20px', lineHeight: 1.6 }}>{quote.jobDesc}</p>

      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 20 }}>
        <p style={{ fontSize: 11.5, color: C.textDim, fontWeight: 600, marginBottom: 10 }}>MATERIALS</p>
        {quote.materials.filter(m => m.name).map(m => <Row key={m.id} label={m.name} value={`£${parseFloat(m.cost || 0).toFixed(2)}`} />)}
        <Row label={`Labour (${quote.labourHours}h @ £${quote.labourRate}/h)`} value={`£${quote.labourTotal.toFixed(2)}`} />
        <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 10, paddingTop: 10 }}>
          <Row label="Total" value={`£${quote.total.toFixed(2)}`} bold />
        </div>
      </div>

      {quote.status === 'sent' && (
        <button onClick={() => onUpdateStatus('accepted')} style={{ width: '100%', background: metalGrad, border: 'none', color: C.black, borderRadius: 9, padding: '13px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer', marginBottom: 10 }}>
          Mark as accepted by customer
        </button>
      )}
      {quote.status === 'accepted' && (
        <button onClick={onConvertToInvoice} style={{ width: '100%', background: metalGrad, border: 'none', color: C.black, borderRadius: 9, padding: '13px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          Convert to invoice
        </button>
      )}
    </div>
  );
}

// ---------- Invoices ----------
function InvoicesList({ invoices, setActiveInvoiceId, setScreen }) {
  return (
    <div>
      <PageHeader title="Invoices" />
      {invoices.length === 0 && <EmptyState text="No invoices yet. Accepted quotes can be converted into invoices." />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {invoices.slice().reverse().map(inv => (
          <div key={inv.id} onClick={() => { setActiveInvoiceId(inv.id); setScreen('invoice-detail'); }} style={rowCardStyle}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14.5, margin: 0 }}>{inv.customer}</p>
              <p style={{ color: C.textFaint, fontSize: 12.5, margin: '3px 0 0' }}>Invoice #{inv.id.slice(0, 5).toUpperCase()}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>£{inv.total.toFixed(0)}</p>
              <StatusPill status={inv.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InvoiceDetail({ invoice, onBack, onMarkPaid }) {
  if (!invoice) return null;
  return (
    <div>
      <BackHeader title={`Invoice — ${invoice.customer}`} onBack={onBack} />
      <StatusPill status={invoice.status} />
      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, margin: '18px 0' }}>
        <Row label="Amount due" value={`£${invoice.total.toFixed(2)}`} bold />
      </div>
      {invoice.status !== 'paid' && (
        <button onClick={onMarkPaid} style={{ width: '100%', background: metalGrad, border: 'none', color: C.black, borderRadius: 9, padding: '13px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
          <CheckCircle2 size={16} /> Mark as paid
        </button>
      )}
    </div>
  );
}

// ---------- Tax Dashboard ----------
function TaxDashboard({ invoices }) {
  const paidIncome = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
  const tax = calcTax(paidIncome);

  return (
    <div>
      <PageHeader title="Tax dashboard" />
      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 18, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: metalGrad }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.textDim, fontWeight: 600 }}>Estimated Self Assessment</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.blue1, fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.blue1 }} /> Live
          </span>
        </div>
        <GradText style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 40, fontWeight: 700 }}>£{tax.total.toLocaleString()}</GradText>
        <p style={{ color: C.textFaint, fontSize: 12.5, margin: '4px 0 22px' }}>based on paid income so far this tax year</p>

        <Row label="Income received (paid invoices)" value={`£${paidIncome.toLocaleString()}`} />
        <Row label="Personal allowance" value="£12,570" />
        <Row label="Income tax (20%)" value={`£${tax.incomeTax.toLocaleString()}`} />
        <Row label="Class 4 National Insurance" value={`£${tax.ni.toLocaleString()}`} />
      </div>
      <p style={{ color: C.textFaint, fontSize: 12, lineHeight: 1.6 }}>
        This is an estimate for guidance only, based on a simplified calculation. Always confirm your final liability with a qualified accountant or HMRC.
      </p>
    </div>
  );
}

// ---------- Root App ----------
export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('dashboard');
  const [quotes, setQuotes] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [activeQuoteId, setActiveQuoteId] = useState(null);
  const [activeInvoiceId, setActiveInvoiceId] = useState(null);
  const [showBuilder, setShowBuilder] = useState(false);

  const activeQuote = quotes.find(q => q.id === activeQuoteId);
  const activeInvoice = invoices.find(i => i.id === activeInvoiceId);
  const taxOwed = useMemo(() => calcTax(invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0)), [invoices]);

  function handleAuth(u) { setUser(u); }
  function handleLogout() { setUser(null); setScreen('dashboard'); setQuotes([]); setInvoices([]); }

  function saveQuote(q) {
    setQuotes([...quotes, q]);
    setShowBuilder(false);
    setScreen('quotes');
  }

  function updateQuoteStatus(id, status) {
    setQuotes(quotes.map(q => q.id === id ? { ...q, status } : q));
  }

  function convertToInvoice(quote) {
    const inv = { id: uid(), customer: quote.customer, total: quote.total, status: 'unpaid', quoteId: quote.id };
    setInvoices([...invoices, inv]);
    updateQuoteStatus(quote.id, 'paid');
    setActiveInvoiceId(inv.id);
    setScreen('invoice-detail');
  }

  function markInvoicePaid(id) {
    setInvoices(invoices.map(i => i.id === id ? { ...i, status: 'paid' } : i));
  }

  if (!user) return <AuthScreen onAuth={handleAuth} />;

  let body;
  if (showBuilder) {
    body = <QuoteBuilder onSave={saveQuote} onCancel={() => setShowBuilder(false)} />;
  } else if (screen === 'dashboard') {
    body = <Dashboard user={user} quotes={quotes} invoices={invoices} taxOwed={taxOwed} setScreen={setScreen} />;
  } else if (screen === 'quotes') {
    body = <QuotesList quotes={quotes} setScreen={setScreen} setActiveQuoteId={setActiveQuoteId} startNewQuote={() => setShowBuilder(true)} />;
  } else if (screen === 'quote-detail') {
    body = <QuoteDetail quote={activeQuote} onBack={() => setScreen('quotes')}
      onUpdateStatus={(s) => updateQuoteStatus(activeQuote.id, s)}
      onConvertToInvoice={() => convertToInvoice(activeQuote)} />;
  } else if (screen === 'invoices') {
    body = <InvoicesList invoices={invoices} setActiveInvoiceId={setActiveInvoiceId} setScreen={setScreen} />;
  } else if (screen === 'invoice-detail') {
    body = <InvoiceDetail invoice={activeInvoice} onBack={() => setScreen('invoices')} onMarkPaid={() => markInvoicePaid(activeInvoice.id)} />;
  } else if (screen === 'tax') {
    body = <TaxDashboard invoices={invoices} />;
  }

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap');`}</style>
      <Shell user={user} screen={screen} setScreen={(s) => { setShowBuilder(false); setScreen(s); }} onLogout={handleLogout}>
        {body}
      </Shell>
    </>
  );
}

import React, { useState } from 'react';

// Dashboard UI for displaying results
function Dashboard({ result }) {
  if (!result) return null;
  return (
    <div className="dashboard">
      <h2>Credit Score: {result.creditScore}</h2>
      <h3>Improvement Tips:</h3>
      <ul>
        {result.tips && result.tips.length > 0 ? result.tips.map((tip, i) => <li key={i}>{tip}</li>) : <li>No tips needed!</li>}
      </ul>
    </div>
  );
}

function App() {
  const [form, setForm] = useState({
    creditScore: '',
    creditCards: [{ name: '', balance: '', limit: '', paymentOnTime: true }],
    paymentHistory: ['', '', '', '', '', '']
  });
  const [jsonInput, setJsonInput] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Handle manual field changes
  const handleChange = (e, idx, field) => {
    if (field === 'creditCards') {
      const cards = [...form.creditCards];
      cards[idx][e.target.name] = e.target.value;
      setForm({ ...form, creditCards: cards });
    } else if (field === 'paymentHistory') {
      const history = [...form.paymentHistory];
      history[idx] = e.target.value === 'true';
      setForm({ ...form, paymentHistory: history });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // Add/remove credit card fields
  const addCard = () => setForm({ ...form, creditCards: [...form.creditCards, { name: '', balance: '', limit: '', paymentOnTime: true }] });
  const removeCard = idx => setForm({ ...form, creditCards: form.creditCards.filter((_, i) => i !== idx) });

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    let payload;
    try {
      if (jsonInput) {
        payload = JSON.parse(jsonInput);
      } else {
        // Validate manual input
        payload = {
          creditScore: Number(form.creditScore),
          creditCards: form.creditCards.map(card => ({
            name: card.name,
            balance: Number(card.balance),
            limit: Number(card.limit),
            paymentOnTime: card.paymentOnTime === 'true' || card.paymentOnTime === true
          })),
          paymentHistory: form.paymentHistory.map(val => val === 'true' || val === true)
        };
      }
      // Basic validation
      if (!payload.creditScore || !Array.isArray(payload.creditCards) || !Array.isArray(payload.paymentHistory)) {
        setError('Please fill all required fields correctly.');
        return;
      }
    } catch (err) {
      setError('Invalid JSON or form data.');
      return;
    }
    // Send to backend
    try {
      const res = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server error');
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h1>CreditCoach Analyzer</h1>
      <form onSubmit={handleSubmit}>
        <label>Paste JSON credit data (optional):</label>
        <textarea value={jsonInput} onChange={e => setJsonInput(e.target.value)} rows={5} />
        <div>or fill manually:</div>
        <label>Credit Score:</label>
        <input type="number" name="creditScore" value={form.creditScore} onChange={handleChange} />
        <h3>Credit Cards</h3>
        {form.creditCards.map((card, idx) => (
          <div key={idx} className="card-fields">
            <input name="name" placeholder="Card Name" value={card.name} onChange={e => handleChange(e, idx, 'creditCards')} />
            <input name="balance" type="number" placeholder="Balance" value={card.balance} onChange={e => handleChange(e, idx, 'creditCards')} />
            <input name="limit" type="number" placeholder="Limit" value={card.limit} onChange={e => handleChange(e, idx, 'creditCards')} />
            <select name="paymentOnTime" value={card.paymentOnTime} onChange={e => handleChange(e, idx, 'creditCards')}>
              <option value={true}>On Time</option>
              <option value={false}>Late</option>
            </select>
            <button type="button" onClick={() => removeCard(idx)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addCard}>Add Card</button>
        <h3>Payment History (last 6 months)</h3>
        {form.paymentHistory.map((val, idx) => (
          <select key={idx} value={val} onChange={e => handleChange(e, idx, 'paymentHistory')}>
            <option value={true}>On Time</option>
            <option value={false}>Late</option>
          </select>
        ))}
        <button type="submit">Analyze</button>
      </form>
      {error && <div className="error">{error}</div>}
      <Dashboard result={result} />
    </div>
  );
}

export default App;

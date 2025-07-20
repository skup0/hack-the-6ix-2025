import React, { useState } from 'react';
import './index.css';

// Dashboard UI for displaying results
function Dashboard({ result }) {
  if (!result) return null;
  return (
    <div className="dashboard">
      <div className="credit-score">
        <div className="score-display">{result.creditScore}</div>
        <div className="score-label">Credit Score</div>
      </div>
      <div className="tips-section">
        <h3>💡 Improvement Tips</h3>
        <ul className="tips-list">
          {result.tips && result.tips.length > 0 ? 
            result.tips.map((tip, i) => <li key={i} className="tip-item">{tip}</li>) : 
            <li className="no-tips">🎉 Great job! No improvement tips needed!</li>
          }
        </ul>
      </div>
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
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🎯 CreditCoach</h1>
      <form onSubmit={handleSubmit} className="main-form">
        <div className="form-section">
          <label>📋 Paste JSON credit data (optional):</label>
          <textarea 
            value={jsonInput} 
            onChange={e => setJsonInput(e.target.value)} 
            placeholder='{"creditScore": 700, "creditCards": [{"name": "Visa", "balance": 1500, "limit": 5000, "paymentOnTime": true}], "paymentHistory": [true, true, false, true, true, true]}'
            rows={4} 
          />
        </div>

        <div className="divider">
          <span>or fill manually</span>
        </div>

        <div className="form-section">
          <div className="input-group">
            <label>💳 Credit Score:</label>
            <input 
              type="number" 
              name="creditScore" 
              value={form.creditScore} 
              onChange={handleChange}
              placeholder="Enter your credit score (300-850)"
              min="300"
              max="850"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>💰 Credit Cards</h3>
          {form.creditCards.map((card, idx) => (
            <div key={idx} className="card-fields">
              <div>
                <label>Card Name</label>
                <input 
                  name="name" 
                  placeholder="e.g., Visa Platinum" 
                  value={card.name} 
                  onChange={e => handleChange(e, idx, 'creditCards')} 
                />
              </div>
              <div>
                <label>Balance ($)</label>
                <input 
                  name="balance" 
                  type="number" 
                  placeholder="1500" 
                  value={card.balance} 
                  onChange={e => handleChange(e, idx, 'creditCards')} 
                />
              </div>
              <div>
                <label>Limit ($)</label>
                <input 
                  name="limit" 
                  type="number" 
                  placeholder="5000" 
                  value={card.limit} 
                  onChange={e => handleChange(e, idx, 'creditCards')} 
                />
              </div>
              <div>
                <label>Payment Status</label>
                <select 
                  name="paymentOnTime" 
                  value={card.paymentOnTime} 
                  onChange={e => handleChange(e, idx, 'creditCards')}
                >
                  <option value={true}>✅ On Time</option>
                  <option value={false}>❌ Late</option>
                </select>
              </div>
              <div>
                <label>&nbsp;</label>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={() => removeCard(idx)}
                  disabled={form.creditCards.length === 1}
                >
                  🗑️ Remove
                </button>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-add" onClick={addCard}>
            ➕ Add Credit Card
          </button>
        </div>

        <div className="form-section">
          <h3>📊 Payment History (Last 6 Months)</h3>
          <div className="payment-history">
            {form.paymentHistory.map((val, idx) => (
              <div key={idx}>
                <label>Month {6-idx}</label>
                <select value={val} onChange={e => handleChange(e, idx, 'paymentHistory')}>
                  <option value={true}>✅ On Time</option>
                  <option value={false}>❌ Late</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? <span className="loading"></span> : '🔍 Analyze Credit Score'}
        </button>
      </form>
      
      {error && <div className="error">⚠️ {error}</div>}
      <Dashboard result={result} />
    </div>
  );
}

export default App;

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
    
    // Client-side credit analysis (no backend needed)
    try {
      const analysisResult = analyzeCreditProfile(payload);
      setResult(analysisResult);
    } catch (err) {
      setError(err.message || 'Failed to analyze credit profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Client-side credit analysis function
  const analyzeCreditProfile = (data) => {
    const { creditScore, creditCards, paymentHistory } = data;
    const tips = [];

    // Credit utilization analysis
    const totalBalance = creditCards.reduce((sum, card) => sum + parseFloat(card.balance || 0), 0);
    const totalLimit = creditCards.reduce((sum, card) => sum + parseFloat(card.limit || 0), 0);
    const utilization = totalLimit > 0 ? (totalBalance / totalLimit) : 0;

    if (utilization > 0.3) {
      tips.push("High credit utilization detected. Try to keep total credit usage below 30% of your limits.");
    }

    if (utilization > 0.7) {
      tips.push("Very high credit utilization! Consider paying down balances immediately to improve your score.");
    }

    // Payment history analysis
    const latePayments = paymentHistory.filter(payment => payment === false).length;
    if (latePayments > 0) {
      tips.push(`You have ${latePayments} late payment(s) in the last 6 months. Set up automatic payments to avoid future late payments.`);
    }

    // Credit score range analysis
    if (creditScore < 600) {
      tips.push("Your credit score is in the poor range. Focus on making all payments on time and reducing debt.");
    } else if (creditScore < 650) {
      tips.push("Your credit score is fair. Continue making payments on time and consider keeping old accounts open to build credit history.");
    } else if (creditScore < 700) {
      tips.push("Your credit score is good. You're on the right track! Keep improving by maintaining low balances and on-time payments.");
    } else if (creditScore < 750) {
      tips.push("Your credit score is very good! You qualify for most loans and credit cards with competitive rates.");
    } else {
      tips.push("Excellent credit score! You have access to the best rates and terms available.");
    }

    // Credit mix analysis
    if (creditCards.length === 1) {
      tips.push("Consider diversifying your credit mix with different types of accounts (but only if needed).");
    }

    // Canadian-specific tips
    tips.push("In Canada, check your credit report for free annually through Equifax or TransUnion.");
    
    if (tips.length === 0) {
      tips.push("Great job! Your credit profile looks healthy. Keep up the good work!");
    }

    return {
      creditScore: creditScore,
      tips: tips
    };
  };

  return (
    <div className="container">
      <div className="header">
        <h1>SmartScore</h1>
        <p className="subtitle">Personal Credit Coach</p>
      </div>
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

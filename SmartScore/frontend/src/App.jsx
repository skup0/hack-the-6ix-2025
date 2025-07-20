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

  // Enhanced client-side credit analysis function
  const analyzeCreditProfile = (data) => {
    const { creditScore, creditCards, paymentHistory } = data;
    const tips = [];

    // Credit utilization analysis with detailed thresholds
    const totalBalance = creditCards.reduce((sum, card) => sum + parseFloat(card.balance || 0), 0);
    const totalLimit = creditCards.reduce((sum, card) => sum + parseFloat(card.limit || 0), 0);
    const utilization = totalLimit > 0 ? (totalBalance / totalLimit) : 0;
    const utilizationPercent = Math.round(utilization * 100);

    // Detailed utilization analysis
    if (utilization > 0.9) {
      tips.push(`URGENT: ${utilizationPercent}% utilization is extremely high! Pay down $${Math.round(totalBalance - (totalLimit * 0.3))} to get below 30%.`);
    } else if (utilization > 0.7) {
      tips.push(`Very high utilization at ${utilizationPercent}%. Reduce by $${Math.round(totalBalance - (totalLimit * 0.3))} for significant score improvement.`);
    } else if (utilization > 0.5) {
      tips.push(`High utilization at ${utilizationPercent}%. Aim for under 30% by paying down $${Math.round(totalBalance - (totalLimit * 0.3))}.`);
    } else if (utilization > 0.3) {
      tips.push(`Utilization at ${utilizationPercent}% is above ideal. Reduce by $${Math.round(totalBalance - (totalLimit * 0.3))} to reach the 30% sweet spot.`);
    } else if (utilization > 0.1) {
      tips.push(`Good utilization at ${utilizationPercent}%. For maximum score, consider keeping it under 10%.`);
    } else if (utilization > 0) {
      tips.push(`Excellent utilization at ${utilizationPercent}%! This positively impacts your credit score.`);
    }

    // Per-card analysis
    creditCards.forEach((card, index) => {
      const cardUtil = card.limit > 0 ? (card.balance / card.limit) : 0;
      if (cardUtil > 0.8) {
        tips.push(`Card "${card.name || `Card ${index + 1}`}" is ${Math.round(cardUtil * 100)}% utilized - consider paying this down first.`);
      }
    });

    // Payment history detailed analysis
    const latePayments = paymentHistory.filter(payment => payment === false).length;
    const onTimePercent = Math.round(((6 - latePayments) / 6) * 100);
    
    if (latePayments === 0) {
      tips.push("Perfect payment history! This is the most important factor for your credit score (35% weight).");
    } else if (latePayments === 1) {
      tips.push(`One late payment in 6 months (${onTimePercent}% on-time). Set up autopay to maintain perfect history going forward.`);
    } else if (latePayments === 2) {
      tips.push(`Two late payments significantly impact your score. Consider autopay and payment reminders immediately.`);
    } else {
      tips.push(`${latePayments} late payments is serious. Payment history is 35% of your score - make this your top priority.`);
    }

    // Credit score range analysis with specific advice
    if (creditScore < 560) {
      tips.push("Poor credit range (300-559). Focus on: 1) Pay all bills on time, 2) Pay down debt below 30%, 3) Don't close old accounts.");
      tips.push("Consider a secured credit card to rebuild credit history safely.");
    } else if (creditScore < 650) {
      tips.push("Fair credit range (560-649). You're improving! Continue paying on time and reducing utilization for better rates.");
      tips.push("You may qualify for some credit cards with higher fees - compare options carefully.");
    } else if (creditScore < 700) {
      tips.push("Good credit range (650-699). You're doing well! Fine-tune utilization under 10% for excellent status.");
      tips.push("You qualify for most mainstream credit products with reasonable rates.");
    } else if (creditScore < 750) {
      tips.push("Very good credit range (700-749). You qualify for premium cards and competitive rates.");
      tips.push("Consider credit mix diversification if you only have credit cards (add installment loan if needed).");
    } else if (creditScore < 800) {
      tips.push("Excellent credit range (750-799)! You get the best rates available from most lenders.");
      tips.push("Maintain current habits. Consider maximizing rewards with premium credit cards.");
    } else {
      tips.push("Exceptional credit (800+)! You have access to the very best rates and terms available.");
      tips.push("Your credit is a valuable asset. Consider leveraging it for wealth-building opportunities.");
    }

    // Credit mix analysis
    if (creditCards.length === 1) {
      tips.push("Single credit card detected. Consider adding one more card to improve credit mix (10% of score).");
    } else if (creditCards.length > 5) {
      tips.push("Many credit cards detected. Avoid opening new accounts - focus on optimizing existing ones.");
    }

    // Account age analysis (simulated)
    const avgCardAge = 3; // Simulated - would need real data
    if (avgCardAge < 2) {
      tips.push("Young credit history. Keep your oldest accounts open - credit age is 15% of your score.");
    }

    // Canadian-specific detailed advice
    tips.push("🍁 Canadian tip: Check your free credit reports from both Equifax Canada and TransUnion Canada annually.");
    tips.push("🍁 Consider Canadian credit-building tools like KOHO, Paymi, or Neo Financial for credit improvement.");
    
    if (creditScore < 650) {
      tips.push("🍁 For fair credit in Canada, consider secured cards from Canadian banks (RBC, TD, BMO, Scotiabank).");
    } else if (creditScore >= 700) {
      tips.push("🍁 Your score qualifies for premium Canadian cards like Aeroplan, Cobalt, or cashback cards with rewards.");
    }

    // Financial wellness tips
    if (utilization > 0.5) {
      tips.push("💡 Consider the debt avalanche method: pay minimums on all cards, extra on highest interest rate card.");
    }
    
    if (creditScore >= 650) {
      tips.push("💡 You may qualify for balance transfer cards (0% intro APR) to consolidate and pay down debt faster.");
    }

    return {
      creditScore: creditScore,
      tips: tips,
      analysis: {
        utilizationPercent,
        onTimePercent,
        totalDebt: totalBalance,
        availableCredit: totalLimit - totalBalance,
        recommendation: creditScore >= 750 ? "Maintain excellent habits" : 
                      creditScore >= 650 ? "Focus on utilization reduction" : 
                      "Prioritize payment history"
      }
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

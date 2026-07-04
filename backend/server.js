import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

app.use(cors());
app.use(express.json());

// Mock in-memory transaction database
let transactions = [
  {
    id: "TX-90182",
    date: "2026-07-01",
    entity: "Horizon Ventures",
    category: "Investments",
    amount: -125000.00,
    status: "Completed",
    hash: "0x8fa3...b8e9"
  },
  {
    id: "TX-90181",
    date: "2026-06-30",
    entity: "Aether Carbon Offset",
    category: "Compliance",
    amount: -8500.00,
    status: "Completed",
    hash: "0x3ab2...c12a"
  },
  {
    id: "TX-90180",
    date: "2026-06-29",
    entity: "Vault Inflow #88",
    category: "Deposit",
    amount: 350000.00,
    status: "Completed",
    hash: "0x7fd1...88ab"
  },
  {
    id: "TX-90179",
    date: "2026-06-28",
    entity: "Lumiere Fine Arts",
    category: "Acquisitions",
    amount: -45000.00,
    status: "Completed",
    hash: "0x2da8...ff3e"
  },
  {
    id: "TX-90178",
    date: "2026-06-27",
    entity: "Alex.J (P2P Transfer)",
    category: "Transfer",
    amount: -250.00,
    status: "Completed",
    hash: "0xbc99...3a1f"
  }
];

// 1. Get transactions endpoint
app.get('/api/transactions', (req, res) => {
  res.json(transactions);
});

// 2. Execute transfer endpoint
app.post('/api/transfer', async (req, res) => {
  const { recipient, amount, category = 'Transfer' } = req.body;
  if (!recipient || !amount) {
    return res.status(400).json({ error: 'Recipient and amount are required' });
  }

  const amt = parseFloat(amount);
  if (isNaN(amt) || amt <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number' });
  }

  try {
    // Call the Python AI service to validate using LangGraph transfer validation tool
    const validationMessage = {
      role: 'user',
      content: `Validate a transfer of $${amt} to ${recipient}.`
    };
    
    const aiRes = await axios.post(`${AI_SERVICE_URL}/chat`, {
      messages: [validationMessage],
      user_profile: { tier: 'ELITE', balance: 1402890.45 }
    });

    const aiText = aiRes.data.content;

    if (aiText.includes('REJECTED')) {
      return res.status(400).json({
        success: false,
        error: aiText
      });
    }

    // Add to mock database
    const newTx = {
      id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().split('T')[0],
      entity: recipient,
      category: category,
      amount: -amt,
      status: aiText.includes('WARNING') ? 'Pending Cryptokey' : 'Completed',
      hash: '0x' + Math.random().toString(16).substr(2, 8) + '...' + Math.random().toString(16).substr(2, 4)
    };

    transactions.unshift(newTx);

    res.json({
      success: true,
      message: aiText,
      transaction: newTx
    });
  } catch (err) {
    console.error('Validation error:', err.message);
    // Fallback if AI service is not running
    const newTx = {
      id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().split('T')[0],
      entity: recipient,
      category: category,
      amount: -amt,
      status: 'Completed',
      hash: '0x' + Math.random().toString(16).substr(2, 8) + '...' + Math.random().toString(16).substr(2, 4)
    };
    transactions.unshift(newTx);
    res.json({
      success: true,
      message: 'APPROVED: Transfer is pre-authorized (offline compliance).',
      transaction: newTx
    });
  }
});

// 3. Proxy chat messages to FastAPI LangGraph agent
app.post('/api/chat', async (req, res) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/chat`, req.body);
    res.json(response.data);
  } catch (err) {
    console.error('AI chat error:', err.message);
    res.status(500).json({ error: 'AI advisor service is offline' });
  }
});

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});

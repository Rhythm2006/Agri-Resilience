/**
 * Express Backend Server (Vercel Serverless Function format)
 * - Proxies OpenRouter API calls (hides API key from client)
 * - Stores chat conversations in MongoDB
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGODB_URI;
const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = 'nvidia/nemotron-3-nano-30b-a3b:free';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

let db = null;
let client = null;

// ─── MongoDB Connection ──────────────────────────────────────────────────────

async function connectDB() {
    if (db) return db;
    try {
        if (!client) {
            client = new MongoClient(MONGO_URI);
            await client.connect();
        }
        db = client.db('agri_resilience');
        console.log('[Serverless] Connected to MongoDB');
        return db;
    } catch (err) {
        console.error('[Serverless] MongoDB connection failed:', err.message);
        return null;
    }
}

// ─── System Prompt ───────────────────────────────────────────────────────────

const SYSTEM_PROMPT = {
    role: 'system',
    content: `You are "Krishi Mitra", a knowledgeable agricultural advisor for farmers in Haryana and Uttar Pradesh, India.

Your expertise covers:
- Crop selection and seasonal planning (Rabi, Kharif, Zaid seasons)
- Climate change impacts on agriculture in North India
- Irrigation strategies (drip, flood, sprinkler) and water management
- Pest and disease management affected by rising temperatures
- Soil health and fertility management
- Government schemes and subsidies for farmers (PM-KISAN, PMFBY, etc.)
- Climate-resilient farming practices
- Weather pattern interpretation and forecasting impact

Guidelines:
1. Keep answers CONCISE and PRACTICAL.
2. Use simple language. Avoid overly technical jargon.
3. When relevant, mention specific crop varieties suited to Haryana or UP.
4. Include seasonal context whenever applicable.
5. Clarify that you provide general guidance, not precise forecasts.
6. Be warm and encouraging.
7. Use bullet points for multi-step advice.
8. When relevant, mention approximate costs or yields.
9. Consider both Haryana and UP contexts unless specified.
10. If unsure, suggest consulting the local Krishi Vigyan Kendra (KVK).`
};

// ─── Routes ──────────────────────────────────────────────────────────────────

/**
 * POST /api/chat
 * Proxies messages to OpenRouter and stores conversation in MongoDB
 */
app.post('/api/chat', async (req, res) => {
    try {
        const { messages, sessionId } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Messages array is required' });
        }

        // Build full message list with system prompt
        const fullMessages = [
            SYSTEM_PROMPT,
            ...messages.map(m => ({
                role: m.role,
                content: m.content,
                ...(m.reasoning_details ? { reasoning_details: m.reasoning_details } : {})
            }))
        ];

        // Call OpenRouter
        const response = await fetch(OPENROUTER_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: MODEL,
                messages: fullMessages,
                reasoning: { enabled: true }
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('[Serverless] OpenRouter error:', response.status, errText);
            return res.status(502).json({ error: 'AI service temporarily unavailable' });
        }

        const result = await response.json();

        if (result.error) {
            return res.status(502).json({ error: result.error.message });
        }

        if (!result.choices || result.choices.length === 0) {
            return res.status(502).json({ error: 'No response from AI' });
        }

        const assistantMessage = result.choices[0].message;

        // Store in MongoDB
        const database = await connectDB();
        if (database && sessionId) {
            const userMsg = messages[messages.length - 1];
            database.collection('chat_sessions').updateOne(
                { sessionId },
                {
                    $push: {
                        messages: {
                            $each: [
                                { role: userMsg.role, content: userMsg.content, timestamp: new Date() },
                                { role: 'assistant', content: assistantMessage.content, timestamp: new Date() }
                            ]
                        }
                    },
                    $set: { updatedAt: new Date() },
                    $setOnInsert: { createdAt: new Date() }
                },
                { upsert: true }
            ).catch(err => console.error('[Serverless] DB write error:', err.message));
        }

        res.json({
            content: assistantMessage.content,
            reasoning_details: assistantMessage.reasoning_details
        });

    } catch (error) {
        console.error('[Serverless] Chat error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /api/chat/history/:sessionId
 * Retrieves past chat messages for a session
 */
app.get('/api/chat/history/:sessionId', async (req, res) => {
    try {
        const database = await connectDB();
        if (!database) return res.json({ messages: [] });
        const session = await database.collection('chat_sessions').findOne(
            { sessionId: req.params.sessionId }
        );
        res.json({ messages: session?.messages || [] });
    } catch (error) {
        console.error('[Serverless] History error:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// For local development, fallback to normal listen
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => console.log(`[Local] Server running on http://localhost:${PORT}`));
}

// Export for Vercel Serverless
export default app;

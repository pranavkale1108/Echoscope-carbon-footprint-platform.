import express from 'express';
import { GoogleGenAI } from '@google/genai';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ActionLog from '../models/ActionLog.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Helper to sign JWT
const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user with email and password
 * @access  Public
 */
router.post('/auth/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already registered with this email' });
    }

    const user = await User.create({
      email,
      password,
      username: username || email.split('@')[0],
      worldHealthScore: 50,
      totalCo2EmittedKg: 0
    });

    if (user) {
      const token = generateToken(user._id, user.email);
      return res.status(201).json({
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          worldHealthScore: user.worldHealthScore,
          totalCo2EmittedKg: user.totalCo2EmittedKg
        }
      });
    } else {
      return res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (error) {
    console.error(`[Register API Error] ${error.message}`);
    return res.status(500).json({ error: error.message || 'Failed to register user' });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id, user.email);
      return res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          worldHealthScore: user.worldHealthScore,
          totalCo2EmittedKg: user.totalCo2EmittedKg
        }
      });
    } else {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(`[Login API Error] ${error.message}`);
    return res.status(500).json({ error: error.message || 'Failed to login' });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get authenticated user profile
 * @access  Private
 */
router.get('/auth/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    return res.json({
      id: user._id,
      email: user.email,
      username: user.username,
      worldHealthScore: user.worldHealthScore,
      totalCo2EmittedKg: user.totalCo2EmittedKg
    });
  } catch (error) {
    console.error(`[Auth Me API Error] ${error.message}`);
    return res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

/**
 * @route   GET /api/logs
 * @desc    Fetch action logs for the authenticated user
 * @access  Private
 */
router.get('/logs', requireAuth, async (req, res) => {
  try {
    const logs = await ActionLog.find({ userId: req.user.id }).sort({ createdAt: -1 });
    // Convert backend logs into same structure expected by UI
    const formattedLogs = logs.map(log => ({
      id: log._id,
      rawInput: log.rawInput,
      actionSummary: log.actionSummary,
      estimatedCo2Kg: log.estimatedCo2Kg,
      scoreImpact: log.scoreImpact,
      loggedAt: log.loggedAt || log.createdAt
    }));
    return res.json(formattedLogs);
  } catch (error) {
    console.error(`[GET Logs Error] ${error.message}`);
    return res.status(500).json({ error: 'Failed to fetch action logs' });
  }
});

/**
 * @route   POST /api/log-action
 * @desc    Submit raw action text, parse with Gemini API, update User score and save ActionLog
 * @access  Private
 */
router.post('/log-action', requireAuth, async (req, res) => {
  try {
    const { rawInput } = req.body;
    const { id } = req.user;

    // 1. Validation
    if (!rawInput) {
      return res.status(400).json({ error: 'rawInput is a required parameter' });
    }

    // 2. Locate User by id
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // 3. Initialize Gemini SDK
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.status(500).json({ error: 'Gemini API key is not configured on the server' });
    }

    const ai = new GoogleGenAI({ apiKey });

    // 4. Query Gemini with structured output constraints
    const systemPrompt = `You are a carbon footprint and environmental analyst. Your task is to review the user's daily activity input and estimate its ecological impact.
Rules:
1. Provide a short 3-5 word summary in 'actionSummary' (e.g. 'Ate plant-based burger', 'Commuted in diesel SUV', 'Unplugged vampire electronics').
2. Estimate the carbon emissions in kg and return it in 'estimatedCo2Kg'. Active travel, plant-based diets, and low power usage are near 0. Single flights or long gas drives are double/triple digits.
3. Compute the 'scoreImpact' integer strictly bounded between -15 (extremely bad, e.g. buying coal power or a long-distance flight) and +15 (extremely green, e.g. switching home to solar energy or planting trees).`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `User logged activity: "${rawInput}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            actionSummary: {
              type: 'STRING',
              description: 'A 3-5 word description of the logged action.'
            },
            estimatedCo2Kg: {
              type: 'NUMBER',
              description: 'Estimated emissions generated by this action in kilograms.'
            },
            scoreImpact: {
              type: 'INTEGER',
              description: 'The net environmental score impact, bounded between -15 and +15.'
            }
          },
          required: ['actionSummary', 'estimatedCo2Kg', 'scoreImpact']
        }
      }
    });

    // 5. Parse Gemini's JSON response
    let parsedResult;
    try {
      const text = response.text;
      parsedResult = JSON.parse(text);
    } catch (parseError) {
      console.error(`[Gemini Parse Error] Failed parsing model text: ${response.text}`, parseError);
      return res.status(500).json({ error: 'AI engine returned invalid structured metrics' });
    }

    const { actionSummary, estimatedCo2Kg, scoreImpact } = parsedResult;

    if (actionSummary === undefined || estimatedCo2Kg === undefined || scoreImpact === undefined) {
      return res.status(500).json({ error: 'AI engine response was missing required fields' });
    }

    // 6. Update User's Profile
    // Accumulate total emissions
    user.totalCo2EmittedKg = Math.max(0, user.totalCo2EmittedKg + estimatedCo2Kg);
    // Adjust world health score, clamped between 0 and 100
    user.worldHealthScore = Math.max(0, Math.min(100, user.worldHealthScore + scoreImpact));

    await user.save();

    // 7. Save ActionLog
    const actionLog = new ActionLog({
      userId: user._id,
      rawInput,
      actionSummary,
      estimatedCo2Kg,
      scoreImpact
    });

    await actionLog.save();

    // 8. Return Response
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        worldHealthScore: user.worldHealthScore,
        totalCo2EmittedKg: user.totalCo2EmittedKg
      },
      actionLog: {
        id: actionLog._id,
        rawInput: actionLog.rawInput,
        actionSummary: actionLog.actionSummary,
        estimatedCo2Kg: actionLog.estimatedCo2Kg,
        scoreImpact: actionLog.scoreImpact,
        loggedAt: actionLog.loggedAt
      }
    });

  } catch (error) {
    console.error(`[API Log Action Error] ${error.stack || error.message}`);
    return res.status(500).json({ error: error.message || 'Internal server error while logging action' });
  }
});

export default router;


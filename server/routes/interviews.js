import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenerativeAI } from '@google/generative-ai';
import Interview from '../models/Interview.js';
import auth from '../middleware/auth.js';

const router = express.Router();
const geminiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(geminiKey);

// Create new interview
router.post('/create', auth, async (req, res) => {
  try {
    const { role, experience, jobDescription } = req.body;

    const interview = new Interview({
      userId: req.userId,
      role,
      experience,
      jobDescription,
      questions: []
    });

    // Generate questions using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Generate 10 interview questions for a ${role} position with ${experience} years of experience. Job Description: ${jobDescription}. Return only the questions as a numbered list.`;
    
    const result = await model.generateContent(prompt);
    const questionsText = result.response.text();
    
    const questionsList = questionsText
      .split('\n')
      .filter(line => line.trim() && /^\d+\./.test(line.trim()))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .slice(0, 10);

    interview.questions = questionsList.map(question => ({
      question,
      answer: '',
      score: 0,
      feedback: ''
    }));

    await interview.save();
    res.json(interview);
  } catch (error) {
    console.error('Error creating interview:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit answers and get feedback
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const { answers } = req.body;
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.userId });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let totalScore = 0;
    let answeredQuestions = 0;

    for (let i = 0; i < interview.questions.length && i < answers.length; i++) {
      // Check if answer is provided and not empty
      if (!answers[i] || answers[i].trim() === '') {
        // Handle skipped answers
        interview.questions[i].answer = '';
        interview.questions[i].score = 0;
        interview.questions[i].feedback = 'Question skipped - no answer provided.';
        continue;
      }

      interview.questions[i].answer = answers[i];
      answeredQuestions++;

      const prompt = `Evaluate this interview answer for a ${interview.role} position:
      
      Question: ${interview.questions[i].question}
      Answer: ${answers[i]}
      
      Please provide:
      1. A score from 1-10
      2. Specific feedback for improvement
      
      Format your response as:
      Score: [number]
      Feedback: [your feedback]`;

      try {
        const result = await model.generateContent(prompt);
        const evaluation = result.response.text();
        
        const scoreMatch = evaluation.match(/Score:\s*(\d+)/i);
        const feedbackMatch = evaluation.match(/Feedback:\s*(.*)/is);
        
        const score = scoreMatch ? parseInt(scoreMatch[1]) : 5;
        const feedback = feedbackMatch ? feedbackMatch[1].trim() : 'Good effort! Keep practicing.';
        
        interview.questions[i].score = Math.max(1, Math.min(10, score));
        interview.questions[i].feedback = feedback;
        totalScore += interview.questions[i].score;
      } catch (error) {
        console.error('Error evaluating answer:', error);
        interview.questions[i].score = 5;
        interview.questions[i].feedback = 'Unable to evaluate at this time.';
        totalScore += 5;
      }
    }

    // Calculate average score only for answered questions
    interview.totalScore = answeredQuestions > 0 ? Math.round(totalScore / answeredQuestions) : 0;
    interview.completed = true;
    await interview.save();

    res.json(interview);
  } catch (error) {
    console.error('Error submitting interview:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's interviews
router.get('/my-interviews', auth, async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific interview
router.get('/:id', auth, async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.userId });
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
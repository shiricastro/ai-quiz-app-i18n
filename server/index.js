require('dotenv').config();
const express = require('express');
const cors = require('cors');
const generateExercises = require('./openaiService');

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));


app.post('/api/generate', async (req, res, next) => {
  const { topic, subtopic, lang, levels } = req.body;

  if (!topic?.trim() || !subtopic?.trim() || !Array.isArray(levels) || levels.length === 0) {
    return res.status(400).json({ error: 'Missing or invalid topic, subtopic, or levels' });
  }

  try {
    const result = await generateExercises(topic, subtopic, lang, levels);
    res.json({ questions: result });
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: 'Server error occurred. Please try again.' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

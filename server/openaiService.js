const OpenAI = require("openai");

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) throw new Error("Missing OPENAI_API_KEY in .env file");

const openai = new OpenAI({ apiKey });

const promtTemplate = (topic, subtopic, lang, level) => {
  return `
  You are a JSON generator.
  Generate exactly 10 multiple-choice questions about "${subtopic}" in the context of "${topic}".
  Level: ${level}
  Language: ${lang}

  Each question must be an object with:
  - "question": (string) The question text (do NOT include A, B, C, D)
  - "choices": (array of 4 strings) Do NOT prefix choices with letters.
  - "answerIndex": (number from 0 to 3) The index of the correct answer.
  - "explanation": (string) A short explanation


  Do NOT include any labels (A., B., etc.), markdown, or text outside the JSON.


  Return only raw JSON like this:
  [
    {
      "question": "What is 2 + 2?",
      "choices": ["1", "2", "3", "4"],
      "answerIndex": 3,
      "explanation": "2 + 2 equals 4."
    },
    ...
  ]
  `.trim();
}

const isValidQuestion = (q) => {
  return (
    typeof q === 'object' &&
    typeof q.question === 'string' &&
    Array.isArray(q.choices) &&
    q.choices.length === 4 &&
    typeof q.answerIndex === 'number' &&
    q.answerIndex >= 0 &&
    q.answerIndex <= 3 &&
    typeof q.explanation === 'string'
  );
}
const generateExercises = async (topic, subtopic, lang = 'English',levels) => {
  
  const responseMap = {};

  for (const level of levels) {
    const prompt = promtTemplate(topic, subtopic, lang, level);

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        temperature: 0.3,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = completion.choices[0]?.message?.content;
      
      if (!content || !content.trim().startsWith("[")) {
        console.error("Unexpected content format:", content);
        throw new Error(`Unexpected response format for level "${level}"`);
      }

      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch (parseError) {
        console.error(`JSON parse failed for level: ${level}`);
        console.error("Returned content:", content);
        throw new Error(`Invalid JSON returned for level "${level}"`);
      }

      if (!Array.isArray(parsed) || !parsed.every(isValidQuestion)) {
        console.error("Validation failed for questions in level:", level);
        throw new Error(`Invalid question format returned for level "${level}"`);
      }
      responseMap[level] = parsed;

    } catch (apiError) {
      console.error(`OpenAI API error for level "${level}":`, apiError.message);
      throw new Error(`Failed to generate questions for level "${level}"`);
    }
  }

  return responseMap;
}


module.exports =  generateExercises ;


export const fetchAndStoreQuiz = async ({ topic, subtopic, lang, levels = ['beginner', 'intermediate', 'expert'] }) => {
  const baseKey = `${normalizeText(topic)}-${normalizeText(subtopic)}`;
  const fullKey = `${baseKey}-${lang}`;
  const saved = getJSONFromLocal("quizData") || {};

  let serverResponse;

  try {
    const res = await fetch('http://localhost:3001/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic,
        subtopic,
        lang: lang === 'en' ? 'English' : 'Hebrew',
        levels,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Server responded with ${res.status}: ${errorText}`);
    }

    serverResponse = await res.json();

    if (!serverResponse.questions || typeof serverResponse.questions !== 'object') {
      throw new Error("Invalid response from server");
    }

  } catch (err) {
    throw new Error("Failed to fetch quiz");
  }

  const incoming = serverResponse?.questions ?? serverResponse;
  const prev = saved[fullKey] || { topic, subtopic, lang, questions: {} };
  let mergedQuestions = { ...prev.questions };
  if (Array.isArray(levels) && levels.length === 1) {
    const lvl = levels[0];
    const incomingForLevel = Array.isArray(incoming) ? incoming : incoming?.[lvl];
    if (Array.isArray(incomingForLevel)) {
      mergedQuestions[lvl] = incomingForLevel;
    } else {
      console.warn('No questions array for requested level; keeping existing cache for that level.');
    }
  } else {
    if (incoming && typeof incoming === 'object' && !Array.isArray(incoming)) {
      mergedQuestions = { ...mergedQuestions, ...incoming };
    } else if (Array.isArray(incoming)) {
      mergedQuestions = { ...mergedQuestions, all: incoming };
    }
  }
  const newQuiz = {
    topic,
    subtopic,
    lang,
    questions: mergedQuestions,
    updatedAt: Date.now(),
  };

  const updated = { ...saved, [fullKey]: newQuiz };

  setToLocal("quizData", updated);

  return newQuiz;
};

export const normalizeText = (str) => {
  return (str || "").toLowerCase().trim().replace(/\s+/g, '-');
};
export const getJSONFromLocal = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch {
    return {};
  }
};
export const getFromLocal = (key) => {
  return localStorage.getItem(key);
}
export const setToLocal = (key,data) => {
  const value = typeof data === "string" ? data : JSON.stringify(data);
  localStorage.setItem(key, value);
}


 
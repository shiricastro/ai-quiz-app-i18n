import { useCallback, useEffect, useState, useMemo } from "react";
import { useTranslation } from 'react-i18next';
import ProgressBar from "./resultParts/ProgressBar";
import LevelTabs from "./resultParts/LevelTabs";
import LanguageWarning from "./resultParts/LanguageWarning";
import ResultFooter from "./resultParts/ResultFooter";
import QuestionList from "./resultParts/QuestionList";
import { getJSONFromLocal, setToLocal, normalizeText } from "../utils/quizUtils";

const ResultComp = ({ data, onRegenerate, regenLoader }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const [activeLevel, setActiveLevel] = useState("beginner");
  const [userAnswers, setUserAnswers] = useState({});
  const [scores, setScores] = useState({});

  const baseKey = `${normalizeText(data.topic)}-${normalizeText(data.subtopic)}`;
  const quizKey = `${baseKey}-${data.lang}`;
  const currentLangKey = `${baseKey}-${currentLang}`;
  const progressKey = `${quizKey}-${activeLevel}`;
  
  const quizData = getJSONFromLocal("quizData");
  const hasTranslation = !!quizData[currentLangKey];
  const showLangWarning=data.lang !== currentLang && !hasTranslation;

  const questions = useMemo(() => data.questions?.[activeLevel], [data, activeLevel]);
  useEffect(() => {
    setUserAnswers({});
    setScores({});
  }, [data]);

  useEffect(() => {
    const savedProgress = getJSONFromLocal("quizProgress");
    setUserAnswers(savedProgress);

    if (savedProgress[quizKey]) {
      const newScores = {};
      Object.entries(savedProgress[quizKey]).forEach(([level, val]) => {
        newScores[`${quizKey}-${level}`] = val.score;
      });
      setScores(newScores);
    }
  }, [quizKey]);

  const currentAnswers = useMemo(() => {
    return userAnswers[quizKey]?.[activeLevel]?.answers || {};
  }, [userAnswers, quizKey, activeLevel]);

  const storeLevelProgress = useCallback((level, record) => {
    const updated = {
      ...userAnswers,
      [quizKey]: {
        ...(userAnswers[quizKey] || {}),
        [level]: record,
      },
    };
    if (typeof record?.score === 'number') {
      const pk = `${quizKey}-${level}`;
      setScores(prev => ({ ...prev, [pk]: record.score }));
    }
    setToLocal("quizProgress", updated);
    setUserAnswers(updated);
  }, [quizKey]);

  const handleSelectAnswer = useCallback((index, selectedIndex) => {
    const updatedAnswers = {
      ...currentAnswers,
      [index]: selectedIndex,
    };

    setUserAnswers((prev) => {
      const updatedProgress = {
        ...prev,
        [quizKey]: {
          ...(prev[quizKey] || {}),
          [activeLevel]: {
            ...(prev[quizKey]?.[activeLevel] || {}),
            answers: updatedAnswers,
          },
        },
      };
      setToLocal("quizProgress", updatedProgress);
      return updatedProgress;
    });
  }, [activeLevel, quizKey, currentAnswers]);

  const calculateScore = useCallback(() => {
    if (Object.keys(currentAnswers).length < questions.length) {
      alert(t("error_form_submission"));
      return;
    }

    let correct = 0;
    questions.forEach((q, i) => {
      if (currentAnswers[i] === q.answerIndex) correct++;
    });

    const score = Math.round((correct / questions.length) * 100);
    const result = {
      answers: currentAnswers,
      score,
      completed: true,
    };

    storeLevelProgress(activeLevel, result);
  }, [currentAnswers, activeLevel, questions, storeLevelProgress, t]);

  const clearLevelProgress = useCallback(() => {
    const updated = { ...userAnswers };
    if (updated[quizKey]) {
      delete updated[quizKey][activeLevel];
    }
    setToLocal("quizProgress", updated);
    setUserAnswers(updated);
    setScores(prev => ({ ...prev, [progressKey]: null }));
  }, [userAnswers, quizKey, activeLevel, progressKey]);

  const handleRegenerateLevel = useCallback(() => {
    clearLevelProgress();
    onRegenerate(data.topic, data.subtopic, activeLevel);
  }, [clearLevelProgress, onRegenerate, activeLevel]);


  const isSubmitted = scores[progressKey] != null;

  if (!Array.isArray(data?.questions?.[activeLevel])) {
    return (
      <div className="result-container">
        <h2>{t("error_fetch_quiz")}</h2>
      </div>
    );
  }
  
  return (
    <div className="result-container" aria-busy={regenLoader}>
      <h1 className="title">{t("result_title")}</h1>
      <h2 className="subtitle mb-6">{data.topic} - {data.subtopic}</h2>

      {
        showLangWarning && (
          <LanguageWarning
            currentLang={currentLang}
            quizLang={data.lang}   
          />
        )
      }

      <LevelTabs
        activeLevel={activeLevel}
        handleActiveLevel={setActiveLevel}
      />

      <ProgressBar
        currentAnswers={currentAnswers}
        totalQuestions={questions.length}
      />

      <QuestionList
        questions={questions}
        currentAnswers={currentAnswers}
        isSubmitted={isSubmitted}
        handleSelectAnswer={handleSelectAnswer}
      />
      
      <ResultFooter
        isSubmitted={isSubmitted}
        calculateScore={calculateScore}
        clearLevelProgress={clearLevelProgress}
        score={scores[progressKey]}
        regenerateLevel={handleRegenerateLevel}
        regenLoader={regenLoader}
      />

    </div>
  );
};

export default ResultComp;

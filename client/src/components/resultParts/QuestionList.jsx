import { useTranslation } from 'react-i18next';

const QuestionList = ({ questions, currentAnswers, isSubmitted, handleSelectAnswer }) => {
    const { t } = useTranslation(); 
    return (
        <div className="space-y-4">
        {questions.map((q, i) => {
            const selectedIndex = currentAnswers[i];
            const isCorrect = selectedIndex === q.answerIndex;

            return (
            <fieldset key={i} className="question-container">
                <legend className="question-title">{i + 1}. {q.question}</legend>
                <div className="flex flex-col gap-2">
                    {
                        q.choices.map((choice, idx) => {
                            const isSelected = selectedIndex === idx;
                            return (
                            <label
                                key={idx}
                                className={`flex items-center gap-2 cursor-pointer ${
                                isSubmitted && isSelected
                                    ? isCorrect
                                    ? "text-green-600"
                                    : "text-red-500"
                                    : ""
                                }`}
                            >
                                <input
                                type="radio"
                                name={`q-${i}`}
                                checked={isSelected}
                                disabled={isSubmitted}
                                onChange={() => handleSelectAnswer(i, idx)}
                                />
                                <span>{choice}</span>
                            </label>
                            );
                        })
                    }
                </div>

                {isSubmitted && (
                    <p className="explanation-container" role="region" aria-live="polite">
                        {isCorrect
                        ? `✅ ${t('correct_answer')}`
                        : `❌ ${t('wrong_answer')} : ${q.choices[q.answerIndex]}`}
                        <br />
                        <span className="italic">{q.explanation}</span>
                    </p>
                )}
            </fieldset>
            );
        })}
        </div>
    )
}

export default QuestionList

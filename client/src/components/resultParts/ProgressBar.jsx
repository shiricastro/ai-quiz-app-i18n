import { useTranslation } from 'react-i18next';

const ProgressBar = ({ currentAnswers,totalQuestions }) => {
    const { t } = useTranslation();    
    const answeredCount = Object.keys(currentAnswers).length;
    const percentage = totalQuestions > 0
    ? Math.round((answeredCount / totalQuestions) * 100)
    : 0;
    return (
    <div className="mb-4">
        <div className="progress-bar-container">
            <div
            className="progress-bar"
            role="progressbar" aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100"
            style={{ width: `${percentage}%` }}
            ></div>
        </div>
        <div className="progress-bar-text">
            {t('progress')} {answeredCount}/{totalQuestions} ({percentage}%)
        </div>
    </div>
    )
}

export default ProgressBar

import { useTranslation } from 'react-i18next';

const LEVELS = ["beginner", "intermediate", "expert"];

const LevelTabs = ({ activeLevel, handleActiveLevel }) => {
    const { t } = useTranslation(); 
    return (
        <div className="levels-tab-container">
        {
            LEVELS.map((level) => (
                <button
                key={level}
                onClick={() => handleActiveLevel(level)}
                aria-pressed={activeLevel === level}
                className={`btn-tab ${activeLevel === level ? "btn-tab-active" : "btn-tab-default"}`}
                >
                    {t(`levels.${level}`)}
                </button>
            ))
        }
        </div>
    )
}

export default LevelTabs

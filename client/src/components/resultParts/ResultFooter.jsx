import { useTranslation } from 'react-i18next';
import LoaderIcon from '../icons/LoaderIcon';

const ResultFooter = ({ score, isSubmitted, calculateScore, clearLevelProgress, regenerateLevel, regenLoader }) => {
    const { t } = useTranslation(); 
    return (
        <div className="result-footer-container">           
            {
                isSubmitted && (
                    <div className="score-text" role="status" aria-live="polite">
                        {t('score')}: {score} {score === 100 && '🏆'}
                    </div>
                )
            }
            <div className='result-footer-btns-container'>                
                {
                    !isSubmitted && (
                        <button type="button" onClick={calculateScore} className="btn-primary w-auto">
                            {t('submit')}
                        </button>
                    )
                } 
                <button type="button" onClick={clearLevelProgress} className="btn-base w-auto ">
                    {t('reset')}
                </button>  
                <button
                    type="button"
                    onClick={regenerateLevel}
                    className="btn-base w-auto"
                    disabled={regenLoader}
                >
                    {
                        regenLoader ? (
                        <LoaderIcon/>
                        ) : t("regenerate_level")
                    }
                </button>
                     
            </div>
        </div>
    )
}

export default ResultFooter

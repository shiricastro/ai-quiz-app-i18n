import { useTranslation } from 'react-i18next';

const LanguageWarning = ({ currentLang, quizLang }) => {
    const { t } = useTranslation(); 
    return (
        <div className="worning-container">
            {
                t('language_mismatch_warning', {
                    quizLang: quizLang === 'he' ? 'Hebrew' : 'אנגלית',
                    currentLang: currentLang === 'he' ? 'עברית' : 'English'
                })
            }
            <br />
            {t('language_reload_suggestion')}
        </div>
    )
}

export default LanguageWarning

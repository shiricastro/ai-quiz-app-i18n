import { useTranslation } from 'react-i18next';

const Header = ({showBack, onBack, onToggleLang, currentLang}) => {
    const { t } = useTranslation();

    return (
    <div>
        <header
            className="header"
        >
            {showBack && (
                <button onClick={onBack} className={`btn-small-link ${currentLang === 'he' ? 'ml-auto' : ''}`}>
                {t('back')}
                </button>
            )}


            <button
                aria-label="Switch Language"
                onClick={onToggleLang}
                className={`btn-primary-small ${currentLang === 'he' ? '' : 'ml-auto'}`}
            >
                {currentLang === 'en' ? 'עברית' : 'English'}
            </button>
        </header>

        
    </div>
    )
}

export default Header

import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next';
import SearchComp from "./components/SearchComp";
import BackgroundBlobs from "./components/BackgroundBlobsComp";
import ResultsComp from './components/ResultComp';
import Header from './components/Header';
import { fetchAndStoreQuiz, normalizeText, getJSONFromLocal } from "./utils/quizUtils";

function App() {
  const { t, i18n } = useTranslation();
  const [searchResult, setSearchResult] = useState(null);
  const [regenLoader, setRegenLoader] = useState(false);

  const handleResults = (result) => setSearchResult(result);
  const handleBack = () => setSearchResult(null);
  


  const toggleLanguage = useCallback(() => {
    const newLang = i18n.language === 'en' ? 'he' : 'en';
    i18n.changeLanguage(newLang);

    if (searchResult) {
      const baseKey = `${normalizeText(searchResult.topic)}-${normalizeText(searchResult.subtopic)}`;
      const newKey = `${baseKey}-${newLang}`;
      const quizData = getJSONFromLocal("quizData");
      if (quizData?.[newKey]) setSearchResult(quizData[newKey]);
    }
  }, [i18n, searchResult]);


  const handleRegenerate = useCallback((topic, subtopic, level) => {
    setRegenLoader(true);

    const lang = i18n.language;

    const fetchData = async () => {
      try {
        const updatedQuiz = await fetchAndStoreQuiz({
          topic,
          subtopic,
          lang,
          levels: [level]
        });
        setSearchResult(updatedQuiz);
      } catch (err) {
        alert(t('error_fetch_quiz'));
      } finally {
        setRegenLoader(false);
      }
    }
    fetchData();
    
  }, [i18n.language]);
  
  return (
    <div className="main-container" dir={i18n.language === 'he' ? 'rtl' : 'ltr'}>
      <BackgroundBlobs />
      <Header
        onBack={handleBack}
        showBack={!!searchResult}
        onToggleLang={toggleLanguage}
        currentLang={i18n.language}
      />
      <div className="relative z-10">
        {
          searchResult ? (
            <ResultsComp 
              data={searchResult}
              onRegenerate={handleRegenerate}
              regenLoader={regenLoader}
            />
          ) : (
            <SearchComp handleSearch={handleResults} />
          )
        }
      </div>
    </div>
  );
}

export default App;

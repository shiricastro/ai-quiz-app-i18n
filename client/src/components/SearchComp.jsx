import { useState } from "react"
import { useTranslation } from 'react-i18next';
import { fetchAndStoreQuiz, normalizeText } from "../utils/quizUtils";
import { getJSONFromLocal } from "../utils/quizUtils";
import LoaderIcon from "./icons/LoaderIcon"
import ErrorIcon from "./icons/ErrorIcon"

 function SearchComp({handleSearch}) {
    const { t,i18n } = useTranslation();
    const [searchData,setSearchData] =  useState({topic:'',subtopic:''});
    const [errors, setErrors] = useState({});
    const [loader,setLoader] = useState(false);
    
    const validateForm = () => {
        const fields = [
            { key: "topic", message: t("error_topic") },
            { key: "subtopic", message: t("error_subtopic") },
        ];
        const newErrors = fields.reduce((acc, field) => {
            if (!searchData[field.key]?.trim()) {
            acc[field.key] = field.message;
            }
            return acc;
        }, {});
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);

        if (!validateForm()) {
            setLoader(false);
            return;
        }

        const currentLang = i18n.language;
        const { topic, subtopic } = searchData;
        const baseKey = `${normalizeText(topic)}-${normalizeText(subtopic)}-${currentLang}`;
        const saved = getJSONFromLocal("quizData");

        if (saved[baseKey]) {
            handleSearch(saved[baseKey]);
            setLoader(false);
            return;
        }

        try {
            const quiz = await fetchAndStoreQuiz({
                topic,
                subtopic,
                lang: currentLang,
                levels: ['beginner', 'intermediate', 'expert'],
            });
            if (!quiz || !quiz.questions) {
                throw new Error("Invalid quiz data");
            }
            handleSearch(quiz);
        } catch (err) {
            alert(t("error_fetch_quiz"));
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="search-container">
            <h1 className="title mb-6">
                {t('main_title')}
            </h1>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {
                        ['topic', 'subtopic'].map((field) => (
                            <div className="form-group" key={field}>
                                <label htmlFor={field} className="block">
                                    {t(field)}
                                </label>
                                <input
                                    aria-label={t(field)}
                                    id={field}
                                    name={field}
                                    type="text"
                                    disabled={loader}
                                    value={searchData[field]}
                                    autoComplete={field}
                                    className={`input-field ${errors[field] ? "input-error" : ""}`}
                                    onChange={(e) => {
                                        setSearchData({ ...searchData, [field]: e.target.value });
                                        if (errors[field]) setErrors({ ...errors, [field]: "" });
                                    }}
                                />
                                {errors[field] && (
                                    <div className="error-msg">
                                        <ErrorIcon/>
                                        {errors[field]}
                                    </div>
                                )}
                            </div>
                        ))
                    }

                    <div>
                        <button
                            type="submit"
                            disabled={loader}
                            className="btn-primary gap-2"
                        >
                        {
                            loader ? ( <LoaderIcon/> ) : t("get_result_btn")
                        }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SearchComp
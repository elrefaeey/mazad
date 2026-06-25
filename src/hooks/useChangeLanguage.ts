import { useCallback } from "react";

function useLanguage() {
  const changeLanguage = useCallback((lang: string) => {
    // Language change logic here
    localStorage.setItem("language", lang);
    document.documentElement.setAttribute("lang", lang);
  }, []);

  const getCurrentLanguage = useCallback(() => {
    return localStorage.getItem("language") || "en";
  }, []);

  return { changeLanguage, getCurrentLanguage };
}

export default useLanguage;

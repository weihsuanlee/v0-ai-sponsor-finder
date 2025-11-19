import { useCallback, useState } from "react"
import type { Language } from "@/lib/i18n"

const LANGUAGE_STORAGE_KEY = "selectedLanguage"

const isLanguage = (value: string | null): value is Language => value === "en" || value === "fr" || value === "de"

const resolveStoredLanguage = (fallback: Language): Language => {
  if (typeof window === "undefined") {
    return fallback
  }

  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  return isLanguage(stored) ? stored : fallback
}

export const getStoredLanguage = (fallback: Language = "en"): Language => resolveStoredLanguage(fallback)

export const setStoredLanguage = (language: Language): void => {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
}

export const useStoredLanguage = (initialLanguage: Language = "en") => {
  const [language, setLanguageState] = useState<Language>(() => resolveStoredLanguage(initialLanguage))

  const updateLanguage = useCallback((newLanguage: Language) => {
    setLanguageState(newLanguage)
    setStoredLanguage(newLanguage)
  }, [])

  return [language, updateLanguage] as const
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Lang } from '@/types'
import i18n from '@/i18n'

interface LanguageState {
  lang: Lang
  setLang: (lang: Lang) => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      lang: 'en',
      setLang: (lang) => {
        i18n.changeLanguage(lang)
        set({ lang })
      },
    }),
    { name: 'lang-storage' }
  )
)

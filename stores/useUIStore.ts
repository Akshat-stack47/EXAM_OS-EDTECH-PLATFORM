import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Language = 'en' | 'hi'

interface UIState {
  isSidebarOpen: boolean
  toggleSidebar: () => void
  activeModal: string | null
  setActiveModal: (modal: string | null) => void
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  language: Language
  setLanguage: (lang: Language) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      activeModal: null,
      setActiveModal: (modal) => set({ activeModal: modal }),
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      language: 'en',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'examos-ui-store',
      partialize: (state) => ({ theme: state.theme, language: state.language }),
    },
  ),
)

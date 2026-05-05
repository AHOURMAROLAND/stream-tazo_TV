import { create } from 'zustand'

const useAppStore = create((set) => ({
  timezone:    0,
  lang:        'en',
  activeMatch: null,

  setTimezone:    (tz)    => set({ timezone: tz }),
  setLang:        (lang)  => set({ lang }),
  setActiveMatch: (match) => set({ activeMatch: match }),
}))

export default useAppStore

import i18n from 'i18next'

const resources = {
  en: {
    translation: {
      'nav.dashboard': 'Dashboard',
      'nav.exams': 'Exams',
      'nav.health': 'Health',
      'nav.whiteboard': 'Whiteboard',
      'nav.logout': 'Logout',
      'welcome.back': 'Welcome back',
      'study.streak': 'Day Streak',
      'rank.national': "Nat'l Rank",
      'study.total': 'Total Study',
      'study.today': 'Today',
      'subject.performance': 'Subject Performance',
      'ai.assistant': 'AI Study Assistant',
      'exam.search': 'Ask anything about your exam...',
      'log.session': 'Log 25min Study',
      'health.check': 'Weekly Health Check',
      'search.placeholder': 'Search exams, students, whiteboards...',
      'search.no_results': 'No results found',
      'search.loading': 'Searching...',
      'search.clear': 'Clear search',
      'search.suggestions': 'Suggestions',
    },
  },
  hi: {
    translation: {
      'nav.dashboard': 'डैशबोर्ड',
      'nav.exams': 'परीक्षाएं',
      'nav.health': 'स्वास्थ्य',
      'nav.whiteboard': 'व्हाइटबोर्ड',
      'nav.logout': 'लॉगआउट',
      'welcome.back': 'वापसी पर स्वागत है',
      'study.streak': 'दिनों की लगातारता',
      'rank.national': 'राष्ट्रीय रैंक',
      'study.total': 'कुल अध्ययन',
      'study.today': 'आज',
      'subject.performance': 'विषय प्रदर्शन',
      'ai.assistant': 'AI अध्ययन सहायक',
      'exam.search': 'अपनी परीक्षा के बारे में कुछ भी पूछें...',
      'log.session': '25 मिनट अध्ययन लॉग करें',
      'health.check': 'साप्ताहिक स्वास्थ्य जांच',
      'search.placeholder': 'परीक्षा, छात्र, व्हाइटबोर्ड खोजें...',
      'search.no_results': 'कोई परिणाम नहीं मिला',
      'search.loading': 'खोज रहा है...',
      'search.clear': 'खोज साफ़ करें',
      'search.suggestions': 'सुझाव',
    },
  },
}

i18n.init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n

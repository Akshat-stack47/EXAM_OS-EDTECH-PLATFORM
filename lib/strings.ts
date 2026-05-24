type Language = 'en' | 'hi'

interface StringMap {
  [key: string]: { en: string; hi: string }
}

export const STRINGS: StringMap = {
  loginTitle:          { en: 'Welcome back',              hi: 'वापस स्वागत है' },
  loginSubtitle:       { en: 'Sign in to your account',  hi: 'अपने खाते में साइन इन करें' },
  loginButton:         { en: 'Sign In',                  hi: 'साइन इन करें' },
  logoutButton:        { en: 'Sign Out',                  hi: 'साइन आउट करें' },

  goodMorning:         { en: 'Good morning',              hi: 'शुभ प्रभात' },
  goodAfternoon:       { en: 'Good afternoon',            hi: 'शुभ दोपहर' },
  goodEvening:         { en: 'Good evening',              hi: 'शुभ संध्या' },
  studyStreak:         { en: 'Day streak',                hi: 'दिन की स्ट्रीक' },
  totalStudyTime:      { en: 'Total study time',          hi: 'कुल अध्ययन समय' },
  mockTestsCompleted:  { en: 'Mock tests completed',      hi: 'मॉक टेस्ट पूरे किए' },
  nationalRank:        { en: 'National rank',             hi: 'राष्ट्रीय रैंक' },

  askMentor:           { en: 'Ask AI Mentor',             hi: 'AI मेंटर से पूछें' },
  aiUnavailable:       { en: 'AI mentor is temporarily unavailable. Please try again shortly.', hi: 'AI मेंटर अस्थायी रूप से उपलब्ध नहीं है। कृपया थोड़ी देर बाद पुनः प्रयास करें।' },
  aiThinking:          { en: 'Thinking...',               hi: 'सोच रहा हूँ...' },

  burnoutWarning:      { en: 'Take a break — you deserve it', hi: 'एक ब्रेक लें — आप इसके हकदार हैं' },
  burnoutCritical:     { en: 'High burnout risk detected. Please speak to a counselor.', hi: 'उच्च बर्नआउट जोखिम पाया गया। कृपया एक काउंसलर से बात करें।' },
  crisisSupport:       { en: 'We are here for you. Talk to a counselor now.', hi: 'हम आपके लिए यहाँ हैं। अभी एक काउंसलर से बात करें।' },
  weeklyCheckIn:       { en: 'Weekly check-in',           hi: 'साप्ताहिक चेक-इन' },

  startTest:           { en: 'Start Test',                hi: 'टेस्ट शुरू करें' },
  submitTest:          { en: 'Submit Test',               hi: 'टेस्ट जमा करें' },
  yourScore:           { en: 'Your Score',                hi: 'आपका स्कोर' },
  correctAnswers:      { en: 'Correct answers',           hi: 'सही उत्तर' },
  timeRemaining:       { en: 'Time remaining',            hi: 'शेष समय' },

  somethingWentWrong:  { en: 'Something went wrong. Please try again.', hi: 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।' },
  notFound:            { en: 'Not found',                 hi: 'नहीं मिला' },
  unauthorized:        { en: 'Please sign in to continue', hi: 'जारी रखने के लिए साइन इन करें' },
  noData:              { en: 'Nothing here yet',          hi: 'अभी यहाँ कुछ नहीं है' },

  save:                { en: 'Save',                      hi: 'सहेजें' },
  cancel:              { en: 'Cancel',                    hi: 'रद्द करें' },
  delete:              { en: 'Delete',                    hi: 'हटाएं' },
  edit:                { en: 'Edit',                      hi: 'संपादित करें' },
  view:                { en: 'View',                      hi: 'देखें' },
  search:              { en: 'Search',                    hi: 'खोजें' },
  loading:             { en: 'Loading...',                hi: 'लोड हो रहा है...' },
  tryAgain:            { en: 'Try again',                 hi: 'पुनः प्रयास करें' },
} as const

export type StringKey = keyof typeof STRINGS

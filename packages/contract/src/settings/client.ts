export type Display = {
  previousLines: number,
  nextLines: number,
  larivaarGurbani: boolean,
  larivaarAssist: boolean,
  syllabicWeights: boolean,
  syllableCount: boolean,
  englishTranslation: boolean,
  spanishTranslation: boolean,
  punjabiTranslation: boolean,
  englishTransliteration: boolean,
  hindiTransliteration: boolean,
  urduTransliteration: boolean,
  lineEnding: boolean,
}

export type Layout = {
  controllerZoom: number,
  presenterFontSize: number,
  relativeGurmukhiFontSize: number,
  relativeEnglishFontSize: number,
  relativePunjabiFontSize: number,
  relativeHindiFontSize: number,
  relativeUrduFontSize: number,
  centerText: boolean,
  justifyText: boolean,
  inlineTransliteration: boolean,
  inlineColumnGuides: boolean,
  splitOnVishraam: boolean,
  spacing: 'space-around' | 'space-between' | 'space-evenly' | 'flex-start' | 'flex-end' | 'center',
}

export type Vishraams = {
  vishraamHeavy: boolean,
  vishraamMedium: boolean,
  vishraamLight: boolean,
  vishraamColors: boolean,
  vishraamCharacters: boolean,
}

export type ClientSettings = {
  display: Display,
  layout: Layout,
  theme: {
    themeName: 'Day',
    simpleGraphics: boolean,
    backgroundImage: boolean,
    highlightCurrentLine: boolean,
    dimNextAndPrevLines: boolean,
  },
  vishraams: Vishraams,
  // TODO: add
  sources: {},
  hotkeys: {},
  security: {
    displayAnalytics: boolean,
    private: boolean,
  },
  search: {
    resultTranslationLanguage: 'None' | 'English' | 'Spanish' | 'Punjabi',
    resultTransliterationLanguage: 'None' | 'Hindi' | 'Urdu' | 'English',
    showResultCitations: boolean,
    lineEnding: boolean,
  },
}

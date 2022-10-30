export type Line = {
  id: string,
  shabadId: string,
  sourcePage: number,
  sourceLine: number,
  firstLetters: string,
  vishraamFirstLetters: string,
  gurmukhi: string,
  pronunciation: string,
  pronunctiationInformation: string,
  typeId: number,
  orderId: number,
}

export type Shabad = {
  id: string,
  sourceId: number,
  writerId: number,
  sectionId: number,
  subsectionId: number,
  sttmId: number,
  orderId: number,
}

export type Translation = {
  lineId: string,
  translationSourceId: number,
  translation: string,
  english?: string,
  additionalInformation: {
    name: string,
    information: string,
    english: string,
  }[],
}

export type Source = {
  id: number,
  nameGurmukhi: string,
  nameEnglish: string,
  pageNameGurmukhi: string,
  pageNameEnglish: string,
  length: number,
  sourceId: number,
}

export type TranslationSource = {
  id: number,
  nameGurmukhi: string,
  nameEnglish: string,
  languageId: number,
  language: {
    id: number,
    nameGurmukhi: string,
    nameEnglish: string,
    nameInternational: string,
  },
}
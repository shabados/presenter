import type {
  Banis,
  Languages,
  Lines,
  Sections,
  Shabads,
  Sources,
  Subsections,
  Translations,
  TranslationSources,
  Transliterations,
  UnwrapModel,
  Writers,
} from '@shabados/database'
import type { SetNonNullable } from 'type-fest'

export type Line = SetNonNullable<Lines, 'translations' | 'transliterations'>
export type Shabad = SetNonNullable<Shabads, 'lines' | 'section'>
// export type Line = SetNonNullable<UnwrapModel<Lines>, 'translations' | 'transliterations'>
// export type Shabad = SetNonNullable<UnwrapModel<Shabads>, 'lines' | 'section'>
export type BaniList = Banis
// TODO Bani.lines[].shabad should be NonNullable
export type Bani = SetNonNullable<BaniList, 'lines'>
export type Source = SetNonNullable<Sources, 'translationSources'>
export type Language = UnwrapModel<Languages>
export type Section = UnwrapModel<Sections>
export type Subsection = UnwrapModel<Subsections>
export type TranslationSource = UnwrapModel<TranslationSources>
export type Translation = UnwrapModel<Translations>
export type Transliteration = UnwrapModel<Transliterations>
export type Writer = UnwrapModel<Writers>

export type RecommendedSources = {
  sources: { [id: number]: Source },
  recommendedSources: { [id: string]: TranslationSource },
}

export type Content = Shabad | Bani

export const isShabad = (
  content: Content | null
): content is Shabad => content !== null && 'sourceId' in content

export const isBani = (
  content: Content | null
): content is Bani => content !== null && !isShabad( content )

export type ViewedLines = { [lineId: string]: number }

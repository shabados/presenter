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
export type BaniList = Banis & { id: number }
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
  sources: Record<number, Source>,
  recommendedSources: Record<string, TranslationSource>,
}

export type Content = Shabad & { type: 'shabad' } | Bani & { type: 'bani' }

export type ViewedLines = Record<string, number>

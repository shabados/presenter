export type SearchQuery = {
  query: string,
  options?: {
    translations?: boolean,
    transliterations?: boolean,
    citations?: boolean,
  },
}

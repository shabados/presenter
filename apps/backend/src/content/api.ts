import { Router } from 'express'

import { getLanguages, getSources, getWriters } from '../services/database'

const createApi = () => {
  const api = Router()

  api.get( '/sources', ( _, res ) => void getSources().then( ( sources ) => res.json( sources ) ) )

  api.get( '/languages', ( _, res ) => void getLanguages().then( ( languages ) => res.json( languages ) ) )

  api.get( '/writers', ( _, res ) => void getWriters().then( ( writers ) => res.json( writers ) ) )

  return api
}

export default createApi

import { Router } from 'express'

import { getOverlayThemeNames, getPresenterThemeNames } from './themes'

const createApi = () => {
  const api = Router()

  api.get( '/presenter/themes', ( _, res ) => void getPresenterThemeNames().then( res.json ) )
  api.get( '/overlay/themes', ( _, res ) => void getOverlayThemeNames().then( res.json ) )

  return api
}

export default createApi

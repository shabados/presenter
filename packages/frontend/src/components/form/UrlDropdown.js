import React, { useState, useEffect } from 'react'
import { string } from 'prop-types'

import Dropdown from './Dropdown'

const UrlDropdown = ( { url, ...props } ) => {
  const [ values, setValues ] = useState( [] )

  useEffect( () => {
    fetch( url )
      .then( res => res.json() )
      .then( values => values.map( value => ( { name: value, value } ) ) )
      .then( setValues )
  }, [ url ] )

  return <Dropdown {...props} values={values} />
}

UrlDropdown.propTypes = {
  url: string.isRequired,
}

export default UrlDropdown

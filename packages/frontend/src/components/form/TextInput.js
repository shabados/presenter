import React, { useState, useEffect } from 'react'
import { string, func } from 'prop-types'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

const TextInput = ( { className, value, onChange, ...props } ) => {
  const [ isChanged, setChanged ] = useState()
  const [ isSaved, setSaved ] = useState()

  const onFocus = event => { event.target.select() }

  useEffect( () => {
    const timer = setTimeout( () => { setSaved( false ) }, 3000 )
    return () => clearTimeout( timer )
  }, [ isSaved ] )

  const onBlur = ( ...params ) => {
    onChange( ...params )
    if ( isChanged ) setTimeout( () => { setSaved( isChanged ) }, 500 )
    setChanged( false )
  }

  return (
    <div key={value} className={classNames( className, 'text-input' )}>
      <input
        className="text-field"
        {...props}
        onBlur={onBlur}
        onChange={() => setChanged( true )}
        onFocus={onFocus}
        defaultValue={value}
      />
      <FontAwesomeIcon
        className={classNames( 'status-icon', { saved: isSaved } )}
        icon={faCheck}
      />
    </div>
  )
}

TextInput.propTypes = {
  className: string,
  onChange: func,
  value: string.isRequired,
}

TextInput.defaultProps = {
  className: null,
  onChange: () => {},
}

export default TextInput

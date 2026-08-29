import React, { useRef, useState, useEffect, useCallback, useContext } from 'react'
import classNames from 'classnames'
import { func, string, oneOfType, number } from 'prop-types'
import { useLocation, useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { stringify } from 'qs'

import { getUrlState } from '../../../lib/utils'
import { SettingsContext } from '../../../lib/contexts'
import controller from '../../../lib/controller'
import { withNavigationHotkeys } from '../../../hotkeys/NavigationHotkeys'
import {
  SEARCH_TYPES,
  SEARCH_CHARS,
  SEARCH_ANCHORS,
  MIN_SEARCH_CHARS,
} from '../../../lib/consts'

import Result from './Result'
import getHighlighter from './match-highlighter'
import './index.css'

const searchRegex = new RegExp( `^([${Object.keys( SEARCH_ANCHORS ).map( anchor => `\\${anchor}` ).join( '' )}])?(.*)` )

const getSearchParams = searchQuery => {
  const [ , anchor, query ] = searchQuery.match( searchRegex )

  const inputValue = query

  const type = SEARCH_ANCHORS[ anchor ] || SEARCH_TYPES.firstLetter

  const value = type === SEARCH_TYPES.firstLetter
    ? inputValue.slice().replace( new RegExp( SEARCH_CHARS.wildcard, 'g' ), '_' )
    : inputValue

  return { anchor, value, type }
}

const Search = ( { updateFocus, register, focused } ) => {
  const { local: {
    search: {
      showResultCitations,
      resultTransliterationLanguage,
      resultTranslationLanguage,
    },
  } = {} } = useContext( SettingsContext )

  const history = useHistory()
  const { search } = useLocation()
  const { query = '' } = getUrlState( search )

  const [ searchedValue, setSearchedValue ] = useState( '' )

  const { anchor: initialAnchor, value: initialInputValue } = getSearchParams( query )
  const inputValue = useRef( initialInputValue )
  const [ anchor, setAnchor ] = useState( initialAnchor )

  const [ results, setResults ] = useState( [] )

  const [ isInputFocused, setInputFocused ] = useState( false )

  const inputRef = useRef( null )

  const onResults = useCallback( results => {
    setSearchedValue( inputValue.current )
    setResults( results )

    updateFocus( 0 )
  }, [ updateFocus ] )

  const onChange = useCallback( ( { target: { value } } ) => {
    const { anchor, type: searchType, value: searchValue } = getSearchParams( value )

    const doSearch = searchValue.length >= MIN_SEARCH_CHARS

    if ( doSearch ) {
      controller.search( searchValue, searchType, {
        translations: !!resultTranslationLanguage,
        transliterations: !!resultTransliterationLanguage,
        citations: !!showResultCitations,
      } )
    } else setResults( [] )

    inputValue.current = searchValue
    setAnchor( anchor )

    history.push( { search: `?${stringify( {
      ...getUrlState( search ),
      query: value,
    } )}` } )
  }, [
    history,
    search,
    resultTranslationLanguage,
    resultTransliterationLanguage,
    showResultCitations,
  ] )

  const filterInputKeys = event => {
    const ignoreKeys = [ 'ArrowUp', 'ArrowDown' ]

    if ( ignoreKeys.includes( event.key ) ) event.preventDefault()
  }

  const refocus = ( { target } ) => {
    setInputFocused( false )
    target.focus()
  }

  const highlightSearch = () => inputRef.current.select()

  useEffect( () => {
    controller.on( 'results', onResults )
    return () => controller.off( 'results', onResults )
  }, [ onResults ] )

  useEffect( () => {
    if ( inputValue.current ) onChange( { target: { value: `${anchor || ''}${inputValue.current}` } } )
  }, [
    onChange,
    anchor,
    resultTransliterationLanguage,
    resultTranslationLanguage,
    showResultCitations,
  ] )

  useEffect( () => { highlightSearch() }, [] )

  const searchMode = SEARCH_ANCHORS[ anchor ] || SEARCH_TYPES.firstLetter
  const highlighter = getHighlighter( searchedValue, searchMode )

  return (
    <div className="search">
      <div className={classNames( 'input', { 'input-focused': isInputFocused } )}>
        <input
          ref={inputRef}
          className="input-field"
          onBlur={refocus}
          onKeyDown={filterInputKeys}
          onFocus={() => setInputFocused( true )}
          onChange={onChange}
          value={`${anchor || ''}${inputValue.current}`}
          placeholder="Koj"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
        />
        {inputValue.current && (
          <button
            type="button"
            className="clear"
            onClick={() => onChange( { target: { value: '' } } )}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </div>

      <ul className="results">
        {results && results.map( ( result, index ) => (
          <Result
            {...result}
            key={result.id}
            ref={ref => register( index, ref )}
            focused={focused === index}
            highlighter={highlighter}
          />
        ) )}
      </ul>
    </div>
  )
}

Search.propTypes = {
  focused: oneOfType( [ string, number ] ),
  register: func.isRequired,
  updateFocus: func.isRequired,
}

Search.defaultProps = {
  focused: undefined,
}

export default withNavigationHotkeys( {
  keymap: {
    next: [ 'down', 'tab' ],
    previous: [ 'up', 'shift+tab' ],
    first: null,
    last: null,
  },
} )( Search )

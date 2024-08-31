import React, { useRef, useState, useEffect, useCallback, useContext } from 'react'
import classNames from 'classnames'
import { func, string, oneOfType, number } from 'prop-types'
import { useLocation, useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { stringify } from 'qs'
import { Input, InputAdornment, IconButton, List } from '@material-ui/core'

import { getUrlState } from '../../lib/utils'
import { SettingsContext } from '../../lib/contexts'
import controller from '../../lib/controller'
import { withNavigationHotkeys } from '../../shared/NavigationHotkeys'
import {
  SEARCH_TYPES,
  SEARCH_CHARS,
  SEARCH_ANCHORS,
  MIN_SEARCH_CHARS,
} from '../../lib/consts'

import Result from './Result'
import getHighlighter from './match-highlighter'
import './index.css'

// Generate the regex for capturing anchor chars, optionally
const searchRegex = new RegExp( `^([${Object.keys( SEARCH_ANCHORS ).map( anchor => `\\${anchor}` ).join( '' )}])?(.*)` )

const getSearchParams = searchQuery => {
  // Extract anchors and search query
  const [ , anchor, query ] = searchQuery.match( searchRegex )

  const inputValue = query

  // Get search type from anchor char, if any
  const type = SEARCH_ANCHORS[ anchor ] || SEARCH_TYPES.firstLetter

  const value = type === SEARCH_TYPES.firstLetter
    ? inputValue.slice().replace( new RegExp( SEARCH_CHARS.wildcard, 'g' ), '_' )
    : inputValue

  return { anchor, value, type }
}

/**
 * Search Component.
 * Converts ASCII to unicode on input.
 * Displays results.
 */
const Search = ( { updateFocus, register, focused } ) => {
  const { local: {
    search: {
      showResultCitations,
      resultTransliterationLanguage,
      resultTranslationLanguage,
    },
  } = {} } = useContext( SettingsContext )

  // Set the initial search query from URL
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

  /**
   * Set the received results and update the searched vale.
   * @param {Object[]} results An array of the returned results.
   */
  const onResults = useCallback( results => {
    setSearchedValue( inputValue.current )
    setResults( results )

    updateFocus( 0 )
  }, [ updateFocus ] )
  /**
   * Run on change of value in the search box.
   * Converts ascii to unicode if need be.
   * Sends the search through to the controller.
   * @param {string} value The new value of the search box.
   */
  const onChange = useCallback( ( { target: { value } } ) => {
    const { anchor, type: searchType, value: searchValue } = getSearchParams( value )

    // Search if enough letters
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

    // Update URL with search
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

  // Get match highlighter for the current search mode
  const searchMode = SEARCH_ANCHORS[ anchor ] || SEARCH_TYPES.firstLetter
  const highlighter = getHighlighter( searchedValue, searchMode )

  return (
    <div className="search">
      <Input
        className={classNames( 'input', { 'input-focused': isInputFocused } )}
        inputRef={inputRef}
        onBlur={refocus}
        onKeyDown={filterInputKeys}
        onFocus={() => setInputFocused( true )}
        onChange={onChange}
        value={`${anchor || ''}${inputValue.current}`}
        placeholder="Koj"
        disableUnderline
        autoFocus
        endAdornment={inputValue.current && (
        <InputAdornment>
          <IconButton className="clear" onClick={() => onChange( { target: { value: '' } } )}>
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
        </InputAdornment>
        )}
        inputProps={{
          spellCheck: false,
          autoCapitalize: 'off',
          autoCorrect: 'off',
          autoComplete: 'off',
        }}
      />

      <List className="results">
        {results && results.map( ( result, index ) => (
          <Result
            {...result}
            key={result.id}
            ref={ref => register( index, ref )}
            focused={focused === index}
            highlighter={highlighter}
          />
        ) )}
      </List>
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

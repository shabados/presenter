import React, { Component } from 'react'
import { func, string, oneOfType, number } from 'prop-types'
import { history, location } from 'react-router-prop-types'
import classNames from 'classnames'

import Input from '@material-ui/core/Input'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'

import { stringify } from 'querystring'
import { firstLetters, toAscii } from 'gurmukhi-utils'

import { MIN_SEARCH_CHARS, SEARCH_CHARS, SEARCH_TYPES, SEARCH_ANCHORS } from '../lib/consts'
import { stripPauses, getUrlState } from '../lib/utils'
import controller from '../lib/controller'

import withNavigationHotKeys from '../shared/withNavigationHotKeys'

import './Search.css'

/**
 * Search Component.
 * Converts ASCII to unicode on input.
 * Displays results.
 */
class Search extends Component {
  constructor( props ) {
    super( props )

    this.state = {
      searchedValue: '',
      inputValue: '',
      anchor: null,
      results: [],
    }

    this.times = []
    this.timeStart = null
    this.timeEnd = null

    // Generate the regex for capturing anchor chars, optionally
    this.searchRegex = new RegExp( `^([${Object.keys( SEARCH_ANCHORS ).map( anchor => `\\${anchor}` ).join( '' )}])?(.*)` )
  }

  componentDidMount() {
    controller.on( 'results', this.onResults )

    // Set the initial search query from URL
    const { location: { search } } = this.props
    const { query = '' } = getUrlState( search )

    this.onChange( { target: { value: query } } )
  }

  componentWillUnmount() {
    controller.off( 'results', this.onResults )
  }

  /**
   * Set the received results and update the searched vale.
   * @param {Object[]} results An array of the returned results.
   */
  onResults = results => {
    const { updateFocus } = this.props

    this.setState( ( { inputValue: searchedValue } ) => ( {
      results,
      searchedValue,
    } ) )

    updateFocus( 0 )
  }

  /**
   * Run on change of value in the search box.
   * Converts ascii to unicode if need be.
   * Sends the search through to the controller.
   * @param {string} value The new value of the search box.
   */
  onChange = ( { target: { value } } ) => {
    const { location: { search }, history } = this.props

    // Extract anchors and search query
    const [ , anchor, query ] = value.match( this.searchRegex )

    const inputValue = toAscii( query )

    // Get search type from anchor char, if any
    const searchType = SEARCH_ANCHORS[ anchor ] || SEARCH_TYPES.firstLetter

    // Search if enough letters
    const doSearch = inputValue.length >= MIN_SEARCH_CHARS

    const searchValue = searchType === SEARCH_TYPES.firstLetter
      ? inputValue.slice().replace( new RegExp( SEARCH_CHARS.wildcard, 'g' ), '_' )
      : inputValue

    if ( doSearch ) controller.search( searchValue, searchType )

    this.setState( { inputValue, anchor, ...( !doSearch && { results: [] } ) } )

    // Update URL with search
    history.push( { search: `?${stringify( {
      ...getUrlState( search ),
      query: value,
    } )}` } )
  }

  /**
   * Renders a single result, highlighting the match.
   * @param {string} gurmukhi The shabad line to display.
   * @param {string} lineId The id of the line.
   * @param {string} shabadId The id of the shabad.
   * @param {Component} ref The ref to the component.
   */
  Result = ( { gurmukhi, id: lineId, shabadId, ref, focused } ) => {
    const { searchedValue, anchor } = this.state

    // Get first letters in line and find where the match is
    const query = !anchor ? firstLetters( gurmukhi ) : gurmukhi

    // Split on each word if using first letter because letters correspond to whole words
    const splitChar = !anchor ? ' ' : ''

    // Remember to account for wildcard characters
    const pos = query.search( searchedValue.slice().replace( new RegExp( SEARCH_CHARS.wildcard, 'g' ), '.' ) )

    const words = stripPauses( gurmukhi ).split( splitChar )

    // Separate the line into words before the match, the match, and after the match
    const beforeMatch = words.slice( 0, pos ).join( splitChar ) + splitChar
    const match = words.slice( pos, pos + searchedValue.length ).join( splitChar ) + splitChar
    const afterMatch = words.slice( pos + searchedValue.length ).join( splitChar ) + splitChar

    // Send the shabad id and line id to the server on click
    const onClick = () => controller.shabad( { shabadId, lineId } )

    return (
      <ListItem className={classNames( { focused } )} key={lineId} onClick={onClick} ref={ref}>
        <span className="gurmukhi text result">
          {beforeMatch ? <span className="words">{beforeMatch}</span> : null}
          {match ? <span className="matched words">{match}</span> : null}
          {afterMatch ? <span className="words">{afterMatch}</span> : null}
        </span>
      </ListItem>
    )
  }

  filterInputKeys = event => {
    const ignoreKeys = [ 'ArrowUp', 'ArrowDown' ]

    if ( ignoreKeys.includes( event.key ) ) event.preventDefault()
  }

  render() {
    const { register, focused } = this.props
    const { inputValue, results, anchor } = this.state

    return (
      <div className="search">
        <Input
          className="input"
          onKeyDown={this.filterInputKeys}
          onChange={this.onChange}
          value={`${anchor || ''}${inputValue}`}
          placeholder="Koj"
          disableUnderline
          autoFocus
          spellCheck={false}
        />
        <List className="results">
          {results
            ? results
              .map( ( props, i ) => this.Result( {
                ...props,
                ref: c => register( i, c ),
                focused: focused === i,
              } ) )
            : ''}
        </List>
      </div>
    )
  }
}

Search.propTypes = {
  focused: oneOfType( [ string, number ] ),
  register: func.isRequired,
  updateFocus: func.isRequired,
  history: history.isRequired,
  location: location.isRequired,
}

Search.defaultProps = {
  focused: undefined,
}

export default withNavigationHotKeys( {
  keymap: {
    next: [ 'down', 'tab' ],
    previous: [ 'up', 'shift+tab' ],
    first: null,
    last: null,
  },
} )( Search )

import React, { Component } from 'react'
import { func, string, oneOfType, number } from 'prop-types'
import { history, location } from 'react-router-prop-types'

import Input from '@material-ui/core/Input'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'

import { stringify } from 'querystring'
import { firstLetters, toAscii } from 'gurmukhi-utils'

import { MAX_RESULTS, MIN_SEARCH_CHARS, SEARCH_CHARS } from '../lib/consts'
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
      results: [],
    }

    this.times = []
    this.timeStart = null
    this.timeEnd = null
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
  onResults = results => this.setState( ( { inputValue: searchedValue } ) => ( {
    results,
    searchedValue,
  } ) )

  /**
   * Run on change of value in the search box.
   * Converts ascii to unicode if need be.
   * Sends the search through to the controller.
   * @param {string} value The new value of the search box.
   */
  onChange = ( { target: { value } } ) => {
    const { location: { search }, history } = this.props
    const inputValue = toAscii( value.trim() )

    // Search if enough letters
    if ( inputValue.length >= MIN_SEARCH_CHARS ) {
      this.setState( { inputValue } )
      controller.search( inputValue )
    } else {
      this.setState( { inputValue, results: [] } )
    }

    // Update URL with search
    history.push( { search: `?${stringify( {
      ...getUrlState( search ),
      query: inputValue,
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
    const { searchedValue } = this.state

    // Get first letters in line and find where the match is
    const firstLettersLine = firstLetters( gurmukhi )
    // Remember to account for wildcard characters
    const pos = firstLettersLine.search( searchedValue.replace( new RegExp( SEARCH_CHARS.wildcard, 'g' ), '.' ) )

    const words = stripPauses( gurmukhi ).split( ' ' )

    // Separate the line into words before the match, the match, and after the match
    const beforeMatch = words.slice( 0, pos ).join( ' ' )
    const match = words.slice( pos, pos + searchedValue.length ).join( ' ' )
    const afterMatch = words.slice( pos + searchedValue.length ).join( ' ' )

    // Send the shabad id and line id to the server on click
    const onClick = () => controller.shabad( { shabadId, lineId } )

    const className = focused ? 'focused' : ''

    return (
      <ListItem className={className} key={lineId} onClick={onClick} ref={ref}>
        <span className="gurmukhi text result">
          {beforeMatch ? <span className="words">{beforeMatch}</span> : null}
          {match ? <span className="matched words">{match}</span> : null}
          {afterMatch ? <span className="words">{afterMatch}</span> : null}
        </span>
      </ListItem>
    )
  }

  render() {
    const { register, focused } = this.props
    const { inputValue, results } = this.state

    return (
      <div className="search">
        <Input
          className="input"
          onChange={this.onChange}
          value={inputValue}
          placeholder="Koj"
          disableUnderline
          autoFocus
          spellCheck={false}
          inputRef={c => register( 'search', c )}
        />
        <List className="results">
          {results ?
            results
              .slice( 0, MAX_RESULTS )
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
  },
} )( Search )

import React, { Component } from 'react'
import { number, func } from 'prop-types'

import { Input, List, ListItem } from '@material-ui/core'
import { toUnicode, firstLetters, toAscii } from 'gurmukhi-utils'

import { MAX_RESULTS, MIN_SEARCH_CHARS, SEARCH_CHARS } from '../lib/consts'
import { stripPauses } from '../lib/utils'
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
  }

  componentDidUpdate( prevProps, { results: prevResults } ) {
    const { results } = this.state

    // Timing
    if ( results.length && results !== prevResults ) {
      this.timeEnd = window.performance.now()
      const duration = this.timeEnd - this.timeStart
      this.times.push( duration )

      const average = this.times.reduce( ( sum, time ) => sum + time, 0 ) / this.times.length

      console.log( `Searched in ${duration}ms, average: ${average}ms` )
    }
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
    const inputValue = toUnicode( value.trim() )

    // Search if enough letters
    if ( inputValue.length >= MIN_SEARCH_CHARS ) {
      this.timeStart = window.performance.now()
      this.setState( { inputValue } )
      controller.search( inputValue )
    } else {
      this.setState( { inputValue, results: [] } )
    }
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
    const pos = firstLettersLine.search( toAscii( searchedValue ).replace( new RegExp( SEARCH_CHARS.wildcard, 'g' ), '.' ) )

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
          placeholder="ਖੋਜ"
          disableUnderline
          autoFocus
          inputRef={c => register( 'search', c, true )}
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
  focused: number.isRequired,
  register: func.isRequired,
}

export default withNavigationHotKeys( {} )( Search )

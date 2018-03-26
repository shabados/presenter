import React, { Component } from 'react'

import { Input, List, ListItem } from 'material-ui'
import { toUnicode } from '@shabados/gurmukhi-utils'

import { MAX_RESULTS, MIN_SEARCH_CHARS, WILDCARD_CHAR } from '../../lib/consts'
import { getFirstLetters, stripPauses } from '../../lib/utils'
import controller from '../../lib/controller'

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
      search: '',
      results: [],
    }

    this.times = []
    this.timeStart = null
    this.timeEnd = null
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

  componentDidMount() {
    controller.on( 'results', this.onResults )
  }

  componentWillUnmount() {
    controller.off( 'results', this.onResults )
  }

  onResults = results => this.setState( { results } )

  /**
   * Run on change of value in the search box.
   * Converts ascii to unicode if need be.
   * Sends the search through to the controller.
   * @param value The new value of the search box.
   */
  onChange = ( { target: { value } } ) => {
    const state = {}
    const search = toUnicode( value.trim() )

    // Search if enough letters, otherwise clear results
    if ( search.length >= MIN_SEARCH_CHARS ) {
      this.timeStart = window.performance.now()
      controller.search( search )
    } else {
      state[ 'results' ] = []
    }

    this.setState( { ...state, search } )
  }

  /**
   * Renders a single result, highlighting the match.
   * @param gurmukhi The shabad line to display.
   * @param lineId The id of the line.
   * @param shabadId The id of the shabad.
   */
  renderResult = ( { gurmukhi, id: lineId, shabadId } ) => {
    const { search } = this.state

    // Get first letters in line and find where the match is
    const firstLetters = getFirstLetters( gurmukhi )
    // Remember to account for wildcard characters
    const pos = firstLetters.search( search.replace( new RegExp( WILDCARD_CHAR ), '.' ) )

    const words = stripPauses( gurmukhi ).split( ' ' )

    // Seperate the line into words before the match, the match, and after the match
    const beforeMatch = words.slice( 0, pos ).join( ' ' )
    const match = words.slice( pos, pos + search.length ).join( ' ' )
    const afterMatch = words.slice( pos + search.length ).join( ' ' )

    // Send the shabad id and line id to the server on click
    const onClick = () => {
      controller.shabad( shabadId )
      controller.line( lineId )
    }

    return (
      <ListItem className="result" key={lineId} onClick={onClick}>
        {beforeMatch ? <span className="words">{beforeMatch}</span> : null}
        {match ? <span className="matched words">{match}</span> : null}
        {afterMatch ? <span className="words">{afterMatch}</span> : null}
      </ListItem>
    )
  }

  render() {
    const { search, results } = this.state

    return (
      <div className="search">
        <Input
          className="input"
          onChange={this.onChange}
          value={search}
          placeholder="ਖੋਜ"
          disableUnderline
          autoFocus
        />
        <List className="results">
          {results ? results.slice( 0, MAX_RESULTS ).map( this.renderResult ) : ''}
        </List>
      </div>
    )
  }
}

export default Search

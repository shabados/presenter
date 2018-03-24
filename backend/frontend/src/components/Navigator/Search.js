import React, { Component } from 'react'

import { Input, List, ListItem } from 'material-ui'
import { toUnicode } from '@shabados/gurmukhi-utils'

import { MAX_RESULTS, MIN_SEARCH_CHARS } from '../../lib/consts'
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
    const search = toUnicode( value )

    // Search if enough letters, otherwise clear results
    if ( search.length > MIN_SEARCH_CHARS ) {
      controller.search( search )
    } else {
      state[ 'results' ] = []
    }

    this.setState( { ...state, search } )
  }

  /**
   * Renders a single result, highlighting the match.
   * @param gurmukhi The shabad line to display.
   * @param id The id of the line.
   */
  renderResult = ( { gurmukhi, id } ) => {
    const { search } = this.state

    // Split the line into first letters and check where the match is


    return <ListItem key={id}>{gurmukhi}</ListItem>
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

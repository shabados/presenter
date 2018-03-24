import React, { Component } from 'react'

import { Input } from 'material-ui'
import { toUnicode } from '@shabados/gurmukhi-utils'

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
    }
  }

  onChange = ( { target: { value } } ) => this.setState( { search: toUnicode( value ) } )

  render() {
    const { search } = this.state

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
      </div>
    )
  }

}

export default Search

describe( 'state', () => {
  describe( 'content', () => {
    describe( 'when a line is set', () => {
      it.todo( 'should broadcast the line ID if valid' )
      it.todo( 'should broadcast the line ID if null' )
      it.todo( 'should ignore the line ID if not in the current content' )
    } )

    describe( 'when a bookmark is set', () => {
      describe( 'given no history', () => {
        it.todo( 'should set the line id to the first line of the bookmark' )
        it.todo( 'should add the line to the history of latest lines' )
        it.todo( 'should add the line to the history of transitions' )
      } )

      // TODO should either be here, or under line describe.
      // Depends on whether transition behaviour is different for bookmarks and shabads, which I think it is

      describe( 'given the bookmark is in history', () => {
        it.todo( 'should set the line id of last viewed line' )
        it.todo( 'should remember viewed lines' )
        it.todo( 'should update the history transition with the latest line' )
      } )
    } )

    describe( 'when a shabad is set', () => {

    } )
  } )

  describe( 'history', () => {

  } )

  describe( 'settings', () => {
    it.todo( 'should get the settings for a client' )
    it.todo( 'should exclude settings from private clients' )
    it.todo( 'should' )
  } )
} )

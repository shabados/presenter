import React, { Component } from 'react'

import { AppBar, Toolbar, IconButton, Typography, Drawer, Hidden, List, ListItem } from 'material-ui'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/fontawesome-free-solid'

import ThemeLoader from '../shared/ThemeLoader'

import './index.css'

class Configurator extends Component {
  constructor( props ) {
    super( props )

    this.state = {
      mobileOpen: false,
    }
  }

  toggleMobileMenu = () => this.setState( { mobileOpen: !this.state.mobileOpen } )

  render() {
    const { settings } = this.props
    const { theme: { options: { themeName } } } = settings

    const { mobileOpen } = this.state

    const MenuItems = (
      <nav>
        <List>
          <ListItem>hi</ListItem>
        </List>
      </nav>
    )

    return (
      <div className="configurator">
        <ThemeLoader name={themeName} />
        <AppBar className="title-bar">
          <Toolbar>
            <Hidden mdUp>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerToggle}
              >
                <FontAwesomeIcon icon={faBars} />
              </IconButton>
            </Hidden>
            <Typography className="title" align="center" variant="title">fs</Typography>
          </Toolbar>
          <Hidden mdUp>
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={this.toggleMobileMenu}
              ModalProps={{ keepMounted: true }}
            >
              {MenuItems}
            </Drawer>
          </Hidden>
          <Hidden smDown implementation="css">
            <Drawer variant="permanent" open>
              {MenuItems}
            </Drawer>
          </Hidden>
          <main>
            <Typography noWrap>You think water moves fast? You should see ice.</Typography>
          </main>
        </AppBar>
      </div>
    )
  }
}

export default Configurator

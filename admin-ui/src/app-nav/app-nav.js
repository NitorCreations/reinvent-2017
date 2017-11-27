import React from 'react';
import { NavLink } from 'react-router-dom'
import FontIcon from 'material-ui/FontIcon';
import { Drawer, MenuItem } from 'material-ui'

class PageNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false}
  }
  render() {
    const handleClose = () => this.setState({open: false});

    return (
      <div>
        <Drawer
          docked={false}
          width={150}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
        >
          <MenuItem
            containerElement={<NavLink to="/" />}
            primaryText="Home"
            onClick={handleClose}
            leftIcon={
              <FontIcon className="material-icons">home</FontIcon>
            } />

          <MenuItem
            containerElement={<NavLink to="/login" />}
            primaryText="Login"
            onClick={handleClose}
            leftIcon={
              <FontIcon className="material-icons">people</FontIcon>
            } />
        </Drawer>
      </div>
    )
  }
}
export default PageNav

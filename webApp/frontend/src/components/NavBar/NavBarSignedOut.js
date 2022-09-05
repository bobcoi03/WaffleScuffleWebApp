import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { Navigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import { variables as ENV } from '../environmentVariables'
import BeachAccessIcon from '@mui/icons-material/BeachAccess';

class NavBarSignedOut extends React.Component {
  constructor(props) {
    super(props)
    this.state = { toggleDrawer: false, open: false, anchorEl: null, openCreatePost: false, navigateOut: false, outUrl: ""}
    this.navItems = ['Home', 'About','My Profile'];
    this.drawerWidth = 240

  }
  render() {

    if (this.state.navigateOut) {
      return (
        <Navigate to={this.state.outUrl} replace={false}/>
      )
    }

    return (
      <Box sx={{ flexGrow: 1, borderBottom: 1, borderColor: "#E3E3E3"}}>
        <AppBar position="static" sx={{ bgcolor:  '#ffffff'}} style={{ background: 'transparent', boxShadow: 'none'}}>
          <Toolbar>
            <IconButton component={Link} to="/">
              <BeachAccessIcon sx={{ marginRight: 1, color: "#ffee33"}}>
              </BeachAccessIcon>
            </IconButton>
            <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, color: "#170B65"}}>
              {ENV.name}
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/signin"
              sx={{ marginRight: 1}}
            >
              Log in
            </Button>
            <Button
              variant="contained"
              component={Link}
              to="/signup"
              color="success"
            >
              Sign up
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
    )
  }
}

export { NavBarSignedOut };

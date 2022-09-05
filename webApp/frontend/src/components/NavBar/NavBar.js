import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemIcon from '@mui/material/ListItemIcon';
import Popover from '@mui/material/Popover';
import Backdrop from '@mui/material/Backdrop'

import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CreateIcon from '@mui/icons-material/Create';
import LogoutIcon from '@mui/icons-material/Logout';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';

import { CreatePost } from '../CreatePost/CreatePost'
import { Navigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { variables as ENV } from '../environmentVariables'
import SearchBar from '../SearchBar/SearchBar'

class NavBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {  toggleDrawer: false,
                    open: false,
                    anchorEl: null,
                    openCreatePost: false,
                    navigateOut: false,
                    outUrl: "",
                    pathToProfileImage: ""}

    this.navItems = ['Home', 'About','My Profile', 'Friends'];
    this.drawerWidth = 240

  }

  componentDidMount = async () => {
    await fetch(`${ENV.url}/user-auth/get-path-to-profile-image-by-pk/${this.props.user_pk}`,
			{
				headers: {
					"method": "GET",
					"Accept": "text/plain",
					"Content-Type":"text/plain"
				}
			}
		)
		.then(res => res.text())
		.then(data => {
			this.setState({
				pathToProfileImage: data
			})
		})
  }

  handleAvatarClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
      toggleDrawer: true
    })
  }

  handleCloseAvatar = () => {
    this.setState({
      anchorEl: null,
      toggleDrawer: false
    })
  }

  handleToggleCreatePost = () => {
    this.setState({
      openCreatePost: true
    })
  }

  handleCloseCreatePost = () => {
    this.setState({
      openCreatePost: false
    })
  }

  handleNavigateOut = (outUrl) => {
    this.setState({
      outUrl: outUrl,
      navigateOut: true,
      navigateOut: false
    })
  }

  RenderHomeIcon = () => {
    if (window.location.pathname == '/') {
      return (
        <Tooltip title="Home">
          <IconButton component={Link} to="/">
            <HomeIcon sx={{color: "#000000"}} />
          </IconButton>
        </Tooltip>
      )
    } else {
      return (
        <Tooltip title="Home">
          <IconButton component={Link} to="/">
            <HomeOutlinedIcon sx={{color: "#000000"}} />
          </IconButton>
        </Tooltip>
      )
    }
  }

  RenderAvatarMenu = () => {
      return (
        <List
          aria-labelledby="nested-list-subheader"
        >
            <ListItem button component={Link} to={`/user/${this.props.username}`}>
              <ListItemIcon>
                <AccountCircleIcon/>
              </ListItemIcon>
              <ListItemText primary="My Profile"/>
            </ListItem>

            <ListItem button component={Link} to={`/friends`}>
              <ListItemIcon>
                <PeopleAltOutlinedIcon/>
              </ListItemIcon>
              <ListItemText primary="Friends"/>
            </ListItem>

            <ListItem button component={Link} to="/">
              <ListItemIcon>
                <HomeOutlinedIcon/>
              </ListItemIcon>
              <ListItemText primary="Home"/>
            </ListItem>

            <ListItem button component={Link} to="/settings">
              <ListItemIcon>
                <SettingsOutlinedIcon/>
              </ListItemIcon>
              <ListItemText primary="Settings"/>
            </ListItem>
      
            <a href="/user-auth/logout">
            <ListItemButton>
              <ListItemIcon>
                <LogoutIcon/>
              </ListItemIcon>
              <ListItemText primary="Log out"/>
            </ListItemButton>
            </a>
        </List>
        )
  }

  render() {
    const id = this.state.toggleDrawer ? 'simple-popover' : undefined
    const RenderAvatarMenu = this.RenderAvatarMenu
    const RenderCreatePost = this.RenderCreatePost
    const RenderHomeIcon = this.RenderHomeIcon
    if (this.state.navigateOut) {
      return (
        <Navigate to={this.state.outUrl} replace={false}/>
      )
    } else if (this.state.pathToProfileImage == "") {
       return (
        <Box sx={{ flexGrow: 1, borderBottom: 1, borderColor: "#E3E3E3"}}>
          <AppBar position="static" sx={{ bgcolor:  '#ffffff'}} style={{ background: 'transparent', boxShadow: 'none'}}>
            <Toolbar>
              <IconButton component={Link} to="/">
                <BeachAccessIcon sx={{ marginRight: 1, color: "#ffee33"}}>
                </BeachAccessIcon>
              </IconButton>
              <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1}}>
                {ENV.name}
              </Typography>
              <CreatePost username={this.props.username}/>
              <Tooltip title="Menu">
              <IconButton aria-describedby={id} onClick={event => {this.handleAvatarClick(event)}} sx={{ p: 0 }}>
                <Avatar alt={this.props.name} src={this.state.pathToProfileImage}>
                  {this.props.name}
                </Avatar>
              </IconButton>
              </Tooltip>
            </Toolbar>
            <Popover
              id={id}
              open={this.state.toggleDrawer}
              anchorEl={this.state.anchorEl}
              onClose={this.handleCloseAvatar}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
            >
              <RenderAvatarMenu/>
            </Popover>
          </AppBar>
        </Box>
      )
    } else {
          return (
            <Box sx={{ flexGrow: 1, borderBottom: 1, borderColor: "#E3E3E3"}}>
              <AppBar position="static" sx={{ bgcolor:  '#ffffff'}} style={{ background: 'transparent', boxShadow: 'none'}}>
                <Toolbar>
                  <IconButton component={Link} to="/">
                    <BeachAccessIcon sx={{ marginRight: 1, color: "#ffee33"}}>
                    </BeachAccessIcon>
                  </IconButton>
                  <div style={{ flexGrow: 1}}/>
                  <RenderHomeIcon/>
                  <SearchBar/>
                  <CreatePost username={this.props.username} pathToProfileImage={this.state.pathToProfileImage}/>
                  <Tooltip title="Menu">
                    <IconButton aria-describedby={id} onClick={event => {this.handleAvatarClick(event)}} sx={{ p: 0 }}>
                      <Avatar alt={this.props.name} src={this.state.pathToProfileImage}>
                        {this.props.name}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                </Toolbar>
                <Popover
                  id={id}
                  open={this.state.toggleDrawer}
                  anchorEl={this.state.anchorEl}
                  onClose={this.handleCloseAvatar}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                >
                  <RenderAvatarMenu/>
                </Popover>
              </AppBar>
            </Box>
          )
    }
  }
}

export { NavBar };

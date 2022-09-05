import React, {Component} from "react"
import { render } from "react-dom"
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CSRFToken, getCookie } from '../../auth/csrftoken'
import { Copyright } from '../../Copyright/Copyright'
import { LoadingPage } from '../LoadingPage/LoadingPage'
import { NavBar } from '../../NavBar/NavBar'
import { variables as ENV } from '../../environmentVariables'
import { CreatePost } from '../../CreatePost/CreatePost'
import { DisplayPost } from '../../DisplayPost/DisplayPost'
import { DisplayComment } from '../../DisplayComment/DisplayComment'
import DisplayPostMenu from '../../DisplayPostMenu/DisplayPostMenu'
import { withParams } from '../../UtilityFunctions/UtilityFunctions'
import HomePageSignedOut from '../HomePage/HomePageSignedOut'
import DisplayProfile from '../../DisplayProfile/DisplayProfile'

import Tooltip from '@mui/material/Tooltip'
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
const theme = createTheme()

class FriendsPage extends Component{
	constructor(props) {
		super(props)
		this.state = { 
			isLoaded: false,
			userData: [],
			error: null,
			friendsData: [],
			tabValue: 0
		}
	}
	componentDidMount() {
		// If this.props.params.url == 'new'
		// fetch from /post/get-post-objects-by-published-datetime
		// if this.props.params.url == 'best'
		// fetch from /post/get-post-objects-by-likes

		fetch(ENV.url + '/user-auth/get-user-object',
			{
				headers: {
					"method": "GET",
					"Accept":"application/json",
					"Content-Type":"application/json"
				}
			})
			.then(res => res.json())
			.then((data) => {
				this.setState({
					userData: data[0],
				});
			},
			(error) => {
				this.setState({
					error: error,
					isLoaded: true
				})
			}
		)

		fetch(ENV.url + '/user-auth/get-friends-user-objects',
			{
				headers: {
					"method": "GET",
					"Accept": "application/json",
					"Content-Type": "application/json"
				}
			}
		)
		.then(res => res.json())
		.then(data => {
			this.setState({
				friendsData: data,
				isLoaded: true
			})
		})
	}

	DisplayProfileList = () => {
		const { friendsData } = this.state
		var friends = []
		for (var i = 0; i < friendsData.length; i++) {
			friends.push(<DisplayProfile
				pk={friendsData[i].pk}
				username={friendsData[i]['fields'].username}
				key={friendsData[i].pk}
			/>)
		}
		return (
			<div style={{maxWidth: ENV.maxWidthDisplayPost}}>
				{friends}
			</div>
		)
	}

	handleChangeTab = (event, newValue) => {
		this.setState({
			tabValue: newValue
		})
	}


	render() {

		const { error, isLoaded, userData, friendsData } = this.state
		const DisplayProfileList = this.DisplayProfileList
		if(!isLoaded) {
			return (<LoadingPage/>)
		} else if (userData['fields'] == undefined && isLoaded) {
			// Render signed out view
			return (
				<HomePageSignedOut/>
			)
		}
		else if (friendsData.length == 0) {
			return (
				<div>
					<ThemeProvider theme={theme}>
						<NavBar username={userData['fields'].username} user_pk={userData.pk}/>
						<Grid container component="main" sx={{ height:'100vh'}}>
							<Grid
								item
				          		xs={0}
				          		sm={0}
				          		md={3}
							>
							</Grid>
							<Grid
								item
								xs={12}
								sm={12}
								md={6}
								container
								direction="column"
								justifyContent="flex-start"
								alignItems="center"
								
							>
								<Box>
									<Tabs 
										value={this.state.tabValue}
										onChange={this.handleChangeTab}
										textColor="#000000"
										variant="scrollable"
  										scrollButtons="auto"
  									
									>
										<Tab icon={<Tooltip title="friends">
														<PeopleOutlineIcon sx={{ color: "#000000"}}/>
												   </Tooltip>}
											wrapped 
										/>
										<Tab icon={<Tooltip title="friend requests">
														<PersonAddAlt1OutlinedIcon/>
												   </Tooltip>}
											wrapped 
										/>
									</Tabs>
								</Box>
								<div style={{ flexGrow: 1 }}/>
							</Grid>
							<Grid
								item
								xs={0}
								sm={0}
								md={3}
							/>
						</Grid>
					</ThemeProvider>
				</div>
			)
			//
		} else if (friendsData.length > 0 && isLoaded && userData['fields'] != undefined) {
			return (
				<div>
					<ThemeProvider theme={theme}>
						<CssBaseline>
							<NavBar username={userData['fields'].username} user_pk={userData.pk}/>
							<Grid container component="main" sx={{ height:'100vh' }}>
								<Grid
									item
					          		xs={0}
					          		sm={0}
					          		md={3}
								>
								</Grid>
								<Grid
									item
									xs={12}
									sm={12}
									md={4}
									container
									direction="row"
									justifyContent="center"
									alignItems="flex-start"
								>
									<DisplayProfileList/>
								</Grid>
								<Grid
									item
									xs={0}
									sm={0}
									md={3}
								/>
							</Grid>
						</CssBaseline>
					</ThemeProvider>
				</div>
			)
		}
	}
}

export default withParams(FriendsPage)

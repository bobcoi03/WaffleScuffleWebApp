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
			tabValue: 0,
			sentFriendRequestsData: [], // All users that user has sent friend request to
			receivedFriendRequestsData: [] // All users that has sent friend request to user
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

		this.getSentFriendRequestsData()
		this.getReceivedFriendRequestsData()

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
		// Display all friends a user has
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

	getSentFriendRequestsData = () => {
		// get data about users that the user has sent friend request to
		fetch(ENV.url + '/user-auth/get-sent-friend-requests',
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
				sentFriendRequestsData: data
			})
		})
	}

	getReceivedFriendRequestsData = () => {
		fetch(ENV.url + '/user-auth/get-received-friend-requests',
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
				receivedFriendRequestsData: data
			})
		})
	}

	DisplayReceivedFriendRequestProfileList = () => {
		var receivedFriendRequests = []
		for (var i = 0; i < this.state.receivedFriendRequestsData.length; i++) {
			receivedFriendRequests.push(
				<DisplayProfile
					pk={this.state.receivedFriendRequestsData[i].pk}
					username={this.state.receivedFriendRequestsData[i]['fields'].username}
					key={this.state.receivedFriendRequestsData[i].pk}
				/>
			)
		}
		return (
			<div style={{maxWidth: ENV.maxWidthDisplayPost}}>
				{receivedFriendRequests}
			</div>
		)
	}

	DisplaySentFriendRequestProfileList = () => {
		// Display all users that user has sent a friend request to
		var sentFriendRequests = []
		for (var i = 0; i < this.state.sentFriendRequestsData.length; i++) {
			sentFriendRequests.push(
				<DisplayProfile
					pk={this.state.sentFriendRequestsData[i].pk}
					username={this.state.sentFriendRequestsData[i]['fields'].username}
					key={this.state.sentFriendRequestsData[i].pk}
				/>
			)
		}
		return (
			<div style={{maxWidth: ENV.maxWidthDisplayPost}}>
				{sentFriendRequests}
			</div>
		)
	}

	handleChangeTab = (event, newValue) => {
		this.setState({
			tabValue: newValue
		})
	}

	MainDisplay = () => {
		// Display based on this.state.tabValue
		const DisplaySentFriendRequestProfileList = this.DisplaySentFriendRequestProfileList
		const DisplayReceivedFriendRequestProfileList = this.DisplayReceivedFriendRequestProfileList
		const DisplayProfileList = this.DisplayProfileList

		if (this.state.tabValue == 0) {
			if (this.state.friendsData.length == 0) {
				return (<p>Go to the search icon to make some friends!</p>)
			} else {
				return (
					<DisplayProfileList/>
				)
			}
		} else if (this.state.tabValue == 1) {
			return (
				<div>
					<div>Pending Sent friend requests</div>
					<DisplaySentFriendRequestProfileList/>
					<br/>
					<div>Received friend requests</div>
					<DisplayReceivedFriendRequestProfileList/>
				</div>
			)
		}
	}


	render() {

		const { error, isLoaded, userData, friendsData } = this.state
		const DisplayProfileList = this.DisplayProfileList
		const MainDisplay = this.MainDisplay
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
									<MainDisplay/>
								</Box>
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
									md={6}
									direction="row"
									justifyContent="center"
									alignItems="flex-start"
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
									<MainDisplay/>
								</Box>
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

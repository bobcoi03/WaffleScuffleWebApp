import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { Link } from 'react-router-dom';
import { variables as ENV } from '../environmentVariables';
import CircularProgress from '@mui/material/CircularProgress';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar'
import AddIcon from '@mui/icons-material/Add'
import Tooltip from '@mui/material/Tooltip'
import CheckIcon from '@mui/icons-material/Check'
import { CSRFToken, getCookie } from '../auth/csrftoken'
import Snackbar from '@mui/material/Snackbar';

class DisplayProfile extends React.Component {
	constructor(props) {
		super(props)
		this.state = { 	userData: [],
						userExtendedData: [],
						isLoaded: false,
						error: null,
						pathToProfileImage: "",
						areFriends: null,
						toggleDisplaySnackBar: false,
						friendRequestResponseMessage: "",
						ifUserHasSentFriendRequest: null
		}
	}

	componentDidMount() {
		fetch(ENV.url + `/user-auth/get-user-extended-object-by-pk/${this.props.pk}`,
			{
				headers: {
					"method": "GET",
					"Accept": "text/plain",
					"Content-Type":"text/plain"
				}
			}
		)
		.then(res => res.json())
		.then(data => {
			this.setState({
				userData: data,
				isLoaded: true
			})
		},
		error => {
			this.setState({
				isLoaded: true,
				error: error
			})
		}
		)
		this.getProfileImage()
		this.ifAlreadyFriend()
	}

	getProfileImage = async () => {
		await fetch(`${ENV.url}/user-auth/get-path-to-profile-image-by-pk/${this.props.pk}`,
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

	ifAlreadyFriend = () => {
		// If request.user is friends with profile displaying the user
		fetch(ENV.url + `/user-auth/if-already-friends/user_pk=${this.props.pk}`,
			{
				headers: {
					"method": "GET",
					"Accept": "text/plain",
					"Content-Type": "text/plain"
				}
			}
		)
		.then(res => res.text())
		.then(data => {
			var isBool = (data === 'true')

			if (isBool == false) {
				this.ifUserHasSentFriendRequest()
			}

			this.setState({
				areFriends: isBool
			})
		})
	}

	ifUserHasSentFriendRequest = () => {
		// if requesting user and user are not friends
		// Check if this.props.pk user has sent a friend request to requesting user
		fetch(ENV.url + `/user-auth/if-user-pk-has-sent-friend-request/user_pk=${this.props.pk}`,
			{
				headers: {
					"method": "GET",
					"Accept": "text/plain",
					"Content-Type": "text/plain"
				}
			}
		)
		.then(res => res.text())
		.then(data => {
			var isBool = (data === 'true')
			this.setState({
				ifUserHasSentFriendRequest: isBool
			})
		})
	}


	sendFriendRequest = async () => {
		fetch(ENV.url + `/user-auth/send-friend-request/user_pk=${this.props.pk}`,
			{
				method: "POST",
				body: null,
				headers: {
					"X-CSRFToken": getCookie("csrftoken"),
			 		"Accept": "text/plain"
				}
			}
		)
		.then(res => res.text())
		.then(data => {
			this.setState({
				friendRequestResponseMessage: data
			})
		})

		// Display snackbar
		this.setState({
			toggleDisplaySnackBar: true
		})

	}

	RenderAvatar = () => {
		if (this.state.pathToProfileImage == "") {
			return (
				<Avatar
					component={Link}
					to={`/user/${this.props.username}`}
					sx={{ width: 75, height: 75}}
				>
				</Avatar>
			)
		} else {
			return (
				<Avatar
					component={Link}
					to={`/user/${this.props.username}`}
					src={this.state.pathToProfileImage}
					sx={{ width: 75, height: 75}}
				>
				</Avatar>
			)
		}
	}

	RenderAction = () => {
		// if already friends with user dont display action
		// else add friend button
		if (this.state.areFriends) {
			return null
		} else if (this.state.ifUserHasSentFriendRequest) {
			return (
				<Button size="small">
					Accept friend request
				</Button>
			)
		} else {
			return (
				<Tooltip title="Send friend request">
				   <IconButton aria-label="settings" onClick={this.sendFriendRequest}>
						<AddIcon/>
					</IconButton>
				</Tooltip>
			)
		}
	}

	handleToggleSnackBar = () => {
		if (this.state.toggleDisplaySnackBar) {
			this.setState({
				toggleDisplaySnackBar: false
			})
		} else {
			this.setState({
				toggleDisplaySnackBar: true
			})
		}
	}

	RenderSnackBar = () => {
		  const action = (
				    <React.Fragment>
				      <IconButton
				        size="small"
				        aria-label="close"
				        color="inherit"
				        onClick={this.handleToggleShare}
				      >
				        <CloseIcon fontSize="small" />
				      </IconButton>
				    </React.Fragment>
				  );
		if (this.state.toggleDisplaySnackBar) {
			return (
				<Snackbar
					open={this.state.toggleDisplaySnackBar}
					onClose={this.handleToggleSnackBar}
					autoHideDuration={6000}
					message={this.state.friendRequestResponseMessage}
					action={action}
				>
				</Snackbar>
			)
		} else {
			return null
		}
	}

	render() {
		console.log(this.state.userData)
		const RenderAction = this.RenderAction
		const RenderAvatar = this.RenderAvatar
		const RenderSnackBar = this.RenderSnackBar

		if (!this.state.isLoaded) {
			return (
				<CircularProgress/>
			)
		} else {
			return (
				<Box sx={{ width: '100%' }}>
					<Card sx={{boxShadow: 'none', background: 'transparent'}} variant="outlined">
						<CardHeader
							avatar={<RenderAvatar/>}
							title={this.props.username}
							action={
								<RenderAction/>
					        }
						>
						</CardHeader>
					</Card>
					<RenderSnackBar/>
				</Box>
			)
		}
	}
}

export default DisplayProfile
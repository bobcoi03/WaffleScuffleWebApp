import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { Link } from 'react-router-dom';
import { variables as ENV } from '../environmentVariables';
import CircularProgress from '@mui/material/CircularProgress';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import AddIcon from '@mui/icons-material/Add'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'
import LinkMaterial from '@mui/material/Link';
import { CSRFToken, getCookie } from '../auth/csrftoken'
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

var csrftoken = getCookie('csrftoken')


class DisplayProfileHeader extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			pathToProfileImage: "",
			userExtendedData: [],
			isLoaded: false
		}
	}

	componentDidMount() {
		this.getProfileImage()
		this.getUserExtendedObject()
	}

	getUserExtendedObject = async () => {
		fetch(ENV.url + `/user-auth/get-user-extended-object-by-username/username=${this.props.username}`,
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
				userExtendedData: data[0],
				isLoaded: true
			})
		})
	}

	sendFriendRequest = () => {
		fetch(ENV.url + `/user-auth/send-friend-request/user_pk=${this.props.user_pk}`,
			{
				method: "POST",
				body: null,
				headers: {
					"X-CSRFToken": getCookie("csrftoken"),
			 		'Accept':'text/plain',
				}
			}
		)
		.then(res => res.text())
		.then(data => alert(data))

	}

	getProfileImage = () => {
		fetch(`${ENV.url}/user-auth/get-path-to-profile-image-by-username/username=${this.props.username}`,
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

	render() {
		if (!this.state.isLoaded) {
			return (
				<Stack spacing={2}  sx={{ marginBottom: 3, marginTop: 3}}>
					<Skeleton variant="circular" height={40} width={40}/>
					<Skeleton variant="rectangular" height={200}/>
				</Stack>
			)
		} else if (this.state.userExtendedData['fields'] != undefined) {
			return (
				<div style={{width: '100%', marginTop:'7px', maxWidth: ENV.maxWidthDisplayPost, position: 'relative'}}>
					<Card sx={{ width: '100%', boxShadow: 'none', background: 'transparent'}} variant="outlined">
						<Button sx={{ position: 'absolute', bottom: '0px', right: '0px'}} variant="outlined" onClick={this.sendFriendRequest}>
							Follow
						</Button>
						<CardContent sx={{ display: 'flex'}}>
								<Avatar
									src={this.state.pathToProfileImage}
									sx={{ height: 150, width: 150}}
								>
								</Avatar>
								<span>
									<div style={{ marginLeft: '10px'}}>
										<Typography id="username" variant="h6">
											{this.props.username}
										</Typography>
										<Typography>
											{this.state.userExtendedData['fields'].bio}
										</Typography>
										<LinkMaterial href="#">
											My link
										</LinkMaterial>
									</div>
								</span>
						</CardContent>
					</Card>
				</div>
			)
		}
	}
}

export default DisplayProfileHeader
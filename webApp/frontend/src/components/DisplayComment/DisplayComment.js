import React, {Component} from "react"
import { render } from "react-dom"
import Button from "@mui/material/Button"
import { CSRFToken, getCookie } from '../auth/csrftoken'
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader'
import IconButton, { IconButtonProps }  from '@mui/material/IconButton'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ShareIcon from '@mui/icons-material/Share'
import Tooltip from '@mui/material/Tooltip'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { styled } from '@mui/material/styles'
import { variables as ENV } from '../environmentVariables'


class DisplayComment extends Component{
	constructor(props){
		super(props)
		this.state = { username: '', isLoaded: false, expandMoreTitle: "Show more", expand: false, userHasLiked: false, pathToProfileImage: ""}
	}

	componentDidMount = async () => {
		await fetch(`${ENV.url}/user-auth/get-username-by-pk/${this.props.user}`,
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
				username: data,
			})
		})
		await fetch(`${ENV.url}/post/get-comment-likes/${this.props.pk}`,
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
			this.setState({
				likesNumber: data,
			})
		})
		await fetch(`${ENV.url}/post/if-user-liked-comment/${this.props.pk}`,
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
				userHasLiked: isBool,
				isLoaded: true
			})
		})
		await fetch(`${ENV.url}/user-auth/get-path-to-profile-image-by-pk/${this.props.user}`,
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
			this.setState({
				pathToProfileImage: data
			})
		})
	}

	// Text, published_datetime, likes, shares, url, username,
	handleExpandToggle = () => {
		if (this.state.expand) {
			this.setState({
				expand: false,
				expandMoreTitle: "Show more"
			})
		} else {
			this.setState({
				expand: true,
				expandMoreTitle: "Show less"
			})
		}
	}

	handleToggleLike = async () => {
		// Set state of userHasliked to opposite
		if (this.state.userHasLiked) {
			this.setState({
				userHasLiked: false
			})
		} else {
			this.setState({
				userHasLiked: true
			})
		}

		await fetch(`${ENV.url}/post/register-comment-like/${this.props.pk}`,
			{
				headers: {
					"method": "GET",
					"Accept": "text/plain",
					"Content-Type": "text/plain"
				}
			}
		)
		.then(res => res.text())
		.then(data => data)
		await fetch(`${ENV.url}/post/get-comment-likes/${this.props.pk}`,
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
			this.setState({
				likesNumber: data
			})
		})
	}

	RenderAvatar = () => {
		// If statement to change based on pathToProfileImage is loaded
		if (this.state.pathToProfileImage == "") {
			return (
				<Avatar
					alt={this.state.username}
					src={this.state.pathToProfileImage}
				>
				</Avatar>
			)
		} else {
			return (
				<Avatar
					src={this.state.pathToProfileImage}
					alt={this.state.username}
				>
				</Avatar>
			)
		}
	}

	RenderExpand = () => {
		if (this.state.expand == true) {
			return (
				<Tooltip title={this.state.expandMoreTitle} style={{marginLeft: "auto"}} onClick={this.handleExpandToggle}>
					<span>
						<IconButton>
							<ExpandLessIcon color="secondary"/>
						</IconButton>
					</span>
				</Tooltip>
			)
		} else {
			return (
				<Tooltip title={this.state.expandMoreTitle} style={{marginLeft: "auto"}} onClick={this.handleExpandToggle}>
					<span>
						<IconButton>
							<ExpandMoreIcon color="secondary"/>
						</IconButton>
					</span>
				</Tooltip>
			)
		}
	}

	RenderLikeButton = () => {
		if (this.state.userHasLiked) {
			return (
				<Tooltip title="unlike this">
				    <span>
					    <IconButton onClick={this.handleToggleLike}>
					    	<ThumbUpIcon color="secondary" fontSize="small"/>
						</IconButton>
						<Typography variant="caption">
							{this.state.likesNumber}
						</Typography>
					</span>
				</Tooltip>
			)
		} else {
			return (
				<Tooltip title="like this">
				    <span>
						<IconButton onClick={this.handleToggleLike}>
						    <ThumbUpOffAltIcon color="secondary" fontSize="small"/>
						</IconButton>
						<Typography variant="caption">
							{this.state.likesNumber}
						</Typography>
					</span>
				</Tooltip>
			)
		}
	}

	ConvertPublishedDatetime = () => {
		const d = new Date(this.props.publishedDatetime)
		return d.toLocaleString()
	}

	render() {

		const RenderExpand = this.RenderExpand
		const RenderLikeButton = this.RenderLikeButton
		const RenderAvatar = this.RenderAvatar

		if (this.state.isLoaded == false) {
			return null
		} else {
			return (
				<div style={{width: '100%'}}>
					<Card sx={{ width: '100%'}}>
						<CardHeader
							avatar={<RenderAvatar/>}
							title={this.state.username}
							subheader={this.ConvertPublishedDatetime()}
						/>
						<CardContent>
					        <Typography variant="body2">
					        	{this.props.text}
					        </Typography>
						    <CardActions disableSpacing>
						    	<RenderLikeButton/>
							    <RenderExpand/>
							</CardActions>
						</CardContent>
					</Card>
				</div>
			)
		}
	}
}

export { DisplayComment }

import React, {Component, Fragment} from "react"
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
import CardHeader from '@mui/material/CardHeader';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import IconButton, { IconButtonProps }  from '@mui/material/IconButton'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ShareIcon from '@mui/icons-material/Share'
import Tooltip from '@mui/material/Tooltip'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';
import ButtonBase from '@material-ui/core/ButtonBase';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

import { styled } from '@mui/material/styles'
import { variables as ENV } from '../environmentVariables'
import { DisplayComment } from '../DisplayComment/DisplayComment'
import { DisplayWriteComment } from '../DisplayWriteComment/DisplayWriteComment'
import { Link } from 'react-router-dom';

class DisplayPost extends Component {

	constructor(props) {
		super(props)
		this.state = {
			expand: false, 
			toggleDisplayComments: false,
			username: '', 
			isLoaded: false,
			commentsData: [],
			likesNumber: 0,
			expandMoreTitle: "Show more",
			userHasLiked: false, 
			toggleShowWriteComment: false, 
			toggleDisplayShareSnackBar: false,
			pathToProfileImage: "",
			pathToPostImage: "",

		}
		this.comments = ["comment 1", "comment 2"]
		this.text = this.props.text
		
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
		},
		error => {
			console.log(error)
		}
		)
		// fecth every comment and
		await fetch(`${ENV.url}/post/get-post-comments-by-pk/${this.props.pk}`,
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
				commentsData: data
			})
		})
		await fetch(`${ENV.url}/post/get-post-likes/${this.props.pk}`,
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

		await fetch(`${ENV.url}/post/if-user-liked-post/${this.props.pk}`,
			{
				headers: {
					"method":"GET",
					"Accept": "text/plain",
					"Content-Type": "text/plain"
				}
			}
		)
		.then(res => res.text())
		.then(data => {
			var isBool = (data === 'true')
			this.setState({
				userHasLiked: isBool
			})
		})

		await fetch(`${ENV.url}/user-auth/get-path-to-profile-image-by-pk/${this.props.user}`,
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

		await fetch(`${ENV.url}/post/get-path-to-post-image-by-post-pk/${this.props.pk}`,
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
				pathToPostImage: data,
				isLoaded: true
			})
		},
		error => {
			this.setState({
				pathToPostImage: false
			})
		}
		)
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

	handleToggleComments = () => {
		if (this.state.toggleDisplayComments) {
			this.setState({
				toggleDisplayComments: false
			})
		} else {
			this.setState({
				toggleDisplayComments: true
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

		await fetch(`${ENV.url}/post/register-post-like/${this.props.pk}`,
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

		await fetch(`${ENV.url}/post/get-post-likes/${this.props.pk}`,
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

	handleToggleShare= () => {
		if (this.state.toggleDisplayShareSnackBar) {
			this.setState({
				toggleDisplayShareSnackBar: false
			})
		} else {
			this.setState({
				toggleDisplayShareSnackBar: true
			})
			navigator.clipboard.writeText(`${ENV.url}/view-post-by-url/${this.props.url}`)
		}
	}

	RenderShareSnackBar = () => {
		  const action = (
				    <Fragment>
				      <IconButton
				        size="small"
				        aria-label="close"
				        color="inherit"
				        onClick={this.handleToggleShare}
				      >
				        <CloseIcon fontSize="small" />
				      </IconButton>
				    </Fragment>
				  );
		if (this.state.toggleDisplayShareSnackBar) {
			return (
				<Snackbar
					open={this.state.toggleDisplayShareSnackBar}
					onClose={this.handleToggleShare}
					autoHideDuration={6000}
					message="Post link copied to clipboard"
					action={action}
				>
				</Snackbar>
			)
		}
	}

	RenderComments = () => {
		let comments = []
		const { commentsData } = this.state
		if (this.state.toggleDisplayComments && commentsData.length > 0) {
			for (var i = 0; i < commentsData.length; i++) {
			comments.push(
				<DisplayComment 
					user={commentsData[i]['fields'].user}
					publishedDatetime={commentsData[i]['fields'].published_datetime}
					likes={commentsData[i]['fields'].likes}
					text={commentsData[i]['fields'].text}
					url={commentsData[i]['fields'].url}
					pk={commentsData[i].pk}
					key={i}
				/>
				)
			}
			return (
				<div>
					{comments}
				</div>
			)

		} else {
			return null
		}
	}



	RenderText = () => {

		const textActual = this.text.split(/\r?\n|\r|\n/g); // Array from string split by newline character
		const textList = [] // holds Typography components

		for (var i = 0; i < textActual.length; i++) {
			textList.push(
				<Typography variant="body1" paragraph={true} key={i}>
					{textActual[i]}
				</Typography>
			)
		}

		if (window.location.href == `${ENV.url}/view-post-by-url/${this.props.url}`) {
			// if we are already at view post by url we dont allow click on displaypost
			if (this.text.length < 100) {
				return (
					<div>
							{textList}
					</div>
				)
			} else if (this.text.length > 100 && !this.state.expand) {
				return (
					<div>
						{this.text.slice(0, 100)}
					</div>
				)
			} else if (this.state.expand) {
				return (
					<div>
						{textList}
					</div>
				)
			}
		}

		else {
			if (this.text.length < 100) {
				return (
					<CardActionArea component={Link} to={`/view-post-by-url/${this.props.url}`}>
						<div>
							{textList}
						</div>
					</CardActionArea>
				)
			} else if (this.text.length > 100 && !this.state.expand) {
				return (
					<CardActionArea component={Link} to={`/view-post-by-url/${this.props.url}`}>
						<div>
							{this.text.slice(0, 100)}
						</div>
					</CardActionArea>
				)
		} else if (this.state.expand) {
			return (
				<CardActionArea component={Link} to={`/view-post-by-url/${this.props.url}`}>
					<div>
						{textList}
					</div>
				</CardActionArea>
			)
		}
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

	RenderWriteComment = () => {
		if (this.state.toggleShowWriteComment) {
			return (
				<DisplayWriteComment post_pk={this.props.pk}/>
			)
		} else {
			return null
		}
	}

	RenderAvatar = () => {
		if (this.state.pathToProfileImage == "") {
			return (
				<Avatar component={Link} to={`/user/${this.state.username}`} src={this.state.pathToProfileImage}>
				</Avatar>
			)
		} else {
			return (
				<Avatar component={Link} to={`/user/${this.state.username}`} src={this.state.pathToProfileImage}>
				</Avatar>
			)
		}
	}

	handleToggleWriteComment = () => {
		if (this.state.toggleShowWriteComment) {
			this.setState({
				toggleShowWriteComment: false
			})
		} else {
			this.setState({
				toggleShowWriteComment: true
			})
		}
	}

	ConvertPublishedDatetime = () => {
		const d = new Date(this.props.publishedDatetime)
		return d.toLocaleString()
	}

	RenderDate = () => {
		return (
			<Tooltip title={this.ConvertPublishedDatetime()}>
				<Typography variant="caption">
					{this.timeSince() + ' ago'}
				</Typography>
			</Tooltip>
		)
	}

	timeSince = () => {
	  const date = new Date(this.props.publishedDatetime)

	  if (typeof date !== 'object') {
	    date = new Date(date);
	  }

	  var seconds = Math.floor((new Date() - date) / 1000);
	  var intervalType;

	  var interval = Math.floor(seconds / 31536000);
	  if (interval >= 1) {
	    intervalType = 'year';
	  } else {
	    interval = Math.floor(seconds / 2592000);
	    if (interval >= 1) {
	      intervalType = 'month';
	    } else {
	      interval = Math.floor(seconds / 86400);
	      if (interval >= 1) {
	        intervalType = 'day';
	      } else {
	        interval = Math.floor(seconds / 3600);
	        if (interval >= 1) {
	          intervalType = "hour";
	        } else {
	          interval = Math.floor(seconds / 60);
	          if (interval >= 1) {
	            intervalType = "minute";
	          } else {
	            interval = seconds;
	            intervalType = "second";
	          }
	        }
	      }
	    }
	  }

	  if (interval > 1 || interval === 0) {
	    intervalType += 's';
	  }

	  return interval + ' ' + intervalType;
	};

	RenderCardMedia = () => {
		if (this.state.pathToPostImage == 'A server error occurred.  Please contact the administrator.') {
			return null
		} else {
			return (
					<CardMedia
						component="img" 
						to={`/view-post-by-url/${this.props.url}`}
						image={this.state.pathToPostImage}
					/>
			)
		}
	}

	render() {

		const RenderText = this.RenderText
		const RenderComments = this.RenderComments
		const RenderExpand = this.RenderExpand
		let RenderLikeButton = this.RenderLikeButton
		const RenderWriteComment = this.RenderWriteComment
		const RenderShareSnackBar = this.RenderShareSnackBar
		const RenderAvatar = this.RenderAvatar
		const RenderCardMedia = this.RenderCardMedia
		const RenderDate = this.RenderDate

		if (!this.state.isLoaded) {
			return (
				<Stack spacing={2}  sx={{ marginBottom: 3, marginTop: 3}}>
					<Skeleton variant="circular" height={40} width={40}/>
					<Skeleton variant="rectangular" height={200}/>
				</Stack>
			)
		} else {

		return (
			<div style={{width: '100%', marginTop:'7px', maxWidth: ENV.maxWidthDisplayPost}}>
					<Card sx={{ width: '100%'}} variant="outlined">
							<CardHeader 
								avatar={<RenderAvatar/>}
								title={this.state.username}
								subheader=<RenderDate/>
							/>

								<RenderCardMedia/>
								<CardContent>
									<RenderText/>
								    <CardActions disableSpacing>
								    	<RenderLikeButton/>
									    <Tooltip title="Replies" onClick={this.handleToggleComments}>
									    	<span>
									    		<IconButton>					      
										        	<ChatOutlinedIcon color="secondary" fontSize="small"/>
									    		</IconButton>
									    		<Typography variant="caption">
									    			{this.state.commentsData.length}
									    		</Typography>
									    	</span>
									    </Tooltip>
									    <Tooltip title="Write reply" onClick={this.handleToggleWriteComment}>
									    	<span>
									    		<IconButton>
									    			<MapsUgcOutlinedIcon color="secondary" fontSize="small"/>
									    		</IconButton>
									    	</span>
									    </Tooltip>
									    <Tooltip title="Share this">
									    	<span>
									    		<IconButton onClick={this.handleToggleShare}>
									          		<ShareIcon color="secondary" fontSize="small"/>
									        	</IconButton>
									    	</span>
									    </Tooltip>
									    <RenderExpand/>
								    </CardActions>
							    </CardContent>
					</Card>
				<RenderShareSnackBar/>
				<RenderWriteComment/>
				<RenderComments/>
			</div>
			)
		}
	}
}

export { DisplayPost }
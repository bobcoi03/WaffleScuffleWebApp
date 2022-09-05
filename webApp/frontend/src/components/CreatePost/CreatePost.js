import React, {Component} from "react"
import { render } from "react-dom"
import Button from "@mui/material/Button"
import { CSRFToken, getCookie } from '../auth/csrftoken'
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { variables as ENV } from '../environmentVariables'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import ButtonGroup from '@mui/material/ButtonGroup';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { pink } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert'
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Snackbar from '@mui/material/Snackbar';

import PhotoCamera from '@mui/icons-material/PhotoCamera';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import CreateIcon from '@mui/icons-material/Create';
import CloseIcon from '@mui/icons-material/Close';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';

var csrftoken = getCookie('csrftoken')

class CreatePost extends Component{
	constructor(props) {
		super(props)
		this.state = {responseMessage: "",
			openAlert: true,
			openConfirmPostCreation: false,
			openCreatePostDialog: false,
			savedText: "",
			isLoadSavedText: false,
			pathToPostImage: '',
			openLoadingBackdrop: false
		}
	}
	handleSubmit = async () => {
		// open loading backdrop
		this.setState({	
			openLoadingBackdrop: true,
			openConfirmPostCreation: false
		})


		const data = new FormData(document.getElementById("form"))
		await fetch(`${ENV.url}/post/create-post`, {
					method: "POST",
					body: data,
					headers: {
						"X-CSRFToken": getCookie("csrftoken"),
			 			'Accept':'text/plain',
					},
		})
		.then(res => res.text())
		.then(resData => {
			this.setState({
				responseMessage: resData,
				openLoadingBackdrop: false
			})
		})
	}

	RenderResponseMessage = () => {
		// Renders Response messsage after making POST request
		if (this.state.responseMessage == 'Post created successfully' && this.state.openAlert) {
			return (
				<Alert onClose={() => {
					this.setState({
						openAlert: false
					})
				}}
				>{this.state.responseMessage}
				</Alert>
			)
		} else if (this.state.responseMessage == "Failed to create post" && this.state.openAlert) {
			<Alert severity="error"
				onClose={() => {
					this.setState({
						openAlert: false
					})
				}}

				>{this.state.responseMessage}
			</Alert>
		}
		else {
			return (null)
		}
	}

	RenderLoadingBackdrop = () => {
		return (
			<Backdrop
				sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={this.state.openLoadingBackdrop}
			>
				<CircularProgress color="inherit"/>
			</Backdrop>
		)
	}

	RenderConfirmCreatePost = () => {
		return(
			<Dialog open={this.state.openConfirmPostCreation} onClose={this.handleCloseCreatePost}>
				<DialogTitle>Are you sure you want to post this? You can't delete or edit your post after</DialogTitle>
				<Button color="success" type="submit" onClick={this.handleSubmit}>
					Yes
				</Button>
				<Button sx={{color: pink[500]}} onClick={this.handleCloseCreatePost}>
					No
				</Button>
			</Dialog>
		)
	}

	handleClickCreatePost = () => {
		this.setState({
			openConfirmPostCreation: true
		})
	}

	handleCloseCreatePost = () => {
		this.setState({
			openConfirmPostCreation: false
		})
	}

	handleOpenCreatePostDialog = () => {
		this.setState({
			openCreatePostDialog: true
		})
		this.getPostText()
	}

	handleCloseCreatePostDialog = (event) => {
		this.setState({
			openCreatePostDialog: false
		})
		this.savePostText(event)
		this.setState({
			isLoadSavedText: false
		})
	}

	savePostText = (event) => {
		event.preventDefault()
		const data = new FormData(document.getElementById("form"))
		fetch(ENV.url + "/post/save-post-text",
			{
				method: "POST",
				body: data,
				headers: {
					"X-CSRFToken": getCookie("csrftoken"),
			 		"Accept":"text/plain"
				}
			}
		)
		.then(res => res.text())
		.then(data => console.log(data))
	}

	getPostText = () => {
		fetch(ENV.url + '/post/get-saved-post-text',
			{
				method: "GET",
				headers: {
					"Accept": "text/plain",
					"Content-Type": "text/plain"
				}
			}
		)
		.then(res => res.text())
		.then(data => {
			console.log(data)
			this.setState({
				savedText: data,
				isLoadSavedText: true
			})
		})
	}

	RenderTextField = () => {
		if (!this.state.isLoadSavedText) {
			return (<p>Loading saved text</p>)
		} else {
			return (
				<TextField
					margin="normal"
					sx= {{ width: "100%"}}
					id="filled-multiline-static"
					label="Write your waffle"
					multiline
					fullWidth
					rows={3}
					color="secondary"
					variant="filled"
					name="text"
				    defaultValue={this.state.savedText}
				/>
			)
		}
	}

	getPublishedDateTime = () => {
		const d = new Date()
		let text = d.toLocaleString()
		return text
	}

	loadFile = (event) => {
		console.log('loadFile() called')
		const pathToPostImage = URL.createObjectURL(event.target.files[0]);

	    this.setState({
	    	pathToPostImage: pathToPostImage
	    })
  	};

  	RenderCardMedia = () => {
  		return (
  			<CardMedia
  				component="img"
		        image={this.state.pathToPostImage}
  			>
  			</CardMedia>
  		)
  	}

	RenderUploadImageButton = () => {
		return (
			<Tooltip title="Upload photo">
				<IconButton
					size="small"
					component="label"
					color="secondary"
					sx={{ mt: 1, mb: 1, marginRight: 10}}
					variant="contained"
					
				>
					<PhotoCamera/>
					<input hidden required accept="image/" type="file" name="post_image" id="post_image_input" onChange={event => this.loadFile(event)} />
				</IconButton>
			</Tooltip>
		)
	}

	render() {

		const RenderResponseMessage = this.RenderResponseMessage
		const RenderConfirmCreatePost = this.RenderConfirmCreatePost
		const RenderTextField = this.RenderTextField
		const RenderUploadImageButton = this.RenderUploadImageButton
		const RenderCardMedia = this.RenderCardMedia
		const RenderLoadingBackdrop = this.RenderLoadingBackdrop

		return (
			<div>
				<Tooltip title="Create post">
					<IconButton onClick={this.handleOpenCreatePostDialog}>
	              		<CreateOutlinedIcon sx={{color: "#000000"}}/>
	            	</IconButton>
	            </Tooltip>
				<Dialog open={this.state.openCreatePostDialog} onClose={this.handleCloseCreatePostDialog} scroll="body">
					<DialogTitle
    				sx={{display: 'flex',
					    justifyContent: 'space-between',
					    alignItems: 'center'}}>
    				Create your post
    					<Tooltip title="Close">
	    					<IconButton onClick={event => this.handleCloseCreatePostDialog(event)}>
								<CloseIcon/>
							</IconButton>
						</Tooltip>
    				</DialogTitle>
    				<DialogContent scroll="paper">
	   					<Card >
							<CardHeader avatar={
									<Avatar
										src={this.props.pathToProfileImage}
									>
									</Avatar>
								}
								title={this.props.username}
								subheader={this.getPublishedDateTime()}
								/>
								
								<Box component="form" noValidate id="form">
									<CSRFToken/>
									<RenderUploadImageButton/>
									<RenderCardMedia/>
									<RenderConfirmCreatePost/>
									<RenderTextField/>
									<CardActions>
									<Button
										fullWidth
										size="small"
										color="secondary"
										variant="contained"
									    sx={{ mt: 1, mb: 1}}
									    onClick={this.handleClickCreatePost}
									>
									Post
									</Button>
									</CardActions>
								</Box>
								<RenderResponseMessage/>
						</Card>
					</DialogContent>
					<RenderLoadingBackdrop/>
				</Dialog>
			</div>
			)
	}
}

export { CreatePost }

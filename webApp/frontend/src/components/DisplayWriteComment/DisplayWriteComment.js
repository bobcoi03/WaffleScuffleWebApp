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
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import { variables as ENV } from '../environmentVariables'

class DisplayWriteComment extends Component {
	constructor(props) {
		super(props)
		this.state = { userData: [], isLoaded: false, post_pk: this.props.post_pk, userHasLiked: false, pathToProfileImage: ""}
	}

	componentDidMount() {
		fetch(ENV.url + '/user-auth/get-user-object',
			{
				method: "GET",
				headers: {
					"Content-Type":"application/json",
					"Accept":"application/json"
				}
			}
		)
		.then(res => res.json())
		.then(data => {
			this.setState({
				userData: data[0],
				isLoaded: true
			})
			fetch(ENV.url + `/user-auth/get-path-to-profile-image-by-pk/${data[0].pk}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "text/plain",
						"Accept": "text/plain"
					}
				}
			)
			.then(res1 => res1.text())
			.then(resData => {
				console.log(resData)
				this.setState({
					pathToProfileImage: resData
				})
			})
		})
	}

	handleSubmitComment = () => {

		const data = new FormData(document.getElementById("commentPost"))

		fetch(ENV.url + `/post/create-comment/${this.props.post_pk}`,
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
		.then(resData => {
			alert(resData)
		})
	}

	getPublishedDateTime = () => {
		const d = new Date()
		let text = d.toLocaleString()
		return text
	}

	RenderAvatar = () => {
		if (this.state.pathToProfileImage == "") {
			return (
				<Avatar
					src={this.state.pathToProfileImage}
				>
				</Avatar>
			)
		} else {
			return (
				<Avatar
					src={this.state.pathToProfileImage}
				>
				</Avatar>
			)
		}
	}

	render() {

		const RenderAvatar = this.RenderAvatar

		if (!this.state.isLoaded) {
			return null
		} else {
			return (
				<div style={{width: '100%', marginTop:'7px'}}>
					<Card sx={{ width: '100%'}}>
						<CardHeader avatar={
							<RenderAvatar/>
						}
						title={this.state.userData['fields'].username}
						subheader={this.getPublishedDateTime()}
						/>
						<Box component="form" noValidate id="commentPost">
							<CSRFToken/>
							<TextField
								margin="normal"
								sx= {{ width: "100%"}}
								id="filled-multiline-static"
								label="Write your comment"
								multiline
								fullWidth
								rows={3}
								color="secondary"
								variant="filled"
								name="comment"
							>
							</TextField>
							<CardActions>
								<Button
									onClick={this.handleSubmitComment}
									size="small"
									color="secondary"
									variant="contained"
									sx={{ mt: 1, mb: 1, marginRight: 10}}
									endIcon={<SendIcon/>}
								>
									Comment
								</Button>
							</CardActions>
						</Box>
					</Card>
				</div>
			)
		}
	}
}

export { DisplayWriteComment }

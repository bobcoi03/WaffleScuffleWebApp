import React, {Component, Fragment} from "react"
import { render } from "react-dom"
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader'
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import { NavBar } from '../../NavBar/NavBar'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CSRFToken, getCookie } from '../../auth/csrftoken'
import { Copyright } from '../../Copyright/Copyright'
import { variables as ENV } from '../../environmentVariables'
import { validateEmail } from '../../UtilityFunctions/UtilityFunctions'
import { LoadingPage } from '../LoadingPage/LoadingPage'
import Tooltip from '@mui/material/Tooltip'
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import CreateIcon from '@mui/icons-material/Create';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import TextareaAutosize from '@mui/material/TextareaAutosize';


const theme = createTheme()

const color = "#000000"

class SettingsPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			userData: [],
			userExtendedData: [],
			error: null,
			saveChangesLoading: false,
			isLoaded: false,
			displayResponseMessage: false,
			responseMessage: "",
			pathToProfileImage: "",
			saveProfileImageButtonLoading: false,
			bioButtonLoading: false
		}
	}

	componentDidMount() {
		this.getUserObject()
		this.getUserExtendedObject()
		this.setState({
			isLoaded: true
		})
	}

	handleToggleResponseMessage = () => {
		if (this.state.displayResponseMessage) {
			this.setState({
				displayResponseMessage: false
			})
		} else {
			this.setState({
				displayResponseMessage: true
			})
		}
	}

	RenderResponseMessage = () => {
		  const action = (
		    <Fragment>
			      <IconButton
			        size="small"
			        aria-label="close"
			        color="inherit"
			        onClick={this.handleToggleResponseMessage}
			      >
			        <CloseIcon fontSize="small" />
			      </IconButton>
		    </Fragment>
		);
		if (this.state.displayResponseMessage) {
			return (
				<Snackbar
					open={this.state.displayResponseMessage}
					autoHideDuration={5000}
					onClose={this.handleToggleResponseMessage}
					message={this.state.responseMessage}
					action={action}
				>
				</Snackbar>
			)
		}
	}

	handleSaveChanges = async (event) => {

		this.setState({
			saveChangesLoading: true
		})

		event.preventDefault()
		const data = new FormData(document.getElementById("account-information"))

		await fetch(ENV.url + '/user-auth/save-changes',
			{
				method: "POST",
				body: data,
				headers: {
					"X-CSRFToken": getCookie("csrftoken"),
			 		'Accept':'text/plain',
				}
			}
		)
		.then(res => res.text())
		.then(data => {
			this.setState({
				responseMessage: data
			})
		})
		this.getUserObject()
		this.handleToggleResponseMessage()
		this.setState({
			saveChangesLoading: false
		})
	}

	getUserObject = () => {
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
			fetch(ENV.url + `/user-auth/get-path-to-profile-image-by-pk/${data[0].pk}`,
				{
					headers: {
						"method": "GET",
						"Accept": "text/plain",
						"Content-Type": "text/plain"
					}
				}
			)
			.then(res => res.text())
			.then(data1 => {
				this.setState({
					pathToProfileImage: data1,
				})
			},
			error => {
				this.setState({
					error: error,
				})
			})
			this.setState({
				userData: data[0],
		});
		},
		(error) => {
			this.setState({
				error: error,
			})
		})
	}

	getUserExtendedObject = () => {
		fetch(ENV.url + '/user-auth/get-user-extended-object',
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
			})
		},
		error => {
			this.setState({
				error: error,
			})
		})
	}

	RenderProfileImage = () => {
		if (this.state.pathToProfileImage == "") {
			return (
				<Avatar
					sx={{ width: 100, height: 100}}
				>
				</Avatar>
			)
		} else if (this.state.userData['fields']) {
			return (
				<Avatar
					sx={{ width: 100, height: 100}}
					src={this.state.pathToProfileImage}
				>
				</Avatar>
			)
		}
	}

	handleUploadProfileImage = async (event) => {
		this.setState({
			saveProfileImageButtonLoading: true
		})

		event.preventDefault()
		const data = new FormData(document.getElementById("profile_picture"))
		await fetch(ENV.url + '/user-auth/upload-profile-picture',
			{
				method: "POST",
				body: data,
				headers: {
					"X-CSRFToken": getCookie("csrftoken"),
			 		"Accept": "text/plain"
				}
			}
		)
		.then(res => res.text())
		.then(resData => {
			alert(resData)
		})

		this.setState({
			saveProfileImageButtonLoading: false
		})
	}

	loadFile = (event) => {
		console.log('loadFile() called')
		const pathToProfileImage= URL.createObjectURL(event.target.files[0]);

	    this.setState({
	    	pathToProfileImage: pathToProfileImage
	    })
  	};

	RenderUploadProfileImageButton = () => {
		return (
			<Button
				size="small"
				component="label"
				sx={{ mt: 3, mb: 1, marginLeft: '6px'}}
				variant="contained"
				endIcon={<PhotoCamera/>}
			>
				<input hidden required accept="image/" type="file" name="profile_image" id="profile_image_input" onChange={event => this.loadFile(event)} />
			Upload Picture
			</Button>
		)
	}

	RenderSaveProfileImageButton = () => {
		if (this.state.saveProfileImageButtonLoading == false) {
			return (
				<Button
					size="small"
					sx={{ mt: 3, mb: 1, marginLeft: '6px'}}
				   	variant="contained"
				    onClick={event => this.handleUploadProfileImage(event)}
				>
		       		Save as Profile Picture
		      	</Button>
			)
		} else {
			return (
				<LoadingButton
						size="small"
		        loading
			      sx={{ mt: 3, mb: 1 , marginLeft: '6px'}}
					  variant="contained"
					>
		      Save as Profile picture
	      </LoadingButton>
			)
		}
	}

	RenderSaveChangesButton = () => {
		if (this.state.saveChangesLoading) {
			return (
				<LoadingButton
					size="small"
	              	loading
		         	sx={{ mt: 1, mb: 1 , marginLeft: '6px'}}
				    variant="contained"
				>
	       			Save changes
	      		</LoadingButton>
			)
		} else {
			return (
				<Button
					size="small"
					sx={{ mt: 1, mb: 1, marginLeft: '6px'}}
				    variant="contained"
				    onClick={event => this.handleSaveChanges(event)}
				>
	       	Save changes
	      </Button>
			)
		}
	}

	handleChangeBio = () => {
		this.setState({
			bioButtonLoading: true
		})
		const data = new FormData(document.getElementById("bio_form"))
		fetch(ENV.url + '/user-auth/change-bio',
			{
				method: "POST",
				body: data,
				headers: {
					"X-CSRFToken": getCookie("csrftoken"),
			 		"Accept": "text/plain"
				}
			}
		)
		.then(res => res.text())
		.then(data => {
			this.setState({
				responseMessage: data,
				displayResponseMessage: true,
				bioButtonLoading: false
			})
		})
	}

	render() {

		const RenderSaveChangesButton = this.RenderSaveChangesButton
		const RenderResponseMessage = this.RenderResponseMessage
		const RenderUploadProfileImageButton = this.RenderUploadProfileImageButton
		const RenderProfileImage = this.RenderProfileImage
		const RenderSaveProfileImageButton = this.RenderSaveProfileImageButton
		const { userData, userExtendedData } = this.state

		if (!this.state.isLoaded) {
			return (
				<LoadingPage/>
			)
		} else if (userData['fields'] != undefined && userExtendedData['fields'] != undefined) {
			return(
			<div>
				<RenderResponseMessage/>
				<ThemeProvider theme={theme}>
					<NavBar username={userData['fields'].username} user_pk={userData.pk}/>
					<Grid container spacing={3} component="main" sx={{ height:'100vh'}}>
						<Grid
							item
			          		xs={false}
			          		sm={3}
			          		md={3}
						/>
						<Grid
							item
							xs={12}
							sm={6}
							md={6}
							sx={{
					            display: 'flex',
					            flexDirection: 'column',
					            alignItems: 'flex-start'
							}}
						>
							<div>
								<Card sx={{boxShadow: 'none', background: 'transparent'}} variant="outlined">
									<CardHeader
										title="Account information"
									/>
									<CardActions>
										<Box component="form" noValidate id="account-information">
											<CSRFToken/>
											<Grid container spacing={2}>
												<Grid item xs={12} sm={6}>
													<TextField
													margin="normal"
												    name="firstName"
												    label="First name"
												    defaultValue={userData['fields'].first_name}
												    />
												</Grid>
												<Grid item xs={12} sm={6}>
												    <TextField
													margin="normal"
												    name="lastName"
												    label="Last name"
												    defaultValue={userData['fields'].last_name}
												    />
												</Grid>
												<Grid item xs={12} sm={6}>
												    <TextField
													margin="normal"
												    name="username"
												    label="Username"
												    defaultValue={userData['fields'].username}
												    />
											    </Grid>
											    <Grid item xs={12} sm={6}>
												    <TextField
													margin="normal"
												    name="email"
												    label="Email"
												    defaultValue={userData['fields'].email}
												    />
											    </Grid>
											    <Grid item xs={12} sm={6}>
											    	<RenderSaveChangesButton/>
												</Grid>
										    </Grid>
										</Box>
									</CardActions>
								</Card>
								<Card sx={{ marginTop: '5px', boxShadow: 'none', background: 'transparent'}} variant="outlined">
									<CardHeader
										title="Profile Picture"
									/>
									<CardActions>
										<Box component="form" noValidate id="profile_picture">
											<Grid item xs={12} sm={12}>
												<CSRFToken/>
												<RenderProfileImage/>
												<RenderUploadProfileImageButton/>
												<RenderSaveProfileImageButton/>
											</Grid>
										</Box>
									</CardActions>
								</Card>
								<Card sx={{ marginTop: '5px', boxShadow: 'none', background: 'transparent'}} variant="outlined">
									<CardHeader
										title="Bio"
									>
									</CardHeader>
									<CardActions>
										<Box component="form" id="bio_form">
											<CSRFToken/>
											<Grid item xs={12} sm={12}>
												<TextField
													margin="normal"
												    name="bio_text"
												    label="Bio"
												    multiline
												    rows={3}
												    defaultValue={userExtendedData['fields'].bio}
												/>					
											</Grid>
											<Grid item xs={12} sm={12}>
												<LoadingButton
													sx={{ mt: 3, mb: 1 , marginLeft: '6px'}}
													variant="contained"
													loading={this.bioButtonLoading}
													onClick={this.handleChangeBio}
													size="small"
												>
													Save bio
												</LoadingButton>
											</Grid>
										</Box>
									</CardActions>
								</Card>
								</div>
						</Grid>
					<Grid
							item
							xs={false}
							sm={3}
							md={3}
					/>
				</Grid>
			</ThemeProvider>
		</div>
		)
		}
	}
}

export { SettingsPage }

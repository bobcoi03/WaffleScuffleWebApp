import React, {Component} from "react"
import { render } from "react-dom"
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import LoadingButton from '@mui/lab/LoadingButton';

import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CSRFToken, getCookie } from '../../auth/csrftoken'
import { Copyright } from '../../Copyright/Copyright'
import { variables as ENV } from '../../environmentVariables'
import { validateEmail } from '../../UtilityFunctions/UtilityFunctions'


const theme = createTheme()

class SignUpPage extends Component{
	constructor(props) {
		super(props)
		this.state = { responseMessage : '', signUpButtonLoading: false}
	}

	handleSubmit = async (event) => {
		/*
		Sends POST with FormData : username, email, password
		*/
		this.setState({
			signUpButtonLoading: true
		})
		event.preventDefault();
   		const data = new FormData(event.currentTarget);
   		var responseMessage;

   		if (data.get('firstName').length == 0) {
   			this.setState({
   				responseMessage: "Please enter your first name"
   			})
   		} else if (data.get('lastName').length == 0) {
   			this.setState({
   				responseMessage: "Please enter your last name"
   			})
   		} else if (data.get('email').length == 0) {
   			this.setState({
   				responseMessage: "Please enter your email"
   			})
   		} else if (data.get('username').length == 0) {
   			this.setState({
   				responseMessage: "Please enter your username"
   			})
   		} else if (data.get('password').length == 0) {
   			this.setState({
   				responseMessage: "Please enter your password"
   			})
   		} else if (data.get('password').length < 8) {
   			this.setState({
   				responseMessage: "Please enter a password that is longer than 8 characters"
   			})
   		}
   		else if (validateEmail(data.get('email'))) {
   			await fetch(ENV.url + "/user-auth/create-user",
   			 	{ 	method: "POST",
   			 			body: data,
   			 			headers: {
							"X-CSRF-Token": getCookie("csrftoken"),
			 				"X-CSRFToken": getCookie("csrftoken"),
			 				'Accept':'text/plain',
			 			}
   			 	}
	   		)
	   		.then(res => res.text())
	   		.then(resData => {
	   			responseMessage = resData
	   		})

	   		this.setState({
				responseMessage: responseMessage
			})

	   		if (responseMessage == "successfully created user") {
	   			window.location.href = '/signin'
	   		}
   		} else {
   			this.setState({
   				responseMessage: "Email is not valid"
   			})
   		}
   		this.setState({
   			signUpButtonLoading: false
   		})
	}

	RenderResponseMessage = () => {
		// Renders Response messsage after making POST request
		if (this.state.responseMessage == 'successfully created user') {
			return (
				<Grid item xs={12} sm={12}>
					<Alert severity="success">{this.state.responseMessage}</Alert>
		        </Grid>
			)
		} else if (this.state.responseMessage != '') {
			return (
				<Grid item xs={12} sm={12}>
					<Alert severity="warning">{this.state.responseMessage}</Alert>
		        </Grid>
			)
		}
		else {
			return (null)
		}
	}

	RenderSignUpButton = () => {
		if (this.state.signUpButtonLoading == false) {
			return (
				<Button
			        type="submit"
			        fullWidth
			        variant="contained"
			        color="secondary"
			        sx={{ mt: 3, mb: 2 }}
			    >
			        Sign Up
			    </Button>
		    )
		} else {
			return(
				<LoadingButton
	              	loading
				    fullWidth
		         	sx={{ mt: 3, mb: 2 }}
				    variant="contained"
				    color="secondary"
				>
	       			Sign Up
	      		</LoadingButton>
      		)
		}
	}

	render() {
		const RenderResponseMessage = this.RenderResponseMessage
		const RenderSignUpButton = this.RenderSignUpButton

		return (
			<ThemeProvider theme={theme}>
		      <Container component="main" maxWidth="xs">
		        <CssBaseline />
		        <Box
		          sx={{
		            marginTop: 8,
		            display: 'flex',
		            flexDirection: 'column',
		            alignItems: 'center',
		          }}
		        >
		          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
		            <LockOutlinedIcon />
		          </Avatar>
		          <Typography component="h1" variant="h5">
		            Sign up
		          </Typography>
		          <Box component="form" noValidate onSubmit={event => this.handleSubmit(event)} sx={{ mt: 3 }}>
		          	<CSRFToken csrftoken={getCookie('csrftoken')}/>
		            <Grid container spacing={2}>
		              <RenderResponseMessage/>
		              <Grid item xs={12} sm={6}>
		                <TextField
		                  autoComplete="given-name"
		                  name="firstName"
		                  required
		                  fullWidth
		                  id="firstName"
		                  label="First Name"
		                  autoFocus
		                />
		              </Grid>
		              <Grid item xs={12} sm={6}>
		                <TextField
		                  required
		                  fullWidth
		                  id="lastName"
		                  label="Last Name"
		                  name="lastName"
		                  autoComplete="family-name"
		                />
		              </Grid>
		              <Grid item xs={12}>
		                <TextField
		                  required
		                  fullWidth
		                  id="email"
		                  label="Email Address"
		                  name="email"
		                  autoComplete="email"
		                />
		              </Grid>
		              <Grid item xs={12}>
		                <TextField
		                  required
		                  fullWidth
		                  id="username"
		                  label="Username"
		                  name="username"
		                  autoComplete="username"
		                />
		              </Grid>
		              <Grid item xs={12}>
		                <TextField
		                  required
		                  fullWidth
		                  name="password"
		                  label="Password"
		                  type="password"
		                  id="password"
		                  autoComplete="new-password"
		                />
		              </Grid>
		            </Grid>
		            <RenderSignUpButton/>
		            <Grid container justifyContent="flex-end">
		              <Grid item>
		                <Link href="/signin" variant="body2">
		                  Already have an account? Sign in
		                </Link>
		              </Grid>
		            </Grid>
		          </Box>
		        </Box>
		        <Copyright sx={{ mt: 5 }} href="/" name="WaffleScuffle"/>
		    </Container>
		</ThemeProvider>
    )
	}
}

export { SignUpPage };

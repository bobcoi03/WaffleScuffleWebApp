import React, {Component} from "react"
import { render } from "react-dom"
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CSRFToken, getCookie } from '../../auth/csrftoken'
import { Copyright } from '../../Copyright/Copyright'
import { variables as ENV } from '../../environmentVariables'
import { validateEmail } from '../../UtilityFunctions/UtilityFunctions'
import { Navigate } from "react-router-dom";

const theme = createTheme()

class SignInPage extends Component{
	constructor(props) {
		super(props)
		this.state = { responseMessage: '', signInButtonLoading: false, signedIn: false, csrftoken: getCookie('csrftoken')}
	}

	handleSubmit = async (event) => {
		this.setState({
			signInButtonLoading: true
		})
		event.preventDefault()

		const data = new FormData(event.currentTarget)
		var msg
		// if field is empty
		if (data.get('email').length == 0) {
			this.setState({
				responseMessage: "Please enter your email"
			})
		} else if (data.get('password').length == 0) {
			this.setState({
				responseMessage: "Please enter your password"
			})
		} else if (validateEmail(data.get('email'))) {
			await fetch ('/user-auth/signin',
						{	method: "POST",
							body: data,
							headers: {
								"X-CSRF-Token": getCookie("csrftoken"),
								"X-CSRFToken": getCookie("csrftoken"),
			 					'Accept':'text/plain',
							},
						}
			)
			.then(res => res.text())
			.then(resData => {
				msg = resData
				this.setState({
					responseMessage: msg
				})
			},
			(error) => {
				this.setState({
					responseMessage: error
				})
			})
			if (msg == `successfully signed in`) {
				this.setState({
					signedIn: true
				})
			}
		}
		// Checks if email is valid
		else {
			// if email not valid
			this.setState({
				responseMessage: "Email is not valid"
			})
		}
		this.setState({
			signInButtonLoading: false
		})
	}

	RenderResponseMessage = () => {
		// Renders Response messsage after making POST request
		if (this.state.responseMessage == 'successfully signed in') {
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

	RenderSignInButton = () => {
		if (this.state.signInButtonLoading == false) {
			return (
				<Button
				    type="submit"
				    fullWidth
				    variant="contained"
				    sx={{ mt: 3, mb: 2 }}
				    color="secondary"
				>
				    Sign In
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
	       			Sign In
	      		</LoadingButton>
      		)
		}
	}

	render() {

		const RenderResponseMessage = this.RenderResponseMessage
		const RenderSignInButton = this.RenderSignInButton

		if (this.state.signedIn) {
			return (
				<Navigate to="/" replace={false}/>
			)
		} else {

		return (
			    <ThemeProvider theme={theme}>
			      <Grid container component="main" sx={{ height: '100vh' }}>
			        <CssBaseline />
			        <Grid
			          item
			          xs={false}
			          sm={4}
			          md={7}
			          sx={{
			            backgroundImage: 'url(https://source.unsplash.com/random)',
			            backgroundRepeat: 'no-repeat',
			            backgroundColor: (t) =>
			              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
			            backgroundSize: 'cover',
			            backgroundPosition: 'center',
			          }}
			        />
			        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
			          <Box
			            sx={{
			              my: 8,
			              mx: 4,
			              display: 'flex',
			              flexDirection: 'column',
			              alignItems: 'center',
			            }}
			          >
			            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
			              <LockOutlinedIcon />
			            </Avatar>
			            <Typography component="h1" variant="h5">
			              Sign in
			            </Typography>
			            <Box component="form" noValidate onSubmit={event => this.handleSubmit(event)} sx={{ mt: 1 }}>
			            	<CSRFToken csrftoken={getCookie('csrftoken')}/>
			              <RenderResponseMessage/>
			              <TextField
			                margin="normal"
			                required
			                fullWidth
			                id="email"
			                label="Email Address"
			                name="email"
			                autoComplete="email"
			                autoFocus
			              />
			              <TextField
			                margin="normal"
			                required
			                fullWidth
			                name="password"
			                label="Password"
			                type="password"
			                id="password"
			                autoComplete="current-password"
			              />
			              <RenderSignInButton/>
			              <Grid container>
			                <Grid item xs>
			                  <Link href="/forgot-password" variant="body2">
			                    Forgot password?
			                  </Link>
			                </Grid>
			                <Grid item>
			                  <Link href="/signup" variant="body2">
			                    {"Don't have an account? Sign Up"}
			                  </Link>
			                </Grid>
			              </Grid>
			              <Copyright sx={{ mt: 5 }} href="/" name="WaffleScuffle"/>
			            </Box>
			          </Box>
			        </Grid>
			      </Grid>
			    </ThemeProvider>
		)
		}
	}
}

export { SignInPage }

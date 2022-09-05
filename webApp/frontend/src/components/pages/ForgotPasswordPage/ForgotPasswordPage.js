import React, {Component} from "react"
import { render } from "react-dom"
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import IconButton from '@mui/material/IconButton';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import LinkMaterial from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { CSRFToken, getCookie } from '../../auth/csrftoken'
import { Copyright } from '../../Copyright/Copyright'
import { variables as ENV } from '../../environmentVariables'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

const theme = createTheme()
import { Link } from 'react-router-dom';

class ForgotPasswordPage extends Component {
	constructor(props) {
		super(props)
		this.state = { sendButtonLoading: false, sendEmailSuccess: false, responseMessage: ''}
		//this.state = { isLoaded: false,  userData: [], error: null,}
	}

	RenderSendButton = () => {
			return (
				<LoadingButton
					type="submit"
					loading={this.state.sendButtonLoading}
					fullWidth
					variant="contained"
					color="secondary"
					sx={{ mt: 3, mb: 2 }}
				>
					Send
				</LoadingButton>
			)
	}

	handleSubmit = async (event) => {

		this.setState({
			sendButtonLoading: true
		})

		event.preventDefault()
		const data = new FormData(event.currentTarget);
			var responseMessage;
			await fetch(ENV.url + '/mail-service-api/send-password-reset-email',
							{ 	method: "POST",
								body: data,
								headers: {
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
			sendButtonLoading: false,
			responseMessage: responseMessage
		})
	}

	RenderResponseMessage = () => {
		if (this.state.responseMessage == '') {
			return null
		} else if (this.state.responseMessage == 'Successfully sent reset password email') {
			return (
				<Grid item xs={12} sm={12}>
					<Alert severity="success">{this.state.responseMessage}</Alert>
				</Grid>
			)
		} else {
			return (
				<Grid item xs={12} sm={12}>
					<Alert severity="warning">{this.state.responseMessage}</Alert>
				</Grid>
			)
		}
	}

	render() {
		const RenderSendButton = this.RenderSendButton
		const ResponseMessage = this.RenderResponseMessage

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
			            Forgot password
			          </Typography>
								<ResponseMessage/>
			          <Box component="form" noValidate onSubmit={this.handleSubmit} sx={{ mt: 1 }}>
									<CSRFToken/>
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
			              <RenderSendButton/>
			          </Box>
			        </Box>
			        <Grid>
								<Typography align="center">
									<LinkMaterial component={Link} to="/signin">
										 Back to Sign in page
									</LinkMaterial>
								</Typography>
							</Grid>
		       </Container>
		    </ThemeProvider>
		)
	}
}

export { ForgotPasswordPage }

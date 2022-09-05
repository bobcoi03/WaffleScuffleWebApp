import React, {Component} from "react"
import { render } from "react-dom"
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
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

const theme = createTheme()

class DeleteUserPage extends Component{
	constructor(props) {
		super(props)
		this.state = { responseMessage: ''}
	}

	handleDelete = () => {
		// When delete button is pressed, sends a DELETE http req to server.
		// No need to send any data because Django knows User through request.user
		fetch("http://127.0.0.1:8000/user-auth/delete-user", 
				{
					"method":"delete",
					headers: {
						"X-CSRFToken": getCookie("csrftoken"),
			 			'Accept':'text/plain',
					},
				}
		)
		.then(res => res.text())
		.then(data => this.setState({
			responseMessage: data
		}), (error) => {
			this.setState({
				responseMessage: error
			})
		})
	}

	RenderResponseMessage = () => {
		// Renders Response messsage after making POST request
		if (this.state.responseMessage == 'successfully deleted user') {
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

	render() {

		const RenderResponseMessage = this.RenderResponseMessage

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
			            textAlign: 'center',
			          }}
			        >
			          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
			            <LockOutlinedIcon />
			          </Avatar>
			          <Typography component="h6" variant="h6">
			            Delete Account
			          </Typography>
			          <RenderResponseMessage/>
			          <Button
			          	onClick={this.handleDelete}
			            fullWidth
			            variant="contained"
			            color="error"
			            sx={{ mt: 3, mb: 2 }}
			            id="delete-button"
			          >
			          Delete
			          </Button>
			        </Box>
			  </Container>
		</ThemeProvider>
		)
	}
}

export { DeleteUserPage }
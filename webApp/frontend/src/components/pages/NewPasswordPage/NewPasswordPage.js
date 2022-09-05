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
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { CSRFToken, getCookie } from '../../auth/csrftoken'
import { Copyright } from '../../Copyright/Copyright'
import { withParams } from '../../UtilityFunctions/UtilityFunctions'

const theme = createTheme()

class NewPasswordPage extends Component {
	constructor(props) {
		super(props)
		//this.state = { isLoaded: false,  userData: [], error: null,}
	}
	render() {

		async function handleSubmit(event) {
			event.preventDefault()
			fetch ('/user-auth/signin',
						{	method: "POST",
							body: data,
							headers: {
								"X-CSRF-Token": getCookie("csrftoken"),
								"X-CSRFToken": getCookie("csrftoken"),
			 					'Accept':'text/plain',
							},
						}
			)
		}

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
			            Set new password
			          </Typography>
			          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
			            <TextField
			                margin="normal"
			                required
			                fullWidth
			                name="confirm-password"
			                label="Confirm Password"
			                type="password"
			                id="confirm-password"
			                autoComplete="current-password"
			            />
			            <Button
			                type="submit"
			                fullWidth
			                variant="contained"
			                sx={{ mt: 3, mb: 2 }}
			            >
			            Set
			            </Button>
			          </Box>
			        </Box>
			        <Copyright sx={{ mt: 5 }} href="/" name="Bobcoi03.com"/>
		       </Container>
		    </ThemeProvider>
		)
	}
}

export default withParams(NewPasswordPage)
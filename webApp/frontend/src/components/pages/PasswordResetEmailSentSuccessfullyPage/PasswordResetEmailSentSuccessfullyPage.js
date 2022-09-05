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

const theme = createTheme()

class PasswordResetEmailSentSuccessfullyPage extends Component {
	constructor(props) {
		super(props)
	}
	render() {
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
			            Password reset email sent successfully to XXX@email.com
			          </Typography>
			        </Box>
			  </Container>
		</ThemeProvider>
		)
	}

}

export { PasswordResetEmailSentSuccessfullyPage }
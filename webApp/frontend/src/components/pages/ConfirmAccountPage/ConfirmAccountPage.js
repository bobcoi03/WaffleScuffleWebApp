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

class ConfirmAccountPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			
		}
	}

	componentDidMount() {
		// Make A POST request confirming account
		fetch(ENV.url + `/user-auth/`)

	}



	render() {
		return (
			null
		)
	}
}
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
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CSRFToken, getCookie } from '../../auth/csrftoken'
import { LoadingPage } from '../LoadingPage/LoadingPage'
import { NavBar } from '../../NavBar/NavBar'

class CreatePostPage extends Component {
	constructor(props) {
		super(props)
	}
	render() {
		return (
			<div>
				<NavBar/>
				Create post page
			</div>
		)
	}
}

export { CreatePostPage }
import React, {Component} from "react"
import { render } from "react-dom"
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader'
import { variables as ENV } from '../environmentVariables'

class DisplayPostMenu extends Component {
	constructor(props){
		super(props)
	}
	render() {
		return(
			<div style={{width: '100%', marginTop: '5px', maxWidth: ENV.maxWidthDisplayPost}}>
				<Card sx={{ width: '100%'}} variant="outlined">
					<CardActions>
						<Button variant={this.props.newVariant} size="small" component={Link} to={this.props.newTo} color="secondary">
							New
						</Button>
						<Button variant={this.props.bestVariant} size="small" component={Link} to={this.props.bestTo} color="secondary">
							Best
						</Button>
					</CardActions>
				</Card>
			</div>
		)
	}
}

export default DisplayPostMenu

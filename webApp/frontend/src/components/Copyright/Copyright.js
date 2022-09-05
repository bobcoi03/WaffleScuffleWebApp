import React, {Component} from "react"
import { render } from "react-dom"
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

class Copyright extends Component{
	constructor(props) {
		super(props)
	} 
	render() {
		return (
		    <Typography variant="body2" color="text.secondary" align="center" {...this.props}>
		      {'Copyright © '}
		      <Link color="inherit" href={this.props.href}>
		        {this.props.name}
		      </Link>{' '}
		      {new Date().getFullYear()}
		      {'.'}
		    </Typography>
  		)
  	}
}

export { Copyright }
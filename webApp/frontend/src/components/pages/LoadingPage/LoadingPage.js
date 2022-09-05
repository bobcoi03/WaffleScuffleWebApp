import React, {Component} from "react"
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'


class LoadingPage extends Component {
	constructor(props){
		super(props)
	}
	render() {
		return (
			<Grid container spacing={0} directon="column"alignItems="center" justifyContent="center"style={{ minHeight: '100vh'}}>
				<Grid item xs={1}>	
					<CircularProgress color="inherit"/>
				</Grid>
			</Grid>
		)
	}
}

export { LoadingPage }
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

class SmallSearchBar extends React.Component {
	constructor(props) {
		super(props)
		this.state = {searchBarLabel: 'Find friends'}
	}

	componentDidMount() {

	}

	handleInputChange = () => {
	}

	render() {
		return (
			<Box component="form">
				<TextField
					size="small"
					style={{ 	backgroundColor: '#f5f5f5',
								borderRadius: '5px',
					}}
					InputLabelProps={{
					    shrink: false
					}}
					id="input-with-icon-textfield"
					variant="outlined"
					label={this.state.searchBarLabel}
					onChange={this.handleInputChange}
					color="secondary"
					autoComplete	
					InputProps={{
			          endAdornment: (
			            <InputAdornment position="end">
			            	<IconButton>
			              		<SearchIcon/>
			              	</IconButton>
			            </InputAdornment>
			          )
			        }}
				>
				</TextField>
			</Box>
		)
	}
}
export default SmallSearchBar
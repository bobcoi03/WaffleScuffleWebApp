import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemIcon from '@mui/material/ListItemIcon';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom';
import DisplayProfile from '../DisplayProfile/DisplayProfile'
import { variables as ENV } from '../environmentVariables'
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';


class SearchBar extends React.Component {
	constructor(props) {
		super(props)
		this.state = {	searchBarValue: '',
						anchorEl: null,
						toggleDrawer: false,
						searchData: [],
						openSearchDialog: false,
						searchBarWidth: 0
		}
	}

	componentDidMount() {

	}

	handleInputChange = (event) => {
		this.setState({
			toggleDrawer: true,
			searchBarValue: event.target.value,
			anchorEl: event.currentTarget,
			searchBarWidth: event.currentTarget.offsetWidth
		})

		if (event.target.value != '') {
			fetch(ENV.url + `/user-auth/search-username/query=${event.target.value}`,
				{
					headers: {
						"method":"GET",
						"Accept": "application/json",
						"Content-Type": "application/json"
					}
				}
			)
			.then(res => res.json())
			.then(data => {
				this.setState({
					searchData: data
				})
			})
		}
	}

	RenderSearchMenu = () => {
		const { searchData } = this.state
		var users = []
		for (var i = 0; i < searchData.length; i++) {
			users.push(
				<ListItem>
					<DisplayProfile
					pk={searchData[i].pk}
					username={searchData[i]['fields'].username}
					/>
				</ListItem>
			)
		}
		return (
			<List style={{ width: this.state.searchBarWidth }}>
				{users}
			</List>
		)
	}

	toggleDrawer = () => {
		if (this.state.toggleDrawer) {
			this.setState({
				toggleDrawer: false
			})
		} else {
			this.setState({
				toggleDrawer: true
			})
		}
	}

	handleCloseSearchMenu = () => {
		this.setState({
			anchorEl: null,
			toggleDrawer: false
		})
	}

	handleToggleOpenSearchDialog = () => {
		if (this.state.openSearchDialog) {
			this.setState({
				openSearchDialog: false
			})
		} else {
			this.setState({
				openSearchDialog: true
			})
		}
	}

	render() {
		const RenderSearchMenu = this.RenderSearchMenu
		const id = this.state.toggleDrawer ? 'simple-popover' : undefined

		return (
			<div>
				<Tooltip title="Find friends">
					<IconButton onClick={this.handleToggleOpenSearchDialog}>
						<SearchIcon sx={{color: "#000000"}}/>
					</IconButton>
				</Tooltip>
				<Dialog open={this.state.openSearchDialog} onClose={this.handleToggleOpenSearchDialog}>
					<DialogContent>
						<Box component="form" id="search_form">
							<TextField
								size="small"
								style={{ 	backgroundColor: '#f5f5f5',
											borderRadius: '5px',
								}}
								InputLabelProps={{
								    shrink: false
								}}
								id={id}
								variant="outlined"
								label={this.state.searchBarValue === "" ? "Find friends": ""}
								onChange={this.handleInputChange}
								value={this.state.searchBarValue}
								color="secondary"
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
							<Popover
			                  id={id}
			                  open={this.state.toggleDrawer}
			                  anchorEl={this.state.anchorEl}
			                  onClose={this.handleCloseSearchMenu}
							  anchorOrigin={{
								 vertical: 'bottom',
								 horizontal: 'left',
							  }}
							  transformOrigin={{
								 vertical: 'top',
								 horizontal: 'left',
							  }}
			                  disableAutoFocus={true}
			 				  disableEnforceFocus={true}
			                >
			                  <RenderSearchMenu/>
			                </Popover>
						</Box>
					</DialogContent>
				</Dialog>
			</div>
		)
	}
}
export default SearchBar
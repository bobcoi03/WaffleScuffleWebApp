import React, {Component} from "react"
import { render } from "react-dom"
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CSRFToken, getCookie } from '../../auth/csrftoken'
import { Copyright } from '../../Copyright/Copyright'
import { LoadingPage } from '../LoadingPage/LoadingPage'
import { NavBar } from '../../NavBar/NavBar'
import { NavBarSignedOut } from '../../NavBar/NavBarSignedOut'
import { variables as ENV } from '../../environmentVariables'
import { CreatePost } from '../../CreatePost/CreatePost'
import { DisplayPost } from '../../DisplayPost/DisplayPost'
import { DisplayComment } from '../../DisplayComment/DisplayComment'
import DisplayPostMenu from '../../DisplayPostMenu/DisplayPostMenu'
import { withParams } from '../../UtilityFunctions/UtilityFunctions'

const theme = createTheme()

class ProfilePageSortByNew extends Component{
	constructor(props) {
		super(props)
		this.state = { isLoaded: false,  userData: [], error: null, postData: []}
	}
	componentDidMount() {
		// If this.props.params.url == 'new'
		// fetch from /post/get-post-objects-by-published-datetime
		// if this.props.params.url == 'best'
		// fetch from /post/get-post-objects-by-likes

		fetch(ENV.url + '/user-auth/get-user-object',
			{
				headers: {
					"method": "GET",
					"Accept":"application/json",
					"Content-Type":"application/json"
				}
			})
			.then(res => res.json())
			.then((data) => {
				this.setState({
					userData: data[0],
				});
			},
			(error) => {
				this.setState({
					error: error,
					isLoaded: true
				})
			}
		)

		fetch(ENV.url + `/post/get-post-objects-by-user-username-sort-by-new/${this.props.params.username}`,
			{
				headers: {
					"method": "GET",
					"Accept": "application/json",
					"Content-Type": "application/json"
				}
			}
		)
		.then(res => res.json())
		.then(data => {
			this.setState({
				postData: data,
				isLoaded: true
			})
		})
	}

	DisplayPostList = () => {
		const { postData } = this.state
		var posts = []
		for (var i = 0; i < postData.length; i++) {
			posts.push(<DisplayPost
				text={postData[i]['fields'].text}
				likes={postData[i]['fields'].likes}
				publishedDatetime={postData[i]['fields'].published_datetime}
				shares={postData[i]['fields'].shares}
				url={postData[i]['fields'].url}
				user={postData[i]['fields'].user}
				key={i}
				pk={postData[i].pk}
			/>)
		}
		return (
			<div style={{width: '100%'}}>
				{posts}
			</div>
		)
	}

	render() {

		const { error, isLoaded, userData, postData } = this.state
		const DisplayPostList = this.DisplayPostList

		if (!isLoaded) {
			return (<LoadingPage/>)
		} else if (userData['fields'] == undefined) {
			return (
				<div>
					<ThemeProvider theme={theme}>
						<NavBarSignedOut/>
						<Grid container spacing={3} component="main" sx={{ height:'100vh'}}>
							<Grid
								item
				          		xs={0}
				          		sm={3}
				          		md={3}
							>
							</Grid>
							<Grid
								item
								xs={12}
								sm={6}
								md={5}
								sx={{
						            display: 'flex',
						            flexDirection: 'column',
						            alignItems: 'center',
								}}
							>
								<DisplayPostList/>
							</Grid>
							<Grid
								item
								xs={0}
								sm={3}
								md={3}
							/>
						</Grid>
					</ThemeProvider>
				</div>
			)
		}
		else if (postData.length == 0) {
			return (
				<div>
					<ThemeProvider theme={theme}>
						<NavBar/>
						<Grid container spacing={3} component="main" sx={{ height:'100vh'}}>
							<Grids
								item
				          		xs={false}
				          		sm={3}
				          		md={3}
							/>
							<Grid
								item
								xs={12}
								sm={6}
								md={6}
								sx={{
						            display: 'flex',
						            flexDirection: 'column',
						            alignItems: 'center'
								}}
							>
								<Typography>no posts to show</Typography>
							</Grid>
							<Grid
								item
								xs={false}
								sm={3}
								md={3}
							/>
						</Grid>
					</ThemeProvider>
				</div>
			)
			//
		} else if (postData.length > 0 && isLoaded && userData['fields'] != undefined) {
			return (
				<div>
					<ThemeProvider theme={theme}>
						<NavBar username={userData['fields'].username} user_pk={userData.pk}/>
						<Grid container spacing={3} component="main" sx={{ height:'100vh'}}>
							<Grid
								item
				          		xs={0}
				          		sm={3}
				          		md={3}
							>
							</Grid>
							<Grid
								item
								xs={12}
								sm={6}
								md={4}
								sx={{
						            display: 'flex',
						            flexDirection: 'column',
						            alignItems: 'center',
								}}
							>
								<DisplayPostMenu newTo={`/user/${userData['fields'].username}/new`} bestTo={`/user/${userData['fields'].username}/`} bestVariant="outlined" newVariant="contained"/>
								<DisplayPostList/>
							</Grid>
							<Grid
								item
								xs={0}
								sm={3}
								md={3}
							/>
						</Grid>
					</ThemeProvider>
				</div>
			)
		}
	}
}

export default withParams(ProfilePageSortByNew)

import React, {Component} from "react"
import { render } from "react-dom"
import { createRoot } from 'react-dom/client'
import {
  BrowserRouter,
  Route,
  Link, Routes
} from "react-router-dom";

import { NavBar} from './NavBar/NavBar'
import { CreatePost } from './CreatePost/CreatePost'
// Pages
import { SignUpPage } from './pages/SignUpPage/SignUpPage'
import { SignInPage } from './pages/SignInPage/SignInPage'
import { LoadingPage } from './pages/LoadingPage/LoadingPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage/ForgotPasswordPage'
import { PasswordResetEmailSentSuccessfullyPage } from './pages/PasswordResetEmailSentSuccessfullyPage/PasswordResetEmailSentSuccessfullyPage'
import { DeleteUserPage } from './pages/DeleteUserPage/DeleteUserPage'
import { CreatePostPage } from './pages/CreatePostPage/CreatePostPage'
import { SettingsPage } from './pages/SettingsPage/SettingsPage'
import IdiotTargetPage from './pages/IdiotTargetPage/IdiotTargetPage'
import HomePage from './pages/HomePage/HomePage'
import HomePageSortByNew from './pages/HomePage/HomePageSortByNew'
import ViewIndividualPostPage from './pages/ViewIndividualPostPage/ViewIndividualPostPage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import ProfilePageSortByNew from './pages/ProfilePage/ProfilePageSortByNew'
import ResetPasswordPage from './pages/ResetPasswordPage/ResetPasswordPage'
import FriendsPage from './pages/FriendsPage/FriendsPage'
import { variables as ENV } from './environmentVariables'

export default class App extends Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() {
		// gets csrftoken??
		fetch(ENV.url + '/user-auth/get-csrftoken',
			{
				"method": "GET",
				"Accept": "text/plain",
				"Content-Type": "text/plain"
			}
		)
	}

	render() {
		return (
			<BrowserRouter>
				<Routes>
        			<Route path="/reset-password/User=:username/Url=:url/CreatedDate=:created_date" element={<ResetPasswordPage/>} />
        			<Route path="/friends" element={<FriendsPage/>} />
					<Route path="/user/:username" element={<ProfilePage/>} />
					<Route path="/user/:username/new" element={<ProfilePageSortByNew/>} />
					<Route path="/view-post-by-url/:url" element={<ViewIndividualPostPage/>} />
					<Route path="/idiot=:name" element={<IdiotTargetPage/>}/>
					<Route path="/signup" element={<SignUpPage/>} />
					<Route path="/" element={<HomePage/>} />
					<Route path="/new" element={<HomePageSortByNew/>} />
					<Route path="/signin" element={<SignInPage/>} />
					<Route path="/loading" element={<LoadingPage/>} />
					<Route path="/forgot-password" element={<ForgotPasswordPage/>} />
					<Route path="/password-reset-email-sent-successfully" element={<PasswordResetEmailSentSuccessfullyPage/>}/>
					<Route path="/delete-account" element={<DeleteUserPage/>} />
					<Route path="/nav" element={<NavBar/>} />
					<Route path="/create-post" element={<CreatePost/>} />
					<Route path="/settings" element={<SettingsPage/>} />
				</Routes>
			</BrowserRouter>
		)
	}
}
const appDiv = createRoot(document.getElementById("app"))

appDiv.render(<App/>)

//render(
//		<App/>
//	, appDiv);

import React, {Component} from "react"
import { render } from "react-dom"
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import IconButton from '@mui/material/IconButton';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import LinkMaterial from '@mui/material/Link';
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
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { withParams } from '../../UtilityFunctions/UtilityFunctions'
import { variables as ENV } from '../../environmentVariables'


const theme = createTheme()
import { Link } from 'react-router-dom';

class ResetPasswordPage extends Component {
  constructor(props){
    super(props)
    this.state = { isButtonLoading: false, responseMessage: ""}
  }

  handleSubmit = async (event) => {
    this.setState({
      isButtonLoading: true
    })


    event.preventDefault()
    const data = new FormData(event.currentTarget)
    fetch (ENV.url + '/user-auth/reset-password',
            { method: "POST",
              body: data,
              headers: {
                "X-CSRF-Token": getCookie("csrftoken"),
                "X-CSRFToken": getCookie("csrftoken"),
                'Accept':'text/plain',
              },
            }
    )
    .then(res => res.text())
    .then(data => {
      this.setState({
        responseMessage: data       
      })
    })
    this.setState({
      isButtonLoading: false
    })

  }

  RenderResponseMessage = () => {
    if (this.state.responseMessage == ""){
      return null
    } 
    if (this.state.responseMessage == "Password reset successfully") {
      return (
        <Grid item xs={12} sm={12}>
            <Alert severity="success">{this.state.responseMessage}</Alert>
        </Grid>
      )
    } else {
      return (
        <Grid item xs={12} sm={12}>
          <Alert severity="warning">{this.state.responseMessage}</Alert>
        </Grid>
      )
    }
  }

  RenderButton = () => {
    return (
      <LoadingButton
      loading={this.state.isButtonLoading}
      fullWidth
      variant="contained"
      color="secondary"
      sx={{ mt: 3, mb: 2 }}
      type="submit"
      >
      Reset password
      </LoadingButton>
    )
  }

  render() {

      const RenderButton = this.RenderButton
      const RenderResponseMessage = this.RenderResponseMessage

      return(
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
              <CssBaseline />
                <Box
                  sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                    Reset your Password
                  </Typography>
                  <Box component="form" noValidate onSubmit={event => this.handleSubmit(event)} sx={{ mt: 1 }}>
                    <RenderResponseMessage/>
                    <input type="hidden" value={this.props.params.username} name="username"/>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="password"
                        label="New Password"
                        name="password"
                        type="password"
                        autoFocus
                      />
                      <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="passwordConfirm"
                          label="Confirm new Password"
                          name="passwordConfirm"
                          type="password"
                          autoFocus
                        />
                      <RenderButton/>
                  </Box>
                </Box>
                <Grid>
                  <Typography align="center">
                    <LinkMaterial component={Link} to="/signin">
                       Back to Sign in page
                    </LinkMaterial>
                  </Typography>
                </Grid>
             </Container>
          </ThemeProvider>
      )
  }
}

export default withParams(ResetPasswordPage);

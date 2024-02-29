import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import IsDark from '../../context/IsDark'
import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    isErrorMessage: false,
    errorMsg: '',
    isInputType: false,
  }

  render() {
    const {username, password, isErrorMessage, errorMsg, isInputType} =
      this.state
    return (
      <IsDark.Consumer>
        {value => {
          const {isDark} = value
          const input = isInputType ? 'text' : 'password'
          const isBlack = isDark ? 'container3' : 'container2'
          const onChangeStatus = () => {
            this.setState(prevState => ({
              isInputType: !prevState.isInputType,
            }))
          }

          const onChangeUsername = event => {
            this.setState({username: event.target.value})
          }

          const onChangePassword = event => {
            this.setState({password: event.target.value})
          }

          const onSubmitSuccess = jwtToken => {
            const {history} = this.props
            Cookies.set('jwt_token', jwtToken, {expires: 30})
            history.replace('/')
          }

          const onSubmitFailure = errorMsg => {
            this.setState({errorMsg, isErrorMessage: true})
          }

          const onLogin = async event => {
            event.preventDefault()
            const {username, password} = this.state
            const userDetails = {username, password}
            const url = 'https://apis.ccbp.in/login'
            const options = {
              method: 'POST',
              body: JSON.stringify(userDetails),
            }
            const response = await fetch(url, options)
            console.log(response.ok)
            const data = await response.json()
            if (response.ok === true) {
              onSubmitSuccess(data.jwt_token)
            } else {
              onSubmitFailure(data.error_msg)
            }
          }
          const jwtToken = Cookies.get('jwt_token')

          if (jwtToken !== undefined) {
            return <Redirect to="/" />
          }

          return (
            <div className={isBlack}>
              <form onSubmit={onLogin} className="container">
                <img
                  src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
                  alt="logo"
                  className="image"
                />
                <label htmlFor="username" className="para-login">
                  USERNAME
                </label>
                <input
                  type="text"
                  id="username"
                  onChange={onChangeUsername}
                  value={username}
                  className="input"
                  placeholder="USERNAME"
                />
                <label htmlFor="password" className="para-login">
                  PASSWORD
                </label>
                <input
                  type={input}
                  id="password"
                  onChange={onChangePassword}
                  value={password}
                  className="input"
                  placeholder="PASSWORD"
                />
                <div className="checkbox">
                  <input type="checkbox" id="check" onClick={onChangeStatus} />
                  <label htmlFor="check"> Show Password </label>
                </div>
                <button type="submit" className="button-class">
                  Login
                </button>
                {isErrorMessage && <p className="paras">*{errorMsg}</p>}
              </form>
            </div>
          )
        }}
      </IsDark.Consumer>
    )
  }
}

export default LoginForm

import {Component} from 'react'
import {Switch, Route} from 'react-router-dom'
import LoginForm from './components/LoginForm'
import Home from './components/Home'
import IsDark from './context/IsDark'
import Trending from './components/Trending'
import Gaming from './components/Gaming'
import VideoItemDetails from './components/VideoItemDetails'
import Save from './components/Save'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

// Replace your code here
class App extends Component {
  state = {
    isDark: false,
    savedList: [],
  }

  onSavedList = videoDetails => {
    const {savedList} = this.state
    const videoObject = savedList.find(each => each.id === videoDetails.id)

    if (videoObject) {
      this.setState(prev => ({
        savedList: [...prev.savedList],
      }))
    } else {
      this.setState({savedList: [...savedList, videoDetails]})
    }
  }

  removeSavedVideos = savedId => {
    const {savedList} = this.state
    const updatedVideos = savedList.filter(each => each.id !== savedId)
    this.setState({savedList: updatedVideos})
  }

  onChange = () => {
    this.setState(prevState => ({
      isDark: !prevState.isDark,
    }))
  }

  render() {
    const {isDark, savedList} = this.state
    return (
      <IsDark.Provider
        value={{
          isDark,
          onChanges: this.onChange,
          savedList,
          onSavedList: this.onSavedList,
          removeSavedVideos: this.removeSavedVideos,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/trending" component={Trending} />
          <ProtectedRoute exact path="/gaming" component={Gaming} />
          <ProtectedRoute exact path="/home/:id" component={VideoItemDetails} />
          <ProtectedRoute exact path="/save" component={Save} />
        </Switch>
      </IsDark.Provider>
    )
  }
}

export default App

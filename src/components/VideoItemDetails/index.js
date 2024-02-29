import {Component} from 'react'
import Cookies from 'js-cookie'
import ReactPlayer from 'react-player'
import Loader from 'react-loader-spinner'

import {AiOutlineLike, AiOutlineDislike} from 'react-icons/ai'
import {CgPlayListAdd} from 'react-icons/cg'
import IsDark from '../../context/IsDark'
import Header from '../Header'
import Sidebar from '../Sidebar'

import './index.css'

class VideoItemDetails extends Component {
  state = {
    videoDetailed: {},
    isLoading: true,
    isLiked: false,
    isDisliked: false,
    isSaved: false,
  }

  componentDidMount() {
    this.getDetails()
  }

  getDetails = async () => {
    this.setState({isLoading: true})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/videos/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    console.log(response.ok)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatedData = {
        description: data.video_details.description,
        id: data.video_details.id,
        thumbnailUrl: data.video_details.thumbnail_url,
        publishedAt: data.video_details.published_at,
        title: data.video_details.title,
        videoUrl: data.video_details.video_url,
        viewCount: data.video_details.view_count,
        channel: {
          name: data.video_details.channel.name,
          profileImageUrl: data.video_details.channel.profile_image_url,
          subscriberCount: data.video_details.channel.subscriber_count,
        },
      }
      this.setState({videoDetailed: updatedData, isLoading: false})
    }
  }

  renderLoader = () => (
    <div>
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderSuccessView = () => (
    <IsDark.Consumer>
      {value => {
        const {onSavedList, removeSavedVideos, isDark} = value
        const {videoDetailed, isDisliked, isLiked, isSaved} = this.state

        const {
          publishedAt,
          title,
          videoUrl,
          viewCount,
          channel,
          description,
          id,
        } = videoDetailed
        const {name, profileImageUrl, subscriberCount} = channel

        const addOrRemoveItem = () => {
          if (isSaved === true) {
            removeSavedVideos(id)
          } else {
            onSavedList({...videoDetailed, isSaved: true})
          }
        }

        const onAddSaved = () => {
          this.setState(prev => ({isSaved: !prev.isSaved}), addOrRemoveItem)
        }

        const likeClass = isLiked ? 'blue' : 'white'
        const dislikeClass = isDisliked ? 'blue' : 'white'

        const isLikedClick = () => {
          this.setState(prevState => ({
            isLiked: !prevState.isLiked,
            isDisliked: false,
          }))
        }

        const isDislikedClick = () => {
          this.setState(prevState => ({
            isDisliked: !prevState.isDisliked,
            isLiked: false,
          }))
        }

        const isStart = isDark ? 'discos video-dark' : 'discos video-red'
        const duck=isSaved ? "butterfly" : "sucking"

        return (
          <div className={isStart}>
            <ReactPlayer url={videoUrl} controls width="60vw" height="500px" />
            <p> {title}</p>
            <div className="count">
              <p> {viewCount} views</p>
              <ul>
                <li> {publishedAt}</li>
              </ul>
              <div className="section">
                <button
                  type="button"
                  onClick={isLikedClick}
                  className={`sections ${likeClass}`}
                >
                  <AiOutlineLike aria-label="close" className={likeClass} />
                  <p className={`profile-para ${likeClass}`}> Like </p>
                </button>
                <button
                  type="button"
                  onClick={isDislikedClick}
                  className={`sections ${dislikeClass}`}
                >
                  <AiOutlineDislike
                    aria-label="close"
                    className={dislikeClass}
                  />
                  <p className={`profile-para ${dislikeClass}`}> Dislike </p>
                </button>
                <div className="sections">
                  <button type="button" onClick={onAddSaved} className={duck}>
                    <CgPlayListAdd />
                    <p> {isSaved ? 'Saved' : 'Save'} </p>
                  </button>
                </div>
              </div>
            </div>
            <hr className="horizontal" />
            <div className="vertical">
              <img src={profileImageUrl} alt="profile" className="ss" />
              <div className="color">
                <p className="profile-img"> {name}</p>
                <p>{subscriberCount} subscribers</p>
                <p className="para"> {description}</p>
              </div>
            </div>
          </div>
        )
      }}
    </IsDark.Consumer>
  )

  render() {
    const {isLoading} = this.state

    return (
      <div className="details">
        <Header />
        <div className="structure">
          <Sidebar />
          <div className="disco">
            {isLoading ? this.renderLoader() : this.renderSuccessView()}
          </div>
        </div>
      </div>
    )
  }
}

export default VideoItemDetails

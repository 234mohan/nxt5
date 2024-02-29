import {Link} from 'react-router-dom'
import IsDark from '../../context/IsDark'
import './index.css'

const SaveItem = props => {
  const {eachDetails} = props
  const {thumbnailUrl, title, viewCount, publishedAt, channel, id} = eachDetails
  const {name} = channel

  return (
    <IsDark.Consumer>
      {value => {
        const {isDark} = value
        const civil = isDark ? 'tenth cent' : ' tenth age'
        return (
          <Link to={`/home/${id}`} className="null">
            <div className={civil}>
              <img src={thumbnailUrl} alt="ssc" className="ssc" />
              <div className="fifth">
                <h1> {title}</h1>
                <p>{name}</p>
                <div className="view">
                  <p>{viewCount} views </p>
                  <ul className="at">
                    <li> {publishedAt}</li>
                  </ul>
                </div>
              </div>
            </div>
          </Link>
        )
      }}
    </IsDark.Consumer>
  )
}

export default SaveItem

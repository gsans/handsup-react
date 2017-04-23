import React from 'react'
import PropTypes from 'prop-types'

class Profile extends React.Component {

  render() {
    if (!this.props.isLogged) {
      return null
    }

    return (
      <div className='profile mt8'>
        <img src={this.props.profile.picture} />
      </div>
    )
  }
}

Profile.propTypes = {
  isLogged: PropTypes.bool.isRequired,
}

export default Profile

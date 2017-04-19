import React from 'react'

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
  profile: React.PropTypes.object.isRequired,
  isLogged: React.PropTypes.bool.isRequired,
}

export default Profile

import React from 'react'
import PropTypes from 'prop-types'
import Profile from './Profile'

class TopNavigation extends React.Component {

  constructor(props) {
    super(props)
    this.handleLoginClick = this.handleLoginClick.bind(this)
    this.handleLogoutClick = this.handleLogoutClick.bind(this)
  }

  handleLoginClick() {
    this.props.auth.authenticate()
  }

  handleLogoutClick() {
    // clear apollo client cache
    this.props.client.resetStore()
    this.props.auth.logout()
  }

  render() {
    return (
      <nav className='navbar navbar-inverse navbar-fixed-top'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-4 col-xs-3'>
              <Profile
                profile={this.props.auth.profile}
                isLogged={this.props.isLogged}
              />
            </div>
            <div className='col-md-4 col-xs-6'>
              <div className='centerBlock app-title'>
                HandsUp 🙌
              </div>
            </div>
            <div className='col-md-4 col-xs-3'>
              <div className='pull-right button-top'>
                {this.props.isLogged
                  ? <button
                    className='btn btn-primary pull-right'
                    onClick={e => this.handleLogoutClick(e)}
                    >Logout</button>
                  : <button
                    className='btn btn-primary pull-right'
                    onClick={e => this.handleLoginClick(e)}
                    >Login</button>}
              </div>
            </div>
          </div>
        </div>
      </nav>
    )
  }
}

TopNavigation.propTypes = {
  auth: PropTypes.object.isRequired,
  isLogged: PropTypes.bool.isRequired,
}

export default TopNavigation

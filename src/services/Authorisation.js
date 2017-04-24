import Auth0Lock from 'auth0-lock'
import { EventEmitter } from 'events'

const CLIENT_ID = 'Rwy4qqy5uEbGyLEGJBI1VOeDVSqDUTz0'
const DOMAIN = 'public.eu.auth0.com'

export default class Authorisation extends EventEmitter {

  constructor() {
    super()
    this.lock = new Auth0Lock(CLIENT_ID, DOMAIN, {
      theme: {
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Emoji_u1f64c.svg/2000px-Emoji_u1f64c.svg.png',
        primaryColor: '#31324F',
      },
      auth: {
        responseType: 'id_token',
        params: { scope: 'openid email' },
        redirect: false,
      },
    })
    this.lock.on('authenticated', this.doAuthentication.bind(this))
    if (this.setMaxListeners) {
      this.setMaxListeners(10000)
    }
  }

  get auth0IdToken() {
    return localStorage.getItem('auth0IdToken')
  }
  set auth0IdToken(value) {
    if (value) {
      localStorage.setItem('auth0IdToken', value)
    } else {
      localStorage.removeItem('auth0IdToken')
    }
  }

  get profile() {
    return JSON.parse(localStorage.getItem('profile'))
  }
  set profile(value) {
    if (value) {
      localStorage.setItem('profile', JSON.stringify(value))
    } else {
      localStorage.removeItem('profile')
    }
    this.emit('profile-updated', value)
  }

  get userId() {
    return JSON.parse(localStorage.getItem('userId'))
  }
  set userId(value) {
    if (value) {
      localStorage.setItem('userId', JSON.stringify(value))
    } else {
      localStorage.removeItem('userId')
    }
    this.emit('user-id-updated', value)
  }

  get role() {
    return JSON.parse(localStorage.getItem('role'))
  }
  set role(value) {
    if (value) {
      localStorage.setItem('role', JSON.stringify(value))
    } else {
      localStorage.removeItem('role')
    }
  }

  get flagged() {
    return JSON.parse(localStorage.getItem('flagged'))
  }
  set flagged(value) {
    if (value) {
      localStorage.setItem('flagged', JSON.stringify(value))
      // we logout the user if flagged
      this.logout()
    } else {
      localStorage.removeItem('flagged')
    }
  }

  authenticate() {
    this.lock.show()
  }

  doAuthentication(authResult) {
    // flagged users can't login
    if (!this.profile) {
      this.auth0IdToken = authResult.idToken
      this.lock.getProfile(authResult.idToken, (error, profile) => {
        if (error) {
          console.error('Error loading the User Profile', error)
          this.auth0IdToken = null
          this.profile = null
        } else {
          this.profile = profile
          location.href = '/'
        }
      })
    }
  }

  logout(client) {
    if (client) {
      // clear apollo client cache
      client.resetStore()
    }
    this.auth0IdToken = null
    this.profile = null
    this.userId = null
    this.role = null
    this.flagged = null
  }
}

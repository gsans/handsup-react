import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import Votes from './Votes'
import { flyingHearts, DEFAULT_PROFILE_PIC, ALERT_DEFAULT } from '../utils/helpers'
import TimeAgo from 'react-timeago'
import TweetParser from './TweetParser'
import Alert from 'react-s-alert'

import ModeratorOptions from './ModeratorOptions'

import CREATE_VOTE_MUTATION from '../graphql/Vote.mutation.gql'

class Question extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      votes: this.props.question._votesMeta.count,
      isTheAuthor: this.isTheAuthor(this.props.auth.userId),
    }
    this.props.auth.on('user-id-updated', this.updateState.bind(this))
  }

  updateState(userId) {
    this.setState({
      isTheAuthor: this.isTheAuthor(userId),
    })
  }

  isTheAuthor(userId) {
    let questionUserId

    if (this.props.question && this.props.question.user) {
      questionUserId = this.props.question.user.id
    }
    return (userId === questionUserId)
  }

  componentDidMount() {
    // not working for now
    // window.scroll({ top: this.elem.scrollHeight, left: 0, behavior: 'smooth' })
  }

  componentWillReceiveProps(nextProps) {
    // re-render only when votes have changed
    if (nextProps.question && this.props.question) {
      let newVotes = nextProps.question._votesMeta.count
      let currentVotes = this.props.question._votesMeta.count

      if (newVotes !== currentVotes) {
        this.setState({
          votes: newVotes,
        })
      }
    }
  }

  componentWillUnmount() {
    this.props.auth.removeListener('user-id-updated', this.updateState.bind(this))
  }

  formatter(value, unit, suffix, date, defaultFormatter) {
    if (unit === 'second' && value < 60) {
      return 'just now'
    }
    return defaultFormatter(value, unit, suffix, date)
  }

  onSubmit() {
    this.setState({
      votes: this.state.votes+1,
      isTheAuthor: this.isTheAuthor(this.props.auth.userId),
    })
    this.props
      .vote(this.props.question.id)
      .catch(e => {
        if (e.graphQLErrors) {
          e.graphQLErrors.forEach(error => {
            switch (error.code) {
              case 3023:
                break
              default:
                console.error(error)
            }
          }, this)
        }
      })
    flyingHearts('.flying-hearts')
  }

  flagUser(question) {
    this.props.flag(question.id, question.flagged).then(() => {
      this.props.flagUser(question.user.id, question.user.flagged)
    })
  }
  flagQuestion(question) {
    this.props.flag(question.id, question.flagged)
  }
  moderatorOptions() {
    // hide flagged questions from organisers
    if (this.props.auth.role==='User' || this.props.auth.role==='Organiser' || !this.props.auth.role) {
      return null
    } else {
      return (
        <ModeratorOptions
          question={this.props.question}
          role={this.props.auth.role} />
      )
    }
  }

  render() {
    // hide flagged questions from users
    if (this.props.question.flagged && (this.props.auth.role==='User' || this.props.auth.role==='Organiser' || !this.props.auth.role)) {
      return null
    }
    return (
      <li className={this.props.question.flagged ? 'flagged' : ''}>
        <div className='row' ref={elem => (this.elem = elem)}>
          <div className='col-md-11 col-xs-10'>
            <div className='text-body'>
              <TweetParser parseUsers parseUrls hashtagClass={'twitter'} urlClass={'twitter'} userClass={'twitter'} >{this.props.question.body}</TweetParser></div>
            <Votes votes={this.state.votes} />
            <div className='profile-container'>
              <div className='profile-small'>
                <img src={this.props.question.user &&this.props.question.user.pictureUrl || DEFAULT_PROFILE_PIC} />
              </div>
              <div className='profile-small-text'>by {this.props.question.user? this.props.question.user.username : '@happylama'}
                <span className='hidden-xs'>, <TimeAgo date={this.props.question.createdAt} formatter={this.formatter} />
                </span>
              </div>
            </div>
          </div>
          <div className='col-md-1 col-xs-2'>
            <div className='vote'>
              <button className='btn btn-circle'
                onClick={e => this.onSubmit()} disabled={this.state.isTheAuthor || this.props.question.flagged}>
                <i className='fa fa-heart' />
              </button>
            </div>
          </div>
        </div>
        {this.moderatorOptions()}
      </li>
    )
  }
}

const withVote = graphql(CREATE_VOTE_MUTATION,
  {
    props: ({ mutate }) => ({
      vote(id) {
        return mutate({
          variables: { question: id },
        }).catch(error => {
          Alert.error(error.message, ALERT_DEFAULT)
        })
      },
    }),
  },
)

Question.propTypes = {
  question: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
}

export default withVote(Question)

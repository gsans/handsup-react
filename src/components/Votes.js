import React from 'react'
import PropTypes from 'prop-types'
import { getBaseLog } from '../utils/helpers'

class Votes extends React.Component {

  render() {
    if (this.props.votes!==0 && !this.props.votes) {
      return null
    }
    let blocks = getBaseLog(this.props.votes)
    return (
      <ul className='blocks'>
        {Array.apply(null, Array(blocks))
          .map((x, i) => {
            return (
              <li key={i} className='block' />
            )
          }, this)}
      </ul>
    )
  }
}

Votes.propTypes = {
  votes: PropTypes.number.isRequired,
}

export default Votes

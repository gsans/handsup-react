import React from 'react'
import Question from './Question'

class QuestionList extends React.Component {

  render() {
    return (
      <div className='list'>
        <ul>
          { this.props.questions.map(question =>
            <Question
              key={question.id}
              question={question}
            />
          )}
        </ul>
      </div>
    )
  }
}

QuestionList.propTypes = {
  questions: React.PropTypes.array.isRequired,
}

export default QuestionList

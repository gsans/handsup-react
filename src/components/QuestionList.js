import React from 'react'
import Question from './Question'

class QuestionList extends React.Component {

  render() {
    return (
      <ul>
        { this.props.questions.map(question =>
          <Question
            key={question.id}
            question={question}
          />
        )}
      </ul>
    )
  }
}

QuestionList.propTypes = {
  questions: React.PropTypes.array.isRequired,
}

export default QuestionList

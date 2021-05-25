import React from 'react';
import {AnswerObject} from "../App";
import styled from "styled-components";
import Button from '@material-ui/core/Button';


const StyledQuestionCard = styled.div`
  &.question-card {
    .question-number {
      font-size: 2rem;
    }

    .question-text {
      font-size: 2rem;
    }

    .answer-button {
      margin: 4px;
      min-width: 200px;
      background-color: pink;
      color: #fff;

      &:hover {
        filter: brightness(90%);
        background-color: pink;
      }
    }
  }
`


type Props = {
  question: string;
  answers: string[];
  callback: (event: React.MouseEvent<HTMLButtonElement>) => void;
  userAnswer: AnswerObject | undefined;
  questionNumber: number;
  totalQuestions: number;
}

export const QuestionCard: React.FC<Props> = (props) => {
  const {question, answers, callback, userAnswer, questionNumber, totalQuestions} = props;

  return (
    <StyledQuestionCard className="question-card">
      <p className="question-number">
        Question: {questionNumber} / {totalQuestions}
      </p>

      <p className="question-text" dangerouslySetInnerHTML={{__html: question}} />
      <div>
        {answers.map(answer => (
          <div key={answer}>
            <Button
              className="answer-button"
              variant="contained"
              color="default"
              disabled={userAnswer ? true : false}
              onClick={callback}
              value={answer}
            >
              <span dangerouslySetInnerHTML={{__html: answer}}/>
            </Button>
          </div>
        ))}
      </div>
    </StyledQuestionCard>
  );
};
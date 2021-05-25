import React, {FC, useState} from 'react';

import {fetchQuizQuestions, QuestionState} from "./API";
import {QuestionCard} from "./components/QuestionCard";
import {Difficulty} from "./Difficulty";
import styled from "styled-components";
import Button from '@material-ui/core/Button';

const StyledApp = styled.div`
  &.app {    
    width: 100%;
    height: 100vh;
    padding: 15px;
    display: flex;
    flex: 1 1 auto;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: center;
    text-align: center;
    background-image: url('beach-quotes.jpeg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    color: black;
  }

  .score {
    font-size: 2rem;
    margin: 0px;
  }

  .quiz-title {
    font-size: 2rem;
    font-family: Verdana;
  }

  .start-quiz-button {
    min-width: 200px;
    background-color: darkred;
    color: #ffffff;

    &:hover {
      filter: brightness(90%);
      background-color: darkred;
    }
  }

  .next-question-button {
    margin: 4px;
    min-width: 200px;
    background-color: aqua;
    color: #ffffff;

    &:hover {
      filter: brightness(90%);
      background-color: aqua;
    }
  }
`


export interface AnswerObject {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const TOTAL_QUESTIONS = 10;
export const App: FC = () => {

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOVer] = useState(true);

  console.log(questions);

  const startTrivia = async () => {
    setLoading(true);
    setGameOVer(false);

    const newQuestions: QuestionState[] = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setQuestionNumber(0);
    setLoading(false);
  };

  const checkAnswer = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      //Users Answer
      const answer = event.currentTarget.value;
      //check answer against correct answer
      const correct = questions[questionNumber].correct_answer === answer;
      console.log(`answer is correct? ${correct}`);
      console.log(`${questions[questionNumber].correct_answer}`);
      console.log(questions[questionNumber]);
      //add  score if answer is correct
      if (correct) setScore(prev => prev + 1);
      //save answer in the array for user answers
      const answerObject = {
        question: questions[questionNumber].question,
        answer,
        correct,
        correctAnswer: questions[questionNumber].correct_answer,
      };
      setUserAnswers(prev => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    // move on to the next question if not the last question
    const nextQuestion = questionNumber + 1;

    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOVer(true);
    } else {
      setQuestionNumber(nextQuestion);
    }
  };

  return (
    <StyledApp className="app">
      <p className="quiz-title">React Quiz</p>
      {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (

        <Button
          className="start-quiz-button"
          variant="contained"
          color="default"
          onClick={startTrivia}
        >
          Start
        </Button>
      ) : null}

      {!gameOver ? <p className="score"> Score: {score}</p> : null}
      {loading && <p>Loading Questions....</p>}

      {!loading && !gameOver && (
        <QuestionCard questionNumber={questionNumber + 1}
                      totalQuestions={TOTAL_QUESTIONS}
                      question={questions[questionNumber].question}
                      answers={questions[questionNumber].answers}
                      userAnswer={userAnswers ? userAnswers[questionNumber] : undefined}
                      callback={checkAnswer}
        />
      )}

      {!gameOver && !loading && userAnswers.length === questionNumber + 1 && questionNumber !== TOTAL_QUESTIONS - 1 ? (
        <Button
          className="next-question-button"
          variant="contained"
          color="default"
          onClick={nextQuestion}
        >
          Next Question
        </Button>
      ) : null}

    </StyledApp>
  );
};

export default App;
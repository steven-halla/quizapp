import React, {useState} from 'react';

import {fetchQuizQuestions, QuestionState} from "./API";
import {QuestionCard} from "./components/QuestionCard";
import {Difficulty} from "./Difficulty";
// import QuestionCard from `./components/QuestionCard`;


export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const TOTAL_QUESTIONS = 10;
const App = () => {

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
    <div className="App">
      <h1>React Quiz</h1>
      {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (

        <button className="start" onClick={startTrivia}>
          Start
        </button>
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
        <button className="next" onClick={nextQuestion}>
          Next Question
        </button>
      ) : null}

    </div>
  );
};

export default App;
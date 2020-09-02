import React, { useReducer } from "react";
import Progress from "./components/Progress";
import Question from "./components/Question";
import Answers from "./components/Answers";
import QuizContext from "./context/QuizContext";

import {
	SET_ANSWERS,
	SET_CURRENT_QUESTION,
	SET_CURRENT_ANSWER,
	SET_ERROR,
	SET_SHOW_RESULTS,
	RESET_QUIZ,
} from "./reducers/types.js";
import quizReducer from "./reducers/QuizReducer";

import "./App.css";

function App() {
	const questions = [
		{
			id: 1,
			question:
				"Monica briefly dates billionaire Pete Becker. Which country does he take her for their first date?",
			answer_a: "France",
			answer_b: "Italy",
			answer_c: "England",
			answer_d: "Greece",
			correct_answer: "a",
		},
		{
			id: 2,
			question: "What hangs on Monica's purple door?",
			answer_a: "A Key Hook",
			answer_b: "A coat Hook",
			answer_c: "A yellow picture frame",
			answer_d: "A cap",
			correct_answer: "c",
		},
		{
			id: 3,
			question: "What is Ross’ first wife’s name?",
			answer_a: "Charlie",
			answer_b: "Carol",
			answer_c: "Emily",
			answer_d: "Rachel",
			correct_answer: "b",
		},
		{
			id: 4,
			question:
				"On which soap opera does Joey have a recurring role as Dr. Drake Ramoray?",
			answer_a: "GENERAL HOSPITAL",
			answer_b: "ALL MY CHILDREN",
			answer_c: "DAYS OF OUR LIVES",
			answer_d: "THE BOLD AND THE BEAUTIFUL",
			correct_answer: "c",
		},

		{
			id: 5,
			question: "How many categories for towels does Monica have?",
			answer_a: "8",
			answer_b: "12",
			answer_c: "20",
			answer_d: "11",
			correct_answer: "d",
		},
		{
			id: 6,
			question:
				"For the latter half of the series, Monica’s apartment number was 20. What was it before?",
			answer_a: "4",
			answer_b: "8",
			answer_c: "5",
			answer_d: "19",
			correct_answer: "c",
		},
		{
			id: 7,
			question: "What is the name of Joey and Chandler’s pet duck?",
			answer_a: "Chick",
			answer_b: "Bruce",
			answer_c: "Huggsy",
			answer_d: "Duck",
			correct_answer: "d",
		},
	];
	const initialState = {
		questions,
		currentQuestion: 0,
		currentAnswer: "",
		answers: [],
		showResults: false,
		error: "",
	};

	const [state, dispatch] = useReducer(quizReducer, initialState);
	const {
		currentQuestion,
		currentAnswer,
		answers,
		showResults,
		error,
	} = state;

	const question = questions[currentQuestion];

	const renderError = () => {
		if (!error) {
			return;
		}

		return <div className="error">{error}</div>;
	};

	const renderResultMark = (question, answer) => {
		if (question.correct_answer === answer.answer) {
			return <span className="correct">Correct</span>;
		}

		return <span className="failed">Failed</span>;
	};

	const renderResultsData = () => {
		return answers.map((answer) => {
			const question = questions.find(
				(question) => question.id === answer.questionId
			);

			return (
				<div key={question.id}>
					{question.question} - {renderResultMark(question, answer)}
				</div>
			);
		});
	};

	const restart = () => {
		dispatch({ type: RESET_QUIZ });
	};

	const next = () => {
		const answer = { questionId: question.id, answer: currentAnswer };

		if (!currentAnswer) {
			dispatch({ type: SET_ERROR, error: "Please select an option" });
			return;
		}

		answers.push(answer);
		dispatch({ type: SET_ANSWERS, answers });
		dispatch({ type: SET_CURRENT_ANSWER, currentAnswer: "" });

		if (currentQuestion + 1 < questions.length) {
			dispatch({
				type: SET_CURRENT_QUESTION,
				currentQuestion: currentQuestion + 1,
			});
			return;
		}

		dispatch({ type: SET_SHOW_RESULTS, showResults: true });
	};

	if (showResults) {
		return (
			<div className="container results">
				<h2>Results</h2>
				<ul>{renderResultsData()}</ul>
				<button className="btn btn-primary" onClick={restart}>
					Restart
				</button>
			</div>
		);
	} else {
		return (
			<QuizContext.Provider value={{ state, dispatch }}>
				<div className="container">
					<h1>F.R.I.E.N.D.S Quiz</h1>
					<Progress
						total={questions.length}
						current={currentQuestion + 1}
					/>
					<Question />
					{renderError()}
					<Answers />
					<button className="btn btn-primary" onClick={next}>
						Confirm and Continue
					</button>
				</div>
			</QuizContext.Provider>
		);
	}
}

export default App;

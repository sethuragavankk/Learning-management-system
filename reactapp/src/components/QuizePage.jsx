import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { coursesAPI } from '../services/api';
import './QuizePage.css';

const QuizPage = () => {

    const { courseId } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});

    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {

        loadQuiz();

    }, []);

    const loadQuiz = async () => {

        try {

            const course =
                await coursesAPI.getById(courseId);

            const questions =
                (course.quizQuestions || []).map(
                    (question, index) => ({
                        id: index + 1,
                        question: question,

                        options: [
                            "Option A",
                            "Option B",
                            "Option C",
                            "Option D"
                        ],

                        correctAnswer: 0
                    })
                );

            setQuiz({

                courseId: course.id,
                courseName: course.title,
                questions

            });

        }
        catch (error) {

            console.error(error);

        }
        finally {

            setLoading(false);

        }

    };

    const handleAnswerSelect =
        (questionId, answer) => {

            setAnswers(prev => ({

                ...prev,

                [questionId]: answer

            }));

        };

    const handlePrevious = () => {

        if (currentQuestion > 0) {

            setCurrentQuestion(
                prev => prev - 1
            );

        }

    };

    const handleNext = () => {

        if (
            currentQuestion <
            quiz.questions.length - 1
        ) {

            setCurrentQuestion(
                prev => prev + 1
            );

        }
        else {

            finishQuiz();

        }

    };

    const finishQuiz = () => {

        let total = 0;

        quiz.questions.forEach(question => {

            if (

                answers[question.id]
                ===
                question.correctAnswer

            ) {

                total++;

            }

        });

        setScore(total);
        setQuizCompleted(true);

    };

    const updateProgress = async () => {

        try {

            const percentage =
                Math.round(
                    (score /
                        quiz.questions.length)
                    * 100
                );

            if (percentage < 70) {

                return;

            }

            const token =
                localStorage.getItem("token");

            const user =
                JSON.parse(
                    localStorage.getItem("user")
                );

            await fetch(

                "http://localhost:8080/api/courses/progress",

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:

                        JSON.stringify({

                            courseId:

                                parseInt(courseId),

                            studentEmail:

                                user.email,

                            progressPercentage:

                                20

                        })

                }

            );

        }
        catch (error) {

            console.error(
                "Progress update failed",
                error
            );

        }

    };

    const handleSubmit = async () => {

        setIsSubmitting(true);

        try {

            await updateProgress();

            navigate(

                "/mylearning",

                {

                    state: {

                        quizCompleted: true

                    }

                }

            );

        }
        catch (error) {

            console.error(error);

        }
        finally {

            setIsSubmitting(false);

        }

    };

    if (loading) {

        return (

            <div className="quiz-page">

                <div className="quiz-container">

                    <h2>
                        Loading Quiz...
                    </h2>

                </div>

            </div>

        );

    }

    if (

        !quiz ||

        quiz.questions.length === 0

    ) {

        return (

            <div className="quiz-page">

                <div className="quiz-container">

                    <h2>
                        No Quiz Available
                    </h2>

                </div>

            </div>

        );

    }

    const currentQ =
        quiz.questions[currentQuestion];

    if (quizCompleted) {

        const percentage =
            Math.round(
                (score /
                    quiz.questions.length)
                * 100
            );

        return (

            <div className="quiz-page">

                <div className="quiz-container">

                    <div className="quiz-results">

                        <h2>
                            Quiz Completed
                        </h2>

                        <div className="score-display">

                            <h3>

                                Score :

                                {score}

                                /

                                {quiz.questions.length}

                            </h3>

                            <p>

                                {percentage}%

                            </p>

                        </div>

                        <button

                            className="btn-submit"

                            onClick={handleSubmit}

                            disabled={isSubmitting}

                        >

                            {

                                isSubmitting

                                    ?

                                    "Saving..."

                                    :

                                    "Return To Learning"

                            }

                        </button>

                    </div>

                </div>

            </div>

        );

    }

    return (

        <div className="quiz-page">

            <div className="quiz-container">

                <div className="quiz-header">

                    <h2>

                        {quiz.courseName}

                    </h2>

                    <p>

                        Question

                        {

                            currentQuestion + 1

                        }

                        /

                        {

                            quiz.questions.length

                        }

                    </p>

                </div>

                <div className="quiz-question">

                    <h3>

                        {currentQ.question}

                    </h3>

                    <div className="quiz-options">

                        {

                            currentQ.options.map(

                                (option, index) => (

                                    <label

                                        key={index}

                                        className="quiz-option"

                                    >

                                        <input

                                            type="radio"

                                            checked={

                                                answers[currentQ.id]

                                                ===

                                                index

                                            }

                                            onChange={() =>

                                                handleAnswerSelect(

                                                    currentQ.id,

                                                    index

                                                )

                                            }

                                        />

                                        {option}

                                    </label>

                                )

                            )

                        }

                    </div>

                </div>

                <div className="quiz-navigation">

                    <button

                        onClick={handlePrevious}

                        disabled={currentQuestion === 0}

                    >

                        Previous

                    </button>

                    <button

                        onClick={handleNext}

                    >

                        {

                            currentQuestion ===

                                quiz.questions.length - 1

                                ?

                                "Finish"

                                :

                                "Next"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

};

export default QuizPage;
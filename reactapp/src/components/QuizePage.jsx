import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { coursesAPI } from './api'; 
import './QuizePage.css';//

const QuizPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sample quiz data
  const sampleQuizzes = {
    1: {
      courseId: 1,
      courseName: 'Web Development Fundamentals',
      questions: [
        {
          id: 1,
          question: "What is the main purpose of HTML?",
          options: [
            "Styling web pages",
            "Defining structure of web content",
            "Adding interactivity to websites",
            "Database management"
          ],
          correctAnswer: 1
        },
        {
          id: 2,
          question: "Which CSS property is used to change text color?",
          options: [
            "font-color",
            "text-color",
            "color",
            "text-style"
          ],
          correctAnswer: 2
        },
        {
          id: 3,
          question: "JavaScript is primarily used for:",
          options: [
            "Styling web pages",
            "Server-side programming only",
            "Adding interactivity to web pages",
            "Database management"
          ],
          correctAnswer: 2
        }
      ]
    },
    // Add quizzes for other courses as needed
  };

  const quiz = sampleQuizzes[courseId] || sampleQuizzes[1];

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({...prev, [questionId]: answerIndex}));
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
      setQuizCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let calculatedScore = 0;
    quiz.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
  };

  const updateProgressInBackend = async (courseId, newProgress) => {
    try {
      // Get current progress from backend
      const currentProgressData = await coursesAPI.getProgress(courseId);
      const currentProgress = currentProgressData?.progress || 0;
      
      // Only update if the new progress is higher than current progress
      if (newProgress > currentProgress) {
        await coursesAPI.updateProgress(courseId, newProgress);
        console.log(`Progress updated to ${newProgress}% for course ${courseId}`);
      }
    } catch (error) {
      console.error('Failed to update progress in backend:', error);
      // You might want to handle this error more gracefully
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const percentage = (score / quiz.questions.length) * 100;
      
      // Only update progress if quiz was passed (70% or higher)
      if (percentage >= 70) {
        // Calculate new progress (current progress + 20%, max 100%)
        const currentProgressResponse = await coursesAPI.getProgress(parseInt(courseId));
        const currentProgress = currentProgressResponse?.progress || 0;
        const newProgress = Math.min(currentProgress + 20, 100);
        
        // Update progress in backend
        await updateProgressInBackend(parseInt(courseId), newProgress);
      }
      
      // Navigate back to My Learning page with quiz results
      navigate('/mylearning', { 
        state: { 
          quizCompleted: true, 
          courseId: parseInt(courseId), 
          score: score, 
          total: quiz.questions.length,
          percentage: percentage
        } 
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (quizCompleted) {
    return (
      <div className="quiz-page">
        <div className="quiz-container">
          <div className="quiz-results">
            <h2>Quiz Results</h2>
            <div className="score-display">
              <h3>Your Score: {score}/{quiz.questions.length}</h3>
              <p>{Math.round((score / quiz.questions.length) * 100)}%</p>
            </div>
            <button 
              className="btn btn-primary" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Return to My Learning'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        <div className="quiz-header">
          <h2>{quiz.courseName} - Quiz</h2>
          <p>Question {currentQuestion + 1} of {quiz.questions.length}</p>
        </div>

        <div className="quiz-question">
          <h3>{currentQ.question}</h3>
          <div className="quiz-options">
            {currentQ.options.map((option, optIndex) => (
              <label key={optIndex} className="quiz-option">
                <input
                  type="radio"
                  name={`question-${currentQ.id}`}
                  value={optIndex}
                  onChange={() => handleAnswerSelect(currentQ.id, optIndex)}
                  checked={answers[currentQ.id] === optIndex}
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <div className="quiz-navigation">
          <button 
            className="btn btn-outline" 
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </button>
          <button className="btn btn-primary" onClick={handleNext}>
            {currentQuestion === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next'}
          </button>
        </div>

        <div className="quiz-progress">
          <div 
            className="progress-bar" 
            style={{width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`}}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;

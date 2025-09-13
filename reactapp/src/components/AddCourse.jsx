import React, { useState } from 'react';
import './AddCourse.css';

const AddCourse = () => {
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    duration: '',
    modules: '',
    quizzes: [
      {
        module: 1,
        questions: [
          {
            question: '',
            answer: '',
            points: 1
          }
        ]
      }
    ]
  });

  const [activeQuiz, setActiveQuiz] = useState(0);
  const [expandedQuestions, setExpandedQuestions] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuizChange = (quizIndex, questionIndex, field, value) => {
    const updatedQuizzes = [...courseData.quizzes];
    updatedQuizzes[quizIndex].questions[questionIndex][field] = value;
    
    setCourseData(prev => ({
      ...prev,
      quizzes: updatedQuizzes
    }));
  };

  const addNewQuiz = () => {
    const newQuiz = {
      module: courseData.quizzes.length + 1,
      questions: [
        {
          question: '',
          answer: '',
          points: 1
        }
      ]
    };
    
    setCourseData(prev => ({
      ...prev,
      quizzes: [...prev.quizzes, newQuiz]
    }));
    
    setActiveQuiz(courseData.quizzes.length);
  };

  const addQuestionToQuiz = (quizIndex) => {
    const updatedQuizzes = [...courseData.quizzes];
    updatedQuizzes[quizIndex].questions.push({
      question: '',
      answer: '',
      points: 1
    });
    
    setCourseData(prev => ({
      ...prev,
      quizzes: updatedQuizzes
    }));

    // Expand the new question
    setExpandedQuestions(prev => ({
      ...prev,
      [`${quizIndex}-${updatedQuizzes[quizIndex].questions.length - 1}`]: true
    }));
  };

  const removeQuiz = (quizIndex) => {
    if (courseData.quizzes.length <= 1) return;
    
    const updatedQuizzes = courseData.quizzes.filter((_, index) => index !== quizIndex);
    
    setCourseData(prev => ({
      ...prev,
      quizzes: updatedQuizzes
    }));
    
    setActiveQuiz(0);
  };

  const removeQuestion = (quizIndex, questionIndex) => {
    if (courseData.quizzes[quizIndex].questions.length <= 1) return;
      const updatedQuizzes = [...courseData.quizzes];
    updatedQuizzes[quizIndex].questions = updatedQuizzes[quizIndex].questions.filter(
      (_, index) => index !== questionIndex
    );
    
    setCourseData(prev => ({
      ...prev,
      quizzes: updatedQuizzes
    }));
  };

  const toggleQuestion = (quizIndex, questionIndex) => {
    const key = `${quizIndex}-${questionIndex}`;
    setExpandedQuestions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Course Data:', courseData);
    alert('Course created successfully!');
  };

  return (
    <div className="add-course-container">
      <div className="add-course-header">
        <h1><i className="fas fa-plus-circle"></i> Add Course</h1>
        <p>Create a new course to share your knowledge with students</p>
      </div>

      <form className="add-course-form" onSubmit={handleSubmit}>
        {/* Course Information Section - Same as before */}
        <div className="form-section">
          <h2 className="section-title">
            <i className="fas fa-info-circle"></i> Course Information
          </h2>
          
          <div className="form-group">
            <label htmlFor="title">Course Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={courseData.title}
              onChange={handleInputChange}
              placeholder="e.g., Introduction to React"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Course Description</label>
            <textarea
              id="description"
              name="description"
              value={courseData.description}
              onChange={handleInputChange}
              placeholder="Describe what students will learn in this course..."
              required
            />
          </div>
                   <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={courseData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a category</option>
              <option value="technology">Technology</option>
              <option value="business">Business</option>
              <option value="design">Design</option>
              <option value="science">Science</option>
              <option value="mathematics">Mathematics</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="level">Difficulty Level</label>
            <select
              id="level"
              name="level"
              value={courseData.level}
              onChange={handleInputChange}
              required
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
        
        {/* Course Content Section - Same as before */}
        <div className="form-section">
          <h2 className="section-title">
            <i className="fas fa-video"></i> Course Content
          </h2>
          
          <div className="form-group">
            <label htmlFor="duration">Estimated Duration (hours)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={courseData.duration}
              onChange={handleInputChange}
              min="1"
              max="100"
              placeholder="e.g., 10"
              required
            />
          </div>
                      <div className="form-group">
            <label htmlFor="modules">Number of Modules</label>
            <input
              type="number"
              id="modules"
              name="modules"
              value={courseData.modules}
              onChange={handleInputChange}
              min="1"
              max="20"
              placeholder="e.g., 5"
              required
            />
          </div>
        </div>
        
        {/* Enhanced Quiz Section */}
        <div className="form-section">
          <h2 className="section-title">
            <i className="fas fa-question-circle"></i> Course Assessment
          </h2>
          <p className="section-subtitle">Add quiz questions to test student understanding</p>
          
          <div className="quiz-tabs">
            {courseData.quizzes.map((quiz, quizIndex) => (
              <button
                key={quizIndex}
                type="button"
                className={`quiz-tab ${activeQuiz === quizIndex ? 'active' : ''}`}
                onClick={() => setActiveQuiz(quizIndex)}
              >
                <i className="fas fa-file-alt"></i> Module {quiz.module}
              </button>
            ))}
            <button
              type="button"
              className="quiz-tab add-tab"
              onClick={addNewQuiz}
            >
              <i className="fas fa-plus"></i> Add Module Quiz
            </button>
          </div>
          
          {courseData.quizzes.map((quiz, quizIndex) => (
            <div
              key={quizIndex}
              className={`quiz-content ${activeQuiz === quizIndex ? 'active' : ''}`}
            >
              <div className="quiz-header">
                <div className="quiz-title">
                  <h3><i className="fas fa-file-alt"></i> Module {quiz.module} Quiz</h3>
                  <span className="question-count">
                    {quiz.questions.length} question{quiz.questions.length !== 1 ? 's' : ''}
                  </span>
                </div>
                {courseData.quizzes.length > 1 && (
                  <button
                    type="button"
                    className="remove-quiz-btn"
                    onClick={() => removeQuiz(quizIndex)}
                  >
                    <i className="fas fa-trash"></i> Remove Quiz
                  </button>
                )}
              </div>
                           <div className="questions-container">
                {quiz.questions.map((question, questionIndex) => {
                  const isExpanded = expandedQuestions[`${quizIndex}-${questionIndex}`];
                  return (
                    <div key={questionIndex} className={`question-card ${isExpanded ? 'expanded' : ''}`}>
                      <div 
                        className="question-header"
                        onClick={() => toggleQuestion(quizIndex, questionIndex)}
                      >
                        <div className="question-title">
                          <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'}`}></i>
                          <span className="question-number">Question {questionIndex + 1}</span>
                          {question.question && (
                            <span className="question-preview">
                              {question.question.length > 50 
                                ? `${question.question.substring(0, 50)}...` 
                                : question.question
                              }
                            </span>
                          )}
                        </div>
                        <div className="question-actions">
                          <span className="points-badge">{question.points} point{question.points !== 1 ? 's' : ''}</span>
                                                   {quiz.questions.length > 1 && (
                            <button
                              type="button"
                              className="remove-question-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeQuestion(quizIndex, questionIndex);
                              }}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="question-content">
                          <div className="form-group">
                            <label>Question Text</label>
                            <input
                              type="text"
                              placeholder="Enter your question here..."
                              value={question.question}
                              onChange={(e) => handleQuizChange(quizIndex, questionIndex, 'question', e.target.value)}
                              required
                            />
                          </div>
                          
                          <div className="form-group">
                            <label>Correct Answer</label>
                            <input
                              type="text"
                              placeholder="Enter the correct answer..."
                              value={question.answer}
                              onChange={(e) => handleQuizChange(quizIndex, questionIndex, 'answer', e.target.value)}
                              required
                            />
                          </div>
                                                  <div className="form-group points-group">
                            <label>Points</label>
                            <div className="points-input">
                              <button
                                type="button"
                                className="points-btn"
                                onClick={() => handleQuizChange(quizIndex, questionIndex, 'points', Math.max(1, question.points - 1))}
                              >
                                <i className="fas fa-minus"></i>
                              </button>
                              <input
                                type="number"
                                value={question.points}
                                onChange={(e) => handleQuizChange(quizIndex, questionIndex, 'points', parseInt(e.target.value) || 1)}
                                min="1"
                                max="10"
                                required
                              />
                              <button
                                type="button"
                                className="points-btn"
                                onClick={() => handleQuizChange(quizIndex, questionIndex, 'points', Math.min(10, question.points + 1))}
                              >
                                <i className="fas fa-plus"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <button
                type="button"
                className="add-question-btn"
                onClick={() => addQuestionToQuiz(quizIndex)}
              >
                <i className="fas fa-plus"></i> Add New Question
              </button>
            </div>
          ))}
        </div>
        
        <div className="form-actions">
          <button type="button" className="btn btn-outline">
            <i className="fas fa-times"></i> Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <i className="fas fa-plus"></i> Create Course
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourse;
// src/App.js

import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./components/Home";

import CourseList from "./components/CourseList";

import CourseForm from "./components/CourseForm";

import ProgressTracker from "./components/ProgressTracker";

import QuizPage from "./components/QuizPage";



function App() {

    return (

        <Router>

            <Navbar />

            <Routes>

                <Route path="/" element={<Home />} />

                <Route path="/courses" element={<CourseList />} />

                <Route path="/add" element={<CourseForm />} />

                <Route path="/progress/:id" element={<ProgressTracker />} />

                <Route path="/quiz/:id" element={<QuizPage />} />

                </Routes>
                </Router>
    );

}



export default App;
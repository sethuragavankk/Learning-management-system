

import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import * as api from "../api";



export default function CourseList() {

    const [courses, setCourses] = useState([]);

    const navigate = useNavigate();



    useEffect(() => {

        let mounted = true;

        api.fetchCourses()

        .then(data => { if (mounted) setCourses(data); })

        .catch(() => setCourses([]));

        return () => (mounted = false);

    }, []);



    const handleEnroll = async (id) => {

        try {

            await api.enrollInCourse(id, "john_doe");

            window.alert("Enrolled successfully!");

            // refresh list

            const refreshed = await api.fetchCourses();

            setCourses(refreshed);

        } catch (e) {

            window.alert("Enroll failed");

        }

    };



    return (

        <div style={{ padding: 40 }}>

            <div style={{ maxWidth: 800, margin: "0 auto" }}>

                <h3>All Courses</h3>
                {courses.map(course => (

                    <div key={course.id} style={{ background: "#fff", padding: 16, borderRadius: 6, marginBottom: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>

                        <h4>{course.title}</h4>
                        <p>{course.description}</p>

                        <div style={{ display: "flex", gap: 8 }}>

                            <button onClick={() => handleEnroll(course.id)}>Enroll</button>
                            <button onClick={() => navigate(`/progress/${course.id}`)}>Progress</button>
                            <button onClick={() => navigate(`/quiz/${course.id}`)}>Take Quiz</button>
                            </div>
                            </div>
                ))}

                {courses.length === 0 && <div>No courses available</div>}

                </div>
                </div>
    );
}
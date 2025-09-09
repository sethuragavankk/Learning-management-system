import React, { useState } from "react";
import * as api from "../api";
export default function CourseForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [quizText, setQuizText] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        const lines = quizText
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l.includes("*"));
        const course = {
            title,
            description,
            quiz: lines,
        };
        await api.addCourse(course);
        setTitle("");
        setDescription("");
        setQuizText("");
        window.alert("Enrolled successfully!");
    };
    return (
        <div style={{ padding: 40, display: "flex", justifyContent: "center" }}>
            <div style={{
                maxWidth: 600,
                width: "100%",
                background: "#fff",
                padding: 24,
                borderRadius: 10,
                border: "1px solid #ccc",
                boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
            }}>
                <h3 style={{ marginBottom: 16 }}>Add Course</h3>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 12 }}>
                        <input placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{
                                width: "100%",
                                padding: 10,
                                borderRadius: 6,
                                border: "1px solid #ccc",
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{
                                width: "100%",
                                padding: 10,
                                minHeight: 80,
                                borderRadius: 6,
                                border: "1px solid #ccc",
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <textarea
                            placeholder="Quiz questions (question*answer)"
                            value={quizText}
                            onChange={(e) => setQuizText(e.target.value)}
                            style={{
                                width: "100%",
                                padding: 10,
                                minHeight: 120,
                                borderRadius: 6,
                                border: "1px solid #ccc",
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            backgroundColor: "#007bff",
                            color: "#fff",
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: 6,
                            cursor: "pointer",
                            fontWeight: "bold",
                        }}>Add</button>
                </form>
            </div>
        </div>
    );
}
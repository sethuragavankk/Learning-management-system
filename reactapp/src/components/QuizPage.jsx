

import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import * as api from "../api";



export default function QuizPage() {

    const { id } = useParams();

    const [questions, setQuestions] = useState([]); 

    const [answers, setAnswers] = useState([]);



    useEffect(() => {

        let mounted = true;

        api.getQuiz(id)

        .then(qs => {

            if (!mounted) return;

            setQuestions(qs || []);

            setAnswers(new Array((qs || []).length).fill(""));

        })

        .catch(() => setQuestions([]));

        return () => (mounted = false);

    }, [id]);



    const handleChange = (idx, val) => {

        const copy = [...answers];

        copy[idx] = val;

        setAnswers(copy);

    };



    const handleSubmit = async (e) => {

        e.preventDefault();

        // Calculate score

        let score = 0;

        const total = questions.length;

        questions.forEach((q, idx) => {

            const parts = q.split("*");

            const correct = (parts[1] || "").trim().toLowerCase();

            const user = (answers[idx] || "").trim().toLowerCase();

            if (correct && user && user === correct) score++;

        });



        try {

            await api.submitQuiz(id, "john_doe", score);

            window.alert(`You scored ${score}/${total}`);

        } catch (err) {

            window.alert("Submit failed");

        }

    };



    return (

        <div style={{ padding: 40 }}>

            <div style={{ maxWidth: 700, margin: "0 auto", background: "#fff", padding: 20, borderRadius: 8 }}>

                <h3>Quiz</h3>
                <form onSubmit={handleSubmit}>

                    {questions.map((q, idx) => {

                        const parts = q.split("*");

                        const qText = parts[0] ? parts[0].trim() : q;

                        return (

                            <div key={idx} style={{ marginBottom: 12 }}>

                                <label>{qText}</label>
                                <input
                                type="text"

                                role="textbox"

                                value={answers[idx] || ""}

                                onChange={e => handleChange(idx, e.target.value)}

                                style={{ width: "100%", padding: 8 }}

                                />

                                </div>

                        );

                    })}

                    <button type="submit">Submit Quiz</button>
                    </form>
                    </div>
                    </div>
    );

}
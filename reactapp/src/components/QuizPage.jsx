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
      .then((qs) => {
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
  const styles = {
    container: {
      padding: 40,
      display: "flex",
      justifyContent: "center",
    },
       card: {
      maxWidth: 700,
      width: "100%",
      background: "#fff",
      padding: 24,
      borderRadius: 12,
      boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    },
    title: {
      marginBottom: 20,
      fontSize: "1.4rem",
      fontWeight: 600,
    },
    questionBlock: {
      marginBottom: 16,
    },
    label: {
      display: "block",
      marginBottom: 6,
      fontWeight: 500,
    },
    input: {
      width: "100%",
      padding: 10,
      borderRadius: 6,
      border: "1px solid #ccc",
      fontSize: "0.95rem",
    },
    btn: {
      marginTop: 12,
      backgroundColor: "#0d6efd",
      color: "#fff",
      border: "none",
      padding: "10px 18px",
      borderRadius: 6,
      cursor: "pointer",
      fontSize: "1rem",
      transition: "background 0.2s",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h3 style={styles.title}>Quiz</h3>
        <form onSubmit={handleSubmit}>
          {questions.map((q, idx) => {
            const parts = q.split("*");
            const qText = parts[0] ? parts[0].trim() : q;
            return (
              <div key={idx} style={styles.questionBlock}>
                <label style={styles.label}>{qText}</label>
                <input
                  type="text"
                  role="textbox"
                  value={answers[idx] || ""}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  style={styles.input}
                />
              </div>
            );
          })}
          <button type="submit" style={styles.btn}>
            Submit Quiz
          </button>
        </form>
      </div>
    </div>
  );
}
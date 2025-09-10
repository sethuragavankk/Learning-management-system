// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import * as api from "../api";

// export default function ProgressTracker() {
//   const { id } = useParams();
//   const [course, setCourse] = useState(null);
//   const [progressValue, setProgressValue] = useState("");

//   useEffect(() => {
//     let mounted = true;
//     api
//       .fetchCourses()
//       .then((list) => {
//         if (!mounted) return;
//         const found = list.find((c) => String(c.id) === String(id));
//         setCourse(found || null);
//         const val =
//           found && found.progress && found.progress["john_doe"] !== undefined
//             ? found.progress["john_doe"]
//             : 0;
//         setProgressValue(val);
//       })
//       .catch(() => {});
//     return () => (mounted = false);
//   }, [id]);

//   const handleUpdate = async () => {
//     try {
//       await api.updateProgress(id, "john_doe", Number(progressValue));
//       window.alert("Progress updated");
//     } catch (e) {
//       window.alert("Update failed");
//     }
//   };

//   if (!course) return <div style={{ padding: 40 }}>Loading...</div>;

//   // Styles
//   const styles = {
//     container: {
//       padding: 40,
//       display: "flex",
//       justifyContent: "center",
//     },
//     card: {
//       maxWidth: 600,
//       width: "100%",
//       background: "#fff",
//       padding: 24,
//       borderRadius: 12,
//       boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
//     },
//     title: {
//       marginBottom: 20,
//       fontSize: "1.3rem",
//       fontWeight: 600,
//     },
//     input: {
//       width: "100%",
//       padding: 10,
//       borderRadius: 6,
//       border: "1px solid #ccc",
//       marginBottom: 16,
//       fontSize: "1rem",
//     },
//     button: {
//       backgroundColor: "#0d6efd",
//       color: "#fff",
//       border: "none",
//       padding: "10px 18px",
//       borderRadius: 6,
//       cursor: "pointer",
//       fontSize: "1rem",
//       transition: "background 0.2s",
//     },
//   };
// return (
//     <div style={styles.container}>
//       <div style={styles.card}>
//         <h3 style={styles.title}>{course.title} - Progress</h3>
//         <input
//           type="number"
//           role="spinbutton"
//           min="0"
//           max="100"
//           value={progressValue}
//           onChange={(e) => setProgressValue(e.target.value)}
//           style={styles.input}
//         />
//         <button onClick={handleUpdate} style={styles.button}>
//           Update Progress
//         </button>
//       </div>
//     </div>
//   );
// }
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import * as api from "../api";

// export default function CourseList() {
//   const [courses, setCourses] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     let mounted = true;
//     api.fetchCourses()
//       .then((data) => {
//         if (mounted) setCourses(data);
//       })
//       .catch(() => setCourses([]));
//     return () => (mounted = false);
//   }, []);

//   const handleEnroll = async (id) => {
//     try {
//       await api.enrollInCourse(id, "john_doe");
//       window.alert("Enrolled successfully!");
//       const refreshed = await api.fetchCourses();
//       setCourses(refreshed);
//     } catch (e) {
//       window.alert("Enroll failed");
//     }
//   };

//   // styles (all inside the file)
//   const styles = {
//     container: {
//       padding: 40,
//       display: "flex",
//       justifyContent: "center",
//     },
//     card: {
//       maxWidth: 800,
//       width: "100%",
//       background: "#fff",
//       padding: 24,
//       borderRadius: 12,
//       boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
//     },
//     title: {
//       marginBottom: 20,
//       fontSize: "1.4rem",
//       fontWeight: 600,
//     },
//     courseItem: {
//       background: "#f9f9f9",
//       border: "1px solid #e5e5e5",
//       borderRadius: 8,
//       padding: 16,
//       marginBottom: 16,
//     },
//    courseTitle: {
//       margin: "0 0 8px 0",
//     },
//     courseDesc: {
//       margin: "0 0 12px 0",
//       color: "#555",
//     },
//     actions: {
//       display: "flex",
//       gap: 10,
//     },
//     btn: {
//       backgroundColor: "#0d6efd",
//       color: "#fff",
//       border: "none",
//       padding: "8px 16px",
//       borderRadius: 6,
//       cursor: "pointer",
//       fontSize: "0.9rem",
//       transition: "background 0.2s",
//     },
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.card}>
//         <h3 style={styles.title}>All Courses</h3>
//         {courses.map((course) => (
//           <div key={course.id} style={styles.courseItem}>
//             <h4 style={styles.courseTitle}>{course.title}</h4>
//             <p style={styles.courseDesc}>{course.description}</p>
//             <div style={styles.actions}>
//               <button
//                 style={styles.btn}
//                 onClick={() => handleEnroll(course.id)}
//               >
//                 Enroll
//               </button>
//               <button
//                 style={styles.btn}
//                 onClick={() => navigate(`/progress/${course.id}`)}
//               >
//                 Progress
//               </button>
//               <button
//                 style={styles.btn}
//                 onClick={() => navigate(`/quiz/${course.id}`)}
//               >
//                 Take Quiz
//               </button>
//             </div>
//           </div>
//         ))}
//         {courses.length === 0 && <div>No courses available</div>}
//       </div>
//     </div>
//   );
// }
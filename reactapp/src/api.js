// src/api.js

const BASE_URL = "https://8080-acfdaebeabbdafadabdcfaceddbbabeaeefcea.premiumproject.examly.io/api/courses";

export async function fetchCourses() {
    const res = await fetch(`${BASE_URL}`);
    if (!res.ok) throw new Error("Failed to fetch courses");
    return res.json();
}



export async function addCourse(course) {

    const res = await fetch(`${BASE_URL}`, {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(course)

    });

    if (!res.ok) throw new Error("Failed to add course");

    return res.json();

}



export async function enrollInCourse(courseId, student) {

    const res = await fetch(`${BASE_URL}/${courseId}/enroll?student=${encodeURIComponent(student)}`, {

        method: "PUT"

    });

    if (!res.ok) throw new Error("Failed to enroll");

    return res.json();

}



export async function updateProgress(courseId, student, progress) {

    const res = await fetch(`${BASE_URL}/${courseId}/progress?student=${encodeURIComponent(student)}&progress=${progress}`, {

        method: "PUT"

    });

    if (!res.ok) throw new Error("Failed to update progress");

    return res.json();

}



export async function getQuiz(courseId) {

    const res = await fetch(`${BASE_URL}/${courseId}/quiz`);

    if (!res.ok) throw new Error("Failed to fetch quiz");

    return res.json();

}



export async function submitQuiz(courseId, student, score) {

    const res = await fetch(`${BASE_URL}/${courseId}/quiz?student=${encodeURIComponent(student)}&score=${score}`, {

        method: "POST"

    });

    if (!res.ok) throw new Error("Failed to submit quiz");

    return res.text();

}
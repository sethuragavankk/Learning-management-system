

import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import * as api from "../api";



export default function ProgressTracker() {

    const { id } = useParams();

    const [course, setCourse] = useState(null);

    const [progressValue, setProgressValue] = useState("");



    useEffect(() => {

        let mounted = true;

        api.fetchCourses()

        .then(list => {

            if (!mounted) return;

            const found = list.find(c => String(c.id) === String(id));

            setCourse(found || null);

            const val = found && found.progress && found.progress["john_doe"] !== undefined ? found.progress["john_doe"] : 0;

            setProgressValue(val);

        })

        .catch(() => {});

        return () => (mounted = false);

    }, [id]);



    const handleUpdate = async () => {

        try {

            await api.updateProgress(id, "john_doe", Number(progressValue));

            window.alert("Progress updated");

        } catch (e) {

            window.alert("Update failed");

        }

    };



    if (!course) return <div style={{ padding: 40 }}>Loading...</div>


    return (

        <div style={{ padding: 40 }}>

            <div style={{ maxWidth: 600, margin: "0 auto", background: "#fff", padding: 20, borderRadius: 8 }}>

                <h3>{course.title} - Progress</h3>

                <div style={{ marginBottom: 12 }}>

                    <input
                    type="number"

                    role="spinbutton"

                    min="0"

                    max="100"

                    value={progressValue}

                    onChange={e => setProgressValue(e.target.value)}

                    style={{ width: "100%", padding: 8 }}

                    />

                    </div>
                    <button onClick={handleUpdate}>Update Progress</button>
                    </div>
                    </div>
    );

}
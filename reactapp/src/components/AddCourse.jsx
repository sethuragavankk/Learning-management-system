import React, { useState } from 'react';
import './AddCourse.css';
import { coursesAPI } from '../services/api';

const AddCourse = () => {

const [courseData,setCourseData]=useState({

title:'',
description:'',
courseType:'',
difficultyLevel:'Beginner',
duration:'',
instructor:'',
price:'',
maxCapacity:'',
isActive:true,

quizzes:[
{
module:1,
questions:[
{
question:'',
answer:'',
points:1
}
]
}
]

});

const handleInputChange=(e)=>{

const{name,value}=e.target;

setCourseData(prev=>({

...prev,

[name]:
name==="isActive"
?value==="true"
:value

}));

};

const handleQuizChange=(
quizIndex,
questionIndex,
field,
value
)=>{

const updated=[
...courseData.quizzes
];

updated[
quizIndex
]
.questions[
questionIndex
][field]=value;

setCourseData(prev=>({

...prev,
quizzes:updated

}));

};

const addModule=()=>{

setCourseData(prev=>({

...prev,

quizzes:[
...prev.quizzes,

{
module:
prev.quizzes.length+1,

questions:[
{
question:'',
answer:'',
points:1
}
]
}

]

}));

};

const addQuestion=(quizIndex)=>{

const updated=[
...courseData.quizzes
];

updated[
quizIndex
]
.questions.push({

question:'',
answer:'',
points:1

});

setCourseData(prev=>({

...prev,
quizzes:updated

}));

};

const removeQuestion=(
quizIndex,
questionIndex
)=>{

const updated=[
...courseData.quizzes
];

if(
updated[
quizIndex
]
.questions.length===1
)return;

updated[
quizIndex
]
.questions=

updated[
quizIndex
]
.questions.filter(

(_,i)=>i!==questionIndex

);

setCourseData(prev=>({

...prev,
quizzes:updated

}));

};

const handleSubmit=
async(e)=>{

e.preventDefault();

try{

const payload={

title:
courseData.title,

description:
courseData.description,

courseType:
courseData.courseType,

difficultyLevel:
courseData.difficultyLevel,

duration:
Number(
courseData.duration
),

instructor:
courseData.instructor,

isActive:
courseData.isActive,

maxCapacity:
Number(
courseData.maxCapacity
),

price:
Number(
courseData.price
),

quizQuestions:

courseData.quizzes
.flatMap(q=>

q.questions.map(
x=>x.question
)

),

createdAt:
new Date(),

updatedAt:
new Date(),

progress:{},
scores:{},
enrolledStudents:[]

};

await coursesAPI.create(
payload
);

alert(
"Course Added Successfully"
);

}catch(error){

console.log(error);

alert(
"Failed To Add Course"
);

}

};

return(

<div className="add-course-container">

<h1>
Add Course
</h1>

<form
onSubmit={
handleSubmit
}
>

<div className="card">

<input
placeholder="Course Title"
name="title"
value={courseData.title}
onChange={handleInputChange}
required
/>

<textarea
placeholder="Description"
name="description"
value={courseData.description}
onChange={handleInputChange}
required
/>

<select
name="courseType"
value={courseData.courseType}
onChange={handleInputChange}
required
>

<option value="">
Course Type
</option>

<option>
Programming
</option>

<option>
Business
</option>

<option>
Science
</option>

<option>
Design
</option>

</select>

<select
name="difficultyLevel"
value={courseData.difficultyLevel}
onChange={handleInputChange}
>

<option>
Beginner
</option>

<option>
Intermediate
</option>

<option>
Advanced
</option>

</select>

<input
placeholder="Instructor"
name="instructor"
value={courseData.instructor}
onChange={handleInputChange}
/>

<input
type="number"
placeholder="Duration"
name="duration"
value={courseData.duration}
onChange={handleInputChange}
/>

<input
type="number"
placeholder="Price"
name="price"
value={courseData.price}
onChange={handleInputChange}
/>

<input
type="number"
placeholder="Max Capacity"
name="maxCapacity"
value={courseData.maxCapacity}
onChange={handleInputChange}
/>

<select
name="isActive"
value={courseData.isActive}
onChange={handleInputChange}
>

<option value={true}>
Active
</option>

<option value={false}>
Inactive
</option>

</select>

</div>

<h2>
Quiz Modules
</h2>

{
courseData.quizzes.map(

(quiz,quizIndex)=>(

<div
key={quizIndex}
className="module-card"
>

<h3>
Module {
quiz.module
}
</h3>

{

quiz.questions.map(

(question,questionIndex)=>(

<div
key={questionIndex}
className="question-card"
>

<input

placeholder="Question"

value={
question.question
}

onChange={e=>

handleQuizChange(

quizIndex,
questionIndex,
'question',
e.target.value

)

}

/>

<input

placeholder=
"Answer"

value={
question.answer
}

onChange={e=>

handleQuizChange(

quizIndex,
questionIndex,
'answer',
e.target.value

)

}

/>

<input

type="number"

placeholder=
"Points"

value={
question.points
}

onChange={e=>

handleQuizChange(

quizIndex,
questionIndex,
'points',

Number(
e.target.value
)

)

}

/>

<button

type="button"

className=
"danger"

onClick={()=>

removeQuestion(

quizIndex,
questionIndex

)

}

>

Delete

</button>

</div>

)

)

}

<button

type="button"

className="secondary"

onClick={()=>

addQuestion(
quizIndex
)

}

>

Add Question

</button>

</div>

)

)

}

<button

type="button"

className="secondary"

onClick={addModule}

>

Add Module

</button>

<button
type="submit"
>

Create Course

</button>

</form>

</div>

);

};

export default AddCourse;
const express = require("express");
const app = express();

const Joi = require("joi");

app.use(express.json());

const courses = [
    {id: 1, name:"course1"},
    {id: 2, name:"course2"},
    {id: 3, name:"course3"},
    {id: 4, name:"course4"},
    {id: 5, name:"course5"},
];
app.get("/", (req,res)=>{
    res.send("welcome back");
});

app.get("/api/courses", (req,res)=>{
    res.send(courses);
});

app.post("/api/courses", (req,res)=>{
    const result = validateCourse(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put("/api/courses/:id", (req,res)=>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course)  return res.status(404).send("Resource not found");
  
    const result = validateCourse(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }


    course.name = req.body.name;
    res.send(course);
});


function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(course, schema);
}



app.get("/api/courses/:id", (req,res)=>{
    // const course = courses.find(c=>c.id=== parseInt(req.params.id));
    courses.forEach(course=>{
        if(course.id === parseInt(req.params.id)){
            res.send(course);
        }else{
            return res.status(404).send("Resource not found");
        }
    })
});
 

app.delete("/api/courses/:id", (req,res)=>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send("Resource not found");

    const index = courses.indexOf(course);
    courses.splice(index,1);
    res.send(course);

});



const port = process.env.PORT || 4000;
app.listen(port, ()=>console.log(`we are live on localhost:${port}`));
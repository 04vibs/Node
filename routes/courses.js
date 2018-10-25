const express = require('express');
const router = express.Router();
const Joi = require('joi');

const courses = [
    { id:1 , name: 'courses1' },
    { id:2 , name: 'courses2' },
    { id:3 , name: 'courses3' },
    { id:4 , name: 'courses4' },

];



router.get('/',(req,res)=>{
    res.send(courses);
})

router.get('/api/courses/:id',(req,res)=>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send('The course with the given ID was not found ');
    res.send(course);
})

router.get('/api/posts/:year/:month',(req,res)=>{
    res.send(req.query);
})

 router.post('/',(req,res)=>{
  
       
    const { error} = validateCourse(req.body); // result.error

    if(error ) {
        //400 Bad Request
        return res.status(400).send(error.details[0].message);
        
    }

  
    const course = {
        id: courses.length + 1 ,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
 });



 router.put('/:id',(req,res)=>{
    // look up the course
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course)  return res.status(404).send('The course with the given ID was not found ');
   
    const { error} = validateCourse(req.body); // result.error

    if(error ) {
        //400 Bad Request
      return  res.status(400).send(error.details[0].message);
        
    }

    // update course
course.name = req.body.name;
res.send(course);

    // Return the updated course
 });

function validateCourse(course) {
    // validate
    // If invalid, return 404 -Bad request
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course,schema);

}




 router.delete('/:id',(req,res)=>{
    // Look up the course
    const course = courses.find(c => c.id === parseInt(req.params.id));

    // Not existing return 404
    if(!course) 
    return res.status(404).send('The course with the given ID was not found ');
     
    // delete 
    const index = courses.indexOf(course);
    courses.splice(index,1);
    res.send(course);
    // return


 });


 module.exports = router;
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const helmet = require('helmet');
const Joi = require('joi');
const express = require('express');
const logger = require('./logger');
const authentication = require('./authentication');
const morgan = require('morgan');
const app = express();


app.set('view engine','pug');
// optional
app.set('views','./views'); //default

// //environment
// console.log(`Node_ENV: ${process.env.Node_ENV}`);
// console.log(`app: ${app.get('env')}`)

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));
app.use(helmet());
app.use(logger);
app.use(authentication);

//configuration
console.log('Application Name: '+ config.get('name'));
console.log('Mail Server: '+ config.get('mail.host'));
// console.log('Mail Password: '+ config.get('mail.password'));

if(app.get('env')==='development') {
    app.use(morgan('tiny'));
    // console.log('Morgan enabled...')
    startupDebugger('Morgan enabled...');
}

//db work...
dbDebugger('connected to the database...');

const courses = [
    { id:1 , name: 'courses1' },
    { id:2 , name: 'courses2' },
    { id:3 , name: 'courses3' },
    { id:4 , name: 'courses4' },

];

app.get('/',(req,res)=>{
//res.send('hello world');
res.render('index',{
    title: 'My Express App',
    message: 'Hello'
    })
});


app.get('/api/courses',(req,res)=>{
    res.send(courses);
})

app.get('/api/courses/:id',(req,res)=>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send('The course with the given ID was not found ');
    res.send(course);
})

app.get('/api/posts/:year/:month',(req,res)=>{
    res.send(req.query);
})

 app.post('/api/courses',(req,res)=>{
  
       
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



 app.put('/api/courses/:id',(req,res)=>{
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


//PORT
const port = process.env.PORT ||3000;
app.listen(port,()=>{
    console.log(`listening port ${port}`);
})



 app.delete('/api/courses/:id',(req,res)=>{
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
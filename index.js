const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const helmet = require('helmet');

const express = require('express');
const logger = require('./middleware/logger');
const authentication = require('./authentication');
const morgan = require('morgan');

const app = express();

const courses = require('./routes/courses')
const home = require('./routes/home')
const postyear = require('./routes/postyear')

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


app.use('/api/courses',courses);
app.use('/',home);
app.use('/api/posts',postyear);

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
//PORT
const port = process.env.PORT ||3000;
app.listen(port,()=>{
    console.log(`listening port ${port}`);
})


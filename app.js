const express = require('express')
const app =express()
const path = require('path')
const sequelize =require('./databaseCon')
const task =require('./models/tasks')
const bodyParser = require('body-parser');
const cookieParser  = require('cookie-parser')

const flash = require('express-flash');
const session = require('express-session');

// Configure express-session middleware
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 2000 }, 
  })
);

app.use(flash());


app.use(express.static(path.join(__dirname, 'public')))

app.use(cookieParser());

app.set('views',path.join(__dirname,"views"))
app.set('view engine', 'pug')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req,res)=>{
    task.findAll().then(tasks=>{
        console.log(tasks)
        res.render('index', {tasks : tasks, messages: req.flash()})
    })
})


let taskRoutes=require('./routes/task')
app.use('/task', taskRoutes)
let userRoutes=require('./routes/user')
app.use('/user', userRoutes)

app.listen(3000)
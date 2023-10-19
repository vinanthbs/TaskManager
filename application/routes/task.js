const express=require('express')
const router =express.Router();
const sequelize =require('../databaseCon')
const task =require('../models/tasks')
var temp = " " 
const jwt = require('jsonwebtoken')

const  verify=(req, res, next)=>{
    const token = req.cookies.accesstocken; 
    console.log(token)
    if(token){

        jwt.verify(token, "vinanth", (err, user)=>{
            if (err){
                res.status(403)
                console.log('token is not valid')
                res.redirect('/user/login')
            }
            else{
                req.user=user
                next()
            }
        })
    }
    else{
        res.status(403)
        console.log("you are not authenticated, login for further action")
        res.redirect("/user/login")
    }
}


router.get('/addTask', (req, res)=>{
    res.render('addtask')
})

router.post('/addTask' ,async (req, res) => {
    const formdata = {
        task_title: req.body.task_title,
        task_desc: req.body.task_desc,
        task_status: req.body.task_status,
        task_duedate: req.body.task_duedate
    };

    try {
        console.log(formdata);

        await sequelize.sync(); // Assuming this sets up the database

        const newtask = await task.create({
            task_title: formdata.task_title,
            task_desc: formdata.task_desc,
            task_status: formdata.task_status,
            task_duedate: formdata.task_duedate,
        });

        console.log('New task created:', newtask);

        res.redirect('/');
    } catch (error) {
        console.error('Failed to create a new record:', error.message);
        res.status(500).send('Failed to create a new record: ' + error.message);
    }
    
});

router.get('/view/:t_id', async (req,res)=>{
    const taskid=req.params.t_id ;
    temp=taskid
    await task.findOne({
        where : {t_id : taskid}
    }).then(tasks=>{
        console.log(tasks)
        res.render('view',{tasks : tasks})
    })
})

router.get('/editask/:t_id',async (req,res)=>{
    const taskid=req.params.t_id ;
    await task.findOne({
        where : {t_id : taskid}
    }).then(tasks=>{
        console.log(tasks)
        res.render('editask',{tasks : tasks})
    })
})

router.post('/editask/:t_id', async (req,res)=>{
    const taskid=req.params.t_id ; 
    const formdata = {
        task_desc: req.body.task_desc,
        task_status: req.body.task_status,
        task_duedate: req.body.task_duedate
    };

        const etask = await task.findOne({
            where : {t_id : taskid}
        })

        if(etask){
            etask.task_desc =formdata.task_desc,
            etask.task_status=formdata.task_status,
            etask.task_duedate=formdata.task_duedate

            await etask.save();
            temp=' '
            res.redirect(200, '/')
        }
        else{
            res.redirect(200,'/')
            console.log('no record found with respected ID')
        }

})

router.get('/delete', async (req,res)=>{
    const name = temp
    task.destroy({
        where: {
            t_id: name 
        }
    }).then(tasks => {
        console.log(tasks)
        res.redirect('/');
})  
})

router.get('/openTasks', (req,res)=>{
    task.findAll({
        where: {task_status : 'Open' }
    }).then(tasks=>{
        console.log(tasks)
        res.render('index',{tasks : tasks})
    })
})

module.exports=router
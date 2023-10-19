const express=require('express')
const router =express.Router();
const sequelize =require('../databaseCon')
const user =require('../models/users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const GOOGLE_APP_EMAIL ='vinanth@apprikart.com'
const GOOGLE_APP_PW ='LOGCf1XaIjkMbSEn'
const RESET_PASSWORD_KEY='@alc09WD'
const nodemailer =require('nodemailer')
var token=''


router.get('/register',(req, res)=>{
    res.render('register')
})

router.post('/register',  (req, res)=>{
    console.log('entred post register')
    const formdata = {
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        password : req.body.password,
        password2 : req.body.password2
    };

    if(req.body.password!=req.body.password2){
        req.flash('error', 'passowrd did not match.');
        res.render('register',{
            messages: req.flash()
        })
        console.log('password mismatch')
    }
    else{
        bcrypt.genSalt(10, (error, salt)=>{
            bcrypt.hash(formdata.password, salt, (err,hash)=>{
                if(err){
                    console.log(err)
                }
                formdata.password=hash
                console.log(formdata)

        try {
            console.log(formdata);
    
             sequelize.sync(); 
    
            const newuser =  user.create({
                username: formdata.username,
                email: formdata.email,
                phone: formdata.phone,
                password: formdata.password,
            });
    
            console.log('New user created:', newuser);
            req.flash('success', 'New user created');
            res.redirect('/');
        } catch (error) {
            console.error('Failed to create a new record:', error.message);
            res.status(500)
            console.log('Failed to create a new record: ' + error.message);
            req.flash('error', 'Failed to create New user ');
            res.redirect('/register')
        }
    })
})
    }
})

router.get('/login',(req, res)=>{
    res.render('login')
})

router.post('/login',  (req, res)=>{
    const formdata = {
        email: req.body.email,
        password : req.body.password
    }

    user.findOne({
        where:{email:formdata.email}
    }).then(user=>{
        console.log(user)
        const passwordFromDb=user.password
        bcrypt.compare(formdata.password, passwordFromDb, (err, isMatch) => {
            
            if (err) {
                console.log('entred err')
                console.error('Error comparing passwords:', err);
                return;
            }
            if (isMatch) {
                console.log('isMatch')
                const accesstocken =jwt.sign({userid : user.email}, 'vinanth',{expiresIn : '30s'})
                res.cookie('accesstocken', accesstocken, { httpOnly: true });
                console.log(accesstocken)
                req.flash('success', 'login sucessful');
                res.redirect('/')
                console.log('Login successful!');
            } 
            if(!isMatch) {
                console.log('entred else')
                req.flash('error','invalid password, try again')
                res.redirect('login')
                console.log('Login failed: Invalid password!');
            }
    })
    })
})

router.get('/logout', (req,res)=>{
    req.flash('success', 'Logged out successfully.');   
    res.clearCookie('accesstocken')
    res.redirect('/')
})

router.get('/forgetPassword', (req,res)=>{
    res.render('forgetpass')
})

router.post('/forgetPassword', (req, res)=>{
    const email =req.body.emailid;
    const phonenumber =req.body.phone
    console.log(email)

    if(!phonenumber){
    user.findOne({
        where:{email: email}
    }).then(user=>{
        console.log(user)
    })

    if(GOOGLE_APP_EMAIL && GOOGLE_APP_PW) {        
          if ( !user) {
            return res.status(400).json({error: 'User with this email does not exist'})
          }
          
          token = jwt.sign({id: user.id}, RESET_PASSWORD_KEY, {expiresIn: '15m'})
            console.log('token generated! '+token)
      
          let transporter = nodemailer.createTransport({
                host: 'smtp-relay.brevo.com',
                port: 465,
                secure: true,
                auth: {
                    user: GOOGLE_APP_EMAIL,
                    pass: GOOGLE_APP_PW
                },
          });
          
          const data = {
            from:'vinanth@apprikart.com',
            to: email,
            subject: 'Reset Account Password Link',
            html: `
                <h3>Please click the link below to reset your password</h3>
                <p>https://localhost:3000/user/resetpassword/${token}</p>
                `,
          }
          
              transporter.sendMail(data, function(error, body) {
                if (error) {
                  return res.status(400).json({error: error.message})
                }
                return res.status(200).json({message: 'Email has been sent, please follow the instructions'})
              })
            }
          
       else{
       return res.status(400).json({error: 'You have not set up an account to send an email or a reset password key for jwt'})    
       }
    }
    else{
        user.findOne({
            where:{phone: phonenumber}
        }).then(user=>{
            console.log(user)
        })
        res.send()
    }
    })

router.get('/resetPassword/:token', (req, res)=>{
    const clitoken =req.params.token
    console.log(clitoken)
    if(clitoken==token){
    res.render('resetpassword' )
    }
    else{
        res.redirect('/forgetPassword')
    }
})

router.post('/resetPassword', (req, res)=>{
    password=req.body.password;
    password2=req.body.password2;

    

    if(password==password2){
        bcrypt.genSalt(10, (error, salt)=>{
            bcrypt.hash(password, salt, (err,hash)=>{
                if(err){
                    console.log(err)
                }
                formdata.password=hash

            })
        })
                
    }else{
        res.redirect('/resetPassword/'+token)
    }

})

module.exports=router
'use strict';
var express = require('express')
var app = express()
var bodyparser = require('body-parser')
var morgan = require('morgan')
var mongoose = require('mongoose')
var user = require('./dbs/models/user')
// nodemailer 
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'Gmail',
    auth: {
      user: 'hogarbarber2016@gmail.com',
      pass: 'HogarBarber@123'
    }
  });



let port = process.env.port || 8080;
let uri ="mongodb://admin:admin123@ds159978.mlab.com:59978/hogar-barber";

mongoose.Promise = global.Promise;
mongoose.connect(uri, { useNewUrlParser: true }, (
  console.log('db connected!')
));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use(morgan('dev'));

//routes
app.get('/', (req, res) => {
  res.send('api working!')
// });
// app.post('/registerUser/email=:email&password=:password&userId=:userId(\d+)', (req,res) => {
//   let email = req.params.email;
//   let password = req.params.password;
//   let userId = req.param.userId;
//   res.send(req.params);
})
app.post('/newUser/:email&:password&:userId', (req, res) => {
  let email = req.params.email;
  let password = req.params.password;
  let userId = req.params.userId;
  let hexCode = Math.floor((Math.random() * 1000000) +1);
  let newUser = new user(
    // email, password, userId, hexCode
    req.params
  );
  // sendMail(email, hexCode.toString());
  // console.log('sending mail');
  
  newUser.save();
  res.json(
    {
      message: 'User registered succesfully',
      email: email,
      userId: userId,
    }
  );
  })

app.get('/verifyEmailWithOtp/:userId', (req, res) => {
  let userid = req.params.userId;
  console.log()
  console.log(req.params.userId)
  user.findOne({userId: userid}, (err, data) => {
    if(err) {
      console.log(err)
    };
    let user = data;
    let _hexCode = user.hexCode;
    let email = user.email;
    sendMail(email, _hexCode.toString());
  }) 
  user.find({userId: userid}, (err, data) => {
    if(err) throw(err);
    console.log(data);
    
  });
});

app.post('/conformEmail/:userId&:hexcode', (req, res) => {
  console.log(req.pa);
  
    user.findOne({userId: req.params.userId}, (err, data) =>{
      if(err) console.log(err);
      let user = data;
      if( req.params.hexcode == user.hexCode) {
        res.status(200);
        res.json(
          {
            message: 'email verified succesfully!'
          }
        )
      }
      else {
        res.status(205);
        res.json({
          message: 'Incorrect hexcode'
        })
      }
      
    });
});

// function sendMailToUser(email, hexCode) {
  const mailOptions = {
    from: 'hogarbarber2016@gmail.com',
    to: 'thribhu.kumar@gmail.com' ,
    subject: 'Thanks for registering with hogarbarber. Please check this link to know more!',
    text: 'hello thribhuvan'
  };

//   transporter.sendMail(mailOptions, (err, info) => {
//     if(err) console.log(err)
//     else
//       console.log(info);
//   });
// }

function sendMail(to, hexcode) {
  const mailOptions = {
    from: 'hogarbarber2016@gmail.com',
    to: to,
    subject: 'Thanks for registering with hogarbarber. Please check this link to know more!',
    text: hexcode
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log(err);
    console.log(info);
  })
}
app.listen(port);
console.log('app running on port '+port);

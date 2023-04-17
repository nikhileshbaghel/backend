const express = require('express');
const { default: mongoose } = require('mongoose');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/User');
const {Schema} = mongoose;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'nikhilisagoodboy';

// ROUTE 1 : login router for CREATING the user;;

router.post('/createuser' ,[
    body('email','enter a valid email').isEmail(),//enter a valid email is a msg we get if the email is not appropriate
    body('name','enter a valid name').isLength({ min: 3 }),  //these are the condition on body request///
  body('password').isLength({ min: 5 })  //these are the condition on body request///
], async (req,res) => {
    console.log(req.body);
    let success = false;
    const errors = validationResult(req);
    if(!errors.isEmpty()){ //this is for error in body ;;
        return res.status(400).json({errors : errors.array()});
    }

    try {//yha problem aayi thi..
        let user = await User.findOne({ email: req.body.email });
        if (user) {
          return res.status(400).json({ error: "Sorry a user with this email already exists" })
        }

     const salt = await bcrypt.genSalt(10);
       const secPass = await bcrypt.hash(req.body.password,salt);

        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
          });
          //res.json(user)

          const data = {
            user: {
              id : user.id
            }
          };

         // const jwtData = jwt.sign(data,JWT_SECRET);

         // console.log(jwtData);
          const authtoken = jwt.sign(data,JWT_SECRET); //this is for security perpose and u should include install npm jsonwebtoken and use it and specify jwt_secret;
          success = true;
          res.json({success,authtoken:authtoken});//res.json(authtoken) both will work since name is same;
          //res.json(user);

        } catch (error) {
          console.error(error.message);
          res.status(500).send("Some Error occured");
        }

      /* .then(user => res.json(user))
      .catch(err => {console.log(err);
        res.json({error : 'please enter a valid unique email address'}); 
      }) */


//const user = User(req.body);
//user.save();
  //  res.send(req.body);
  //  res.json(us)
})

// ROUTE 2 : login router for authenticate the user;;


router.post('/login', [
  body('email','enter a valid email').isEmail(), //these are the condition on body request///
  body('password','password cannot be blank').exists() //these are the condition on body request///
], async(req,res) => {
    let success = false;
    console.log(req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){ //this is for error in body ;;
        return res.status(400).json({errors : errors.array()});
    }

    const {email,password}  = req.body;
    try{
      let user = await User.findOne({email});
      if(!user)
      {
       return res.status(400).json({error : 'please try to login with correct credentials'});
      }

      const passwordCompare = await bcrypt.compare(password,user.password);

      if(!passwordCompare){
        return res.status(400).json({error : 'please try to login with correct credentials'});
      }
      
      const data = {
        user: {
          id:user.id
        }
      }
      const authtoken = jwt.sign(data,JWT_SECRET);
      success = true;
      res.json({success,authtoken});

    }
    catch(error){
         console.log(error.message);
         res.status(500).send("internal server error occurred");
    }
 })


 // ROUTE 3 : GET loggedin user details using post /getuser :login required;

router.post('/getuser', fetchuser,  async (req, res) => {

  try {
    console.log(req.user);
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }

})


module.exports = router;
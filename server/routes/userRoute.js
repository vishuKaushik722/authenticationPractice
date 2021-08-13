const express = require("express");
const router = express.Router();
const User = require("../model/userModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.post('/register', (req, res) => {
    const { email, password } = req.body;

    
  
    try {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          return res.status(422).send("error in generating salt")
        }
  
        bcrypt.hash(password, salt, async (err, hash) => {
          if(err) {
            return res.status(422).send("error in hashing")
          }
          
          const user = new User({
              email, password: hash
          })

          const newUser = await user.save();
          console.log("SAVED")
          const token = jwt.sign({ userId: req.body.id}, 'MY_SECRET_KEY' );
          res.send({
            token, email
          });
        })
      })
    } catch(err) {
      console.log(err);
    }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if(!email || !password) {
      return res.status(422).send("Try again");
    }

    const user = await User.findOne({
      email, password
    });

    if(!user) {
      return res.send("User does not exist")
    }

    await bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
          return res.status(422).send("error in comparing password");
      }
      if (!isMatch) {
          return res.status(422).send("Password does not match");
      }
      if (isMatch) {
          const token = jwt.sign({ userId: user.id }, 'MY_SECRET_KEY');
          res.send(token);
      }
  });

  } catch(err) {
    console.log(err);
  }
})

module.exports = router;
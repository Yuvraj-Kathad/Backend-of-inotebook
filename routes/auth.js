const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'Yuvisago0db0$oy!';

// ROUTE-1: Create a User using POST : "/api/auth/createuser". Doesn't req. auth or no login req.

router.post('/createuser', [
    body('name', 'Enter name must be atleast of 3 characters.').isLength({min:3}),
    body('email', 'Enter a unique email!').isEmail(),
    body('password', 'Enter password of length atleast 5').isLength({min:5})
], async (req, res) => {

    // If there are errors, return Bad request and the errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create a new user
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass
      });
      const data = {
        user:{
          id : user.id
        }
      }
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({authToken});
      // res.json(user);

    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
    // try {
    //     validationResult(req).throw();
    //     res.send(req.body);
    //   } catch (e) {
    //     res.status(400).send({ errors: e.mapped() });
    //   }
})


// ROUTE-2: Authenticate a User using POST : "/api/auth/login". No login req.

router.post('/login', [
  body('email', 'Enter a unique email!').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {

  // If there are errors, return Bad request and the errors.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email, password} = req.body;
  try {
    let user = await User.findOne({email});
    if(!user)
    {
      return res.status(400).json({error: 'Please try to login with correct credentials'})
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare)
    {
      return res.status(400).json({error: 'Please try to login with correct credentials'})
    }

    const data = {
      user:{
        id : user.id
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET);
    res.json({authToken});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error!' });
  }
})

// ROUTE-3: Get loggin User Details using POST : "/api/auth/getuser". Login required.

// router.post('/getuser', async (req, res) => {
//     try {
      
//     } catch (error) {
      
//     }
// })


module.exports = router
const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailvalidator = require("email-validator");
const User = require('../../models/User');
const auth = require("../../middleware/auth");

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!emailvalidator.validate(email)) res.status(400).send({message: 'Invalid Email!'});

    const newUser = {...req.body, password: bcrypt.hashSync(password, 5)};

    let user = await User.findOne({email: newUser.email});

    if (user)
      return res.status(400).json({
        message: "Aleady exist with same email!"
      });

    user = await User.create(newUser);

    if (!user)
      return res.status(400).json({
        message: "Can not create user!"
      });

    const payload = {
      user: {
        id: user._id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECURITY, {
        expiresIn: 3600
      },
      (err, token) => {
        if (err) throw err;

        user.password = undefined;
        
        res.json({ message: 'User added successfully', data: { user: user, token: token } });
      }
    );
  } catch (e) {
    res.status(500).json({
      message: "Server Error",
      error: e
    });
  }
});

router.post('/login', async (req, res) => {
  console.log(process.env.JWT_SECURITY, 'process.env.JWT_SECURITY')
  try {
    const { email, password } = req.body;

    if (!emailvalidator.validate(email)) res.status(400).send({message: 'Invalid Email!'});
  
    let user = await User.findOne({
      email: email
    });

    if (!user)
      return res.status(400).json({
        message: "User Not Exist!"
      });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({
        message: "Incorrect Password !"
      });

    const payload = {
      user: {
        id: user._id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECURITY,
      {
        expiresIn: 3600
      },
      (err, token) => {
        if (err) throw err;

        user.password = undefined;
        
        res.json({ message: 'User login successfully!', data: { user: user, token: token } });
      }
    );
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "Server Error",
      error: e
    });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.password = undefined;

    res.json({ data: { user: user } });
  } catch (e) {
    res.send({ message: "Error in Fetching user", error: e });
  }
});

module.exports = router;
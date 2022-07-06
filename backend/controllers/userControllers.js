const asyncHandler = require("express-async-handler");
const User = require("../models/userModel").User;
const Plant = require("../models/userModel").plants;
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const mongoose = require("mongoose");
const fetchModel = require("../models/userModel");

const registerUser = async (req, res) => {
  const { user, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const salt = await bcrypt.genSalt(10);
  let passwd = await bcrypt.hash(password, salt);
  const usuari = await User.create({
    user,
    email,
    password: passwd,
    history: [],
  });

  if (user) {
    res.status(201).json({
      _id: usuari._id,
      name: usuari.name,
      email: usuari.email,
      token: generateToken(usuari._id),
    });
  } else {
    res.status(400);
    throw new Error("Error with User Registration");
  }
};

const loginUser = async (req, res) => {
  getLatitude();

  const { email, password } = req.body;

  getData();
  const user = await User.findOne({ email });
  console.log(await user.matchPassword(password));
  if (user && (await user.matchPassword(password))) {
      res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
      });
  }
  else {
      res.status(400)
      throw new Error('Invalid Email or Password')
  }
};

const getData = () => {
  const Adate = new Date(Date.now());
  const Alocation = {
    latitude: "1.2346",
    longitude: "2.63564",
  };
  const Atree = {
    name: "Arbolaco",
    info: "Es un arbol sin alergias",
    image: "image2.jpg",
  };
  (hist = {
    history: {
      date: Adate,
      location: Alocation,
      tree: Atree,
    },
  }),
    function (error, success) {
      console.log(success);
    };
  const user = User.findOneAndUpdate(
    { _id: "628bda564d7f3dc9a3fa0fde" },
    { $push: hist },
    (error, success) => {
      error ? console.log(error) : console.log(success);
    }
  );
};

const getLatitude = async () => {
  let data = "";
  console.log("#######################");
  await User.findOne({ user: "Brian" }, (err, u) => {
    console.log(u.history[0].location);
    data = u.history[0].location;
  })
    .clone()
    .catch((err) => {
      console.log(err);
    });
};

const getUserHistory = async (req, res) => new Promise((resolve, reject) => {
  Plant.find({}, (error, data) => {
    if (error) {
      reject(error);
    } else {
      resolve(data);
    }
  });
});

module.exports = { registerUser, loginUser, getData, getUserHistory };

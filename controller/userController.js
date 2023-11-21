const db = require("../model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { USER } = require("../message.json");
const jsonData = require("../accessPoint.json");
// create Main Model
const User = db.users;

// add user
const addUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findAll({ where: { email: email } });
  if (user.length <= 0) {
    try {
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          res.send({ msg: USER.HASING_ERROR, error: err.message });
        } else {
          const user = await User.create({ ...req.body, password: hash });
          res.status(200).send({ msg: USER.USER_CREATED, user });
        }
      });
    } catch (error) {
      res.send({ msg: USER.HASING_ERROR, error: error.message });
    }
  } else {
    res.status(409).send({ msg: USER.USER_EXIST });
  }
};

// get user
const getUser = async (req, res) => {
  let users = await User.findAll({});
  res.status(200).send(users);
};

// get user by id
const getUserById = async (req, res) => {
  // let id = req.params.id;
  let id = req.user.userID;
  try {
    let user = await User.findOne({ where: { id: id } });
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send({ msg: "User not found" });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

// update user by id
const updateUser = async (req, res) => {
  let id = req.params.id;
  const user = await User.update(req.body, { where: { id: id } });
  res.status(200).send({ msg: USER.UPADTE_USER, user });
};

// 5. delete user by id
const deleteUser = async (req, res) => {
  let id = req.params.id;
  await User.destroy({ where: { id: id } });
  res.status(200).send(USER.USER_DELETED);
};

//user login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      bcrypt.compare(password, user.password, async (err, result) => {
        if (result) {
          let token = jwt.sign({ userID: user.id, role: user.role,permissions : user.permissions }, "sonu"/* secret key*/ );
          res.status(200).send({ msg: USER.LOGIN_SUCCESSFULL, token: token });
        } else {
          res.status(400).send({ msg: USER.WRONG_CREDENTIAL });
        }
      });
      
    } else {
      res.status(404).send({ msg: USER.USER_NOT_FOUND });
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const accessPoint = async (req, res) => {
  try {
    if (jsonData) {
      res.status(200).send(jsonData);
    } else {
      res.status(404).send({ msg: "data not found" });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  addUser,
  getUser,
  getUserById,
  updateUser,
  deleteUser,
  login,
  accessPoint,
};

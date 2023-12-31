const db = require("../model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { USER } = require("../message.json");

const randomstring = require("randomstring");
const nodemailer = require("nodemailer");

const sendResetPasswordMail = async (firstName, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "sonu.kumar@furation.tech",
        pass: "",
      },
    });

    const mailOptions = {
      from: "sonu.kumar@furtion.tech",
      to: email,
      subject: "For Reset Password",
      html: `<p>Hi ${firstName}, Please Copy The Link and <a href="http://localhost:3000/change-password?token=${token}">Reset Your Password.</a> </p>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Mail has been sent.", info.response);
      }
    });
  } catch (error) {
    res.status(400).send({ msg: error, message });
  }
};

const sendEmailAndPassword = async (firstName, email, password) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "sonu.kumar@furation.tech",
        pass: "",
      },
    });

    const mailOptions = {
      from: "sonu.kumar@furtion.tech",
      to: email,
      subject: "Login Credential.",
      html: `<p>Hi ${firstName},Your Email : ${email} and Password : ${password}.
       Please visit The Link and <a href="http://localhost:3000">Login into the dashboard.</a> </p>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Mail has been sent.", info.response);
      }
    });
  } catch (error) {
    res.status(400).send({ msg: error, message });
  }
};
// create Main Model
const User = db.users;

// add user
const addUser = async (req, res) => {
  const { email } = req.body;
  const randomPassword =
    "das" + Math.floor(100 + Math.random() * 900).toString();
  const user = await User.findAll({ where: { email: email } });
  if (user.length <= 0) {
    try {
      bcrypt.hash(randomPassword, 5, async (err, hash) => {
        if (err) {
          res.send({ msg: USER.HASING_ERROR, error: err.message });
        } else {
          const user = await User.create({ ...req.body, password: hash });
          sendEmailAndPassword(
            req.body.firstName,
            req.body.email,
            randomPassword
          );
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
          let token = jwt.sign(
            { userID: user.id, role: user.role, permissions: user.permissions },
            "sonu" /* secret key*/
          );
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

// get access point
// const accessPoint = async (req, res) => {
//   try {
//     if (jsonData) {
//       res.status(200).send(jsonData);
//     } else {
//       res.status(404).send({ msg: "data not found" });
//     }
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// };

// forget password
const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      const token = randomstring.generate();
      const updateTokenInUser = await User.update(
        { token: token },
        { where: { email: email } }
      );
      sendResetPasswordMail(user.firstName, user.email, token);
      res
        .status(200)
        .send({ msg: "please check your inbox of mail.", updateTokenInUser });
    } else {
      res.status(404).send({ msg: "This Email Doesn't exist." });
    }
  } catch (error) {
    res.status(500).send({ msg: "internal server error", error });
  }
};

// reset password
const resetPassword = async (req, res) => {
  const { token } = req.query;
  console.log(token);
  try {
    const tokenUser = await User.findOne({ where: { token: token } });
    if (tokenUser) {
      const password = req.body.password;
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          res.status().send({ msg: USER.HASING_ERROR, error: err.message });
        } else {
          const updateUserPassword = await User.update(
            { password: hash, token: "" },
            { where: { email: tokenUser.email } }
          );
          res
            .status(200)
            .send({ msg: "password has been updated.", updateUserPassword });
        }
      });
    } else {
      res.status(404).send({ msg: "This link has been expired." });
    }
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
};

module.exports = {
  addUser,
  getUser,
  getUserById,
  updateUser,
  deleteUser,
  login,
  // accessPoint,
  forgetPassword,
  resetPassword,
};

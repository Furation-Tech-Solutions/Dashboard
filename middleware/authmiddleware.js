const db = require("../model");
const User = db.users;
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, "sonu", (err, decoded) => {
      if (decoded) {
        // req.body.userID = decoded.userID;
        req.user = decoded;
        next();
      } else {
        res
          .status(401)
          .send({ msg: "Token didn't match, Please Login First!" });
      }
    });
  } else {
    res.status(401).send({ msg: "please login first!" });
  }
};

const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (allowedRoles.includes(userRole)) {
      next();
    } else {
      // User does not have the required role, send a forbidden status
      res.status(403).json({ error: "Access forbidden" });
    }
  };
};

const checkPermission = (allowedRoles) => {
  return (req, res, next) => {
    const userPermission = req.user.permissions;
    if (userPermission.includes(allowedRoles[0])) {
      next();
    } else {
      // User does not have the permission to access the route, send a forbidden status
      res.status(403).json({ msg: "Access forbidden" });
    }
  };
};

module.exports = { authMiddleware, checkRole , checkPermission };

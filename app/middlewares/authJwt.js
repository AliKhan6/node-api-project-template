const jwt = require("jsonwebtoken");
const config = require("../config/config.js");
const db = require("../models");
const User = db.user;
const { isEmpty, isNull, includes, orderBy, isFunction, isUndefined } = require('lodash');


verifyToken = (req, res, next) => {
  let token = extractToken(req);
  console.log(token);
  if (!token) {
    return res.send({
      success: false, error: "No token provided!", body: null
    });
  }
  jwt.verify(token, config.auth.secret, (err, decoded) => {
    if (err) {
      return res.send({
        success: false, error: "Unauthorized!", body: null
      });
    }
    req.user_id = decoded.id;
    next();
  });
};

getUserId = (req, res, next) => {
  let token = extractToken(req);
  console.log(token);


  jwt.verify(token, config.auth.secret, (err, decoded) => {
    if (err) {
      // return res.send({
      //   success: false, error: "Unauthorized!", body: null
      // });
    }
    console.log(decoded);
    if (isUndefined(decoded)) {
      console.log("user not registered");
    } else {
      req.user_id = decoded.id;
    }
    // console.log(req.user_id);
    next();
  });
};

function extractToken(req) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
}

isSuperAdmin = (req, res, next) => {
  User.findByPk(req.user_id).then(user => {
    console.log(`isAdmin::userId => ${user.id}`);
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "super-admin") {
          next();
          return;
        }
      }
      res.status(200).send({
        success: false,
        error: "Super Admin role required!",
        body: null
      });
    });
  }).catch(err => {
    res.status(200).send({
      success: false,
      error: "User not found.",
      body: null
    });
  });;
};

isAdmin = (req, res, next) => {
  User.findByPk(req.user_id).then(user => {
    console.log(`isModerator::Userid => ${user.id}`);
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }
      res.status(200).send({
        success: false,
        error: "Admin role required!",
        body: null
      });
    });
  }).catch(err => {
    res.status(200).send({
      success: false,
      error: "User not found.",
      body: null
    });
  });;
};

isUser = (req, res, next) => {
  User.findByPk(req.user_id).then(user => {
    console.log(`isUser::Userid => ${user.id}`);
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "user") {
          next();
          return;
        }
      }
      res.status(200).send({
        success: false,
        error: "User role required!",
        body: null
      });
    });
  }).catch(err => {
    res.status(200).send({
      success: false,
      error: "User not found.",
      body: null
    });
  });;
};


isModerator = (req, res, next) => {
  User.findByPk(req.user_id).then(user => {
    console.log(`isModerator::Userid => ${user.id}`);
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }
      }
      res.status(200).send({
        success: false,
        error: "Moderator role required!",
        body: null
      });
    });
  }).catch(err => {
    res.status(200).send({
      success: false,
      error: "User not found.",
      body: null
    });
  });;
};

isAdminOrSuperAdmin = (req, res, next) => {
  console.log(req.user_id);
  User.findByPk(req.user_id).then(user => {
    console.log(`isModeratorOrAdmin::Userid => ${user.id}`);
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
        if (roles[i].name === "super-admin") {
          next();
          return;
        }
      }
      res.status(200).send({
        success: false,
        error: "Super Admin or Admin role required!",
        body: null
      });
    });
  }).catch(err => {
    res.status(200).send({
      success: false,
      error: "User not found.",
      body: null
    });
  });

};
const authJwt = {
  verifyToken: verifyToken,
  isUser: isUser,
  isModerator: isModerator,
  isAdmin: isAdmin,
  isSuperAdmin: isSuperAdmin,
  isAdminOrSuperAdmin: isAdminOrSuperAdmin
};

module.exports = authJwt;

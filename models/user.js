'use strict';

let bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    firstname: {
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: 'Cmon, you have a name, right?'
        }
      }
    },
    lastname: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Hey, Please give a valid email address! :D'
        }
      }
    },
    username: DataTypes.STRING,
    birthdate: DataTypes.DATE,
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [6, 25],
          msg: 'Your password must be between 6 and 25 characters. Please try again!'
        }
      }
    },
    photoUrl: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          msg: 'must be a valid image url'
        }
      }
    },
    bio: DataTypes.TEXT,
    admin: DataTypes.BOOLEAN
  }, {
    hooks: {
      beforeCreate: pendingUser => {
        if (pendingUser && pendingUser.password) {
          //Hash the password
          let hashedPassword = bcrypt.hashSync(pendingUser.password, 12)
          //Reassign the password field with the hashed value
          pendingUser.password = hashedPassword  //This whole thing can be written on one line "let pendingUser.password = bcrypt.hashSync(pendingUser.password, 12)"
        }
      }
    }
  });

  user.associate = function(models) {
    // associations can be defined here
  };

  return user;
};
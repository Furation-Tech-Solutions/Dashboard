module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
    },
    permissions: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    token: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
  });

  return User;
};

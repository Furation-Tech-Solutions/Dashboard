module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define("role", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    permissions: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  });

  return Role;
};

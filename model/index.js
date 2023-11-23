const dbConfig = require("../config/db.config");

const { Sequelize, DataTypes } = require("sequelize");
const { DATABASE } = require("../message.json");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log(DATABASE.CONNECTED);
  })
  .catch((err) => {
    console.log({ msg: DATABASE.ERROR_CONNECTING, err: err });
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// createing table
// db.dashboard = require("./dashboardModel.js")(sequelize, DataTypes);
db.users = require("./userModel.js")(sequelize, DataTypes);
db.roles = require("./roleModel.js")(sequelize, DataTypes);

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log(DATABASE.SYNC);
  })
  .catch((err) => {
    console.log({ msg: DATABASE.ERROR_SYNC, err: err });
  });

module.exports = db;

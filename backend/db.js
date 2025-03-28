const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("demo", "root", "root", {
    host: "host.docker.internal",
    // host:"localhost",
    dialect: "mysql"
});

sequelize.authenticate()
    .then(() => console.log("Database connected successfully"))
    .catch(err => console.error("Database connection failed", err));

module.exports = sequelize;

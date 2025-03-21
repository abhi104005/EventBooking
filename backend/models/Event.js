const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User"); // Import User model

const Event = sequelize.define("Event", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY, 
        allowNull: false
    },
    location: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    available_seats: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    admin_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        }
    }
}, {
    timestamps: false
});

User.hasMany(Event, { foreignKey: "admin_id" });
Event.belongsTo(User, { foreignKey: "admin_id" });

module.exports = Event;

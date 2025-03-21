const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");
const Event = require("./Event");

const Booking = sequelize.define("Booking", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        }
    },
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Event,
            key: "id"
        }
    },
    tickets: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    booking_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false
});

User.hasMany(Booking, { foreignKey: "user_id", onDelete: "CASCADE" });
Event.hasMany(Booking, { foreignKey: "event_id", onDelete: "CASCADE" });
Booking.belongsTo(User, { foreignKey: "user_id", as: "user" }); 
Booking.belongsTo(Event, { foreignKey: "event_id", as: "event" });
module.exports = Booking;

const express = require('express')
const mysql = require('mysql2')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt');
const User = require("./models/User");
const sequelize = require("./db");
const cors = require("cors")
const Event = require("./models/Event");
const Booking = require("./models/Booking");
const auth = require("./security/Auth")
const swagger = require("./SwaggerConfig")
require("dotenv").config();
var app = express();
swagger(app);
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
sequelize.sync().then(() => console.log("Database tables created"));

app.listen(8080, () => {
    console.log("Server started")
})

/**
 * @swagger
 * /addevent:
 *   post:
 *     summary: Add a new event
 *     description: Creates a new event with a name, date, location, available seats, and admin ID.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               location:
 *                 type: string
 *               available_seats:
 *                 type: integer
 *               admin_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: New event created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal Server Error
 */
app.post("/addevent", auth, async (req, res) => {
    const { name, date, location, description, available_seats } = req.body;
    if (!name || !date || !location || !available_seats) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const admin_id = req.user.id;
        const newEvent = await Event.create({
            name,
            date,
            location,
            description,
            available_seats,
            admin_id
        });
        res.status(201).json({ message: "Event created successfully!", event: newEvent });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }

})

app.post("/register", async (req, res) => {
    const { name, email, password, role } = req.body;

    const hashedpassword = await bcrypt.hash(password, 12);
    try {
        const newUser = await User.create({
            name,
            email,
            password: hashedpassword,
            role
        });
        let token = jwt.sign(newUser.toJSON(), "Node")
        console.log(token)
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error registering user ", details: error.message });
    }
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "Invalid Username and Password" });
        }

        const check = await bcrypt.compare(password, user.password);
        if (!check) {
            return res.status(401).json({ error: "Invalid Username and Password" });
        }

        const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, "Node", { expiresIn: "10m" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        res.status(200).json({ message: "User logged in successfully", token });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

app.get("/events", async (req, res) => {
    try {
        const events = await Event.findAll();
        res.json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Error fetching events" });
    }
});

app.get("/events/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const events = await Event.findByPk(id);
        res.json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Error fetching events" });
    }
});

app.post("/bookings", auth, async (req, res) => {
    const { user_id, event_id, tickets } = req.body;
    try {
        const event = await Event.findByPk(event_id);
        if (event.available_seats < tickets || event.available_seats < 1) {
            return res.status(400).json({ error: "Not enough available seats" });
        }
        console.log(user_id, event_id, tickets)
        const booking = await Booking.create({
            user_id,
            event_id,
            tickets
        });

        await event.update({ available_seats: event.available_seats - tickets });

        res.status(201).json({ message: "Tickets booked successfully ✅", booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Booking failed", details: error.message });
    }
})

app.get("/booked-tickets/:uid", auth, async (req, res) => {
    try {
        const { uid } = req.params;
        const bookings = await Booking.findAll({
            where: { user_id: uid },
            include: [
                {
                    model: Event,
                    as: "event",
                    attributes: ["id", "name", "date", "location", "description"], 
                }
            ]
        });
        res.send(bookings)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error", details: error.message })
    }
})

app.get("/adminevents/:uid", auth, async (req, res) => {
    const { uid } = req.params;
    console.log(uid)
    try {
        const events = await Event.findAll({
            where: { admin_id: uid }
        })
        res.status(201).json({ message: "Events Fetch Successfully", events })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to Process Request", details: error.message });
    }
})

app.get("/event/:eid", auth, async (req, res) => {
    const { eid } = req.params;
    try {
        const event = await Event.findByPk(eid);
        res.send(event)
    } catch (error) {
        console.error(error.message)
    }
})

app.put("/updateevent/:eid", async (req, res) => {
    const { eid } = req.params;
    const { name, date, location, description, available_seats } = req.body;
    try {
        const oldEvent = await Event.findByPk(eid);
        oldEvent.name = name;
        oldEvent.date = date;
        oldEvent.location = location;
        oldEvent.description = description;
        oldEvent.available_seats = available_seats;

        await oldEvent.save();
        res.status(200).json({ message: "Event Updated", oldEvent })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to Update Data", details: error.message });
    }
})

app.delete("/deleteEvent/:eid", async (req, res) => {
    const { eid } = req.params;
    try {
        const event = await Event.findByPk(eid);
        await event.destroy();
        res.status(200).json({ message: "Event Delted" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to Delete Event", details: error.message });
    }
})

app.put("/updatepro", auth, async(req,res)=>{
    const { name ,email, password } = req.body;
    const id = req.user.id;
    const hashedpassword = await bcrypt.hash(password,12);
    console.log({id, name, email, hashedpassword})
    try {
        const profile = await User.findByPk(id);
        profile.name= name;
        profile.email= email;
        profile.password = hashedpassword;
        await profile.save();
        res.status(201).json({message:"Profile Updated Successfully"})
    } catch (error) {
        res.status(500).json({message:"Internal server Error", error:error.message})
    }
    
})

app.get("/user", auth, async ( req,res) => {
    const uid  = req.user.id;
    try{
        const user = await User.findByPk(uid);
        console.log(user);
        const dto = {
            name:user.name,
            email:user.email
        }
        res.send({dto:dto})
    }catch(error){
        res.status(500).json({error:"Internal Server Error"})
    }
    
});
const request = require("supertest");
const app = require("../server");
const sequelize = require("../dbtest"); 
const Event = require("../models/Event");

jest.mock("../security/Auth", () => (req, res, next) => {
    req.user = { id: 1 };
    next();
});

beforeAll(async () => {
    await sequelize.sync({ force: true }); 
});

afterEach(async () => {
    await sequelize.truncate({ cascade: true }); 
});

afterAll(async () => {
    await sequelize.close(); 
});

describe("Event API Tests", () => {
    it("should fetch all events successfully", async () => {
        const response = await request(app).get("/events");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

describe("POST /addevent", () => {
    it("should create an event successfully", async () => {
        const eventData = {
            name: "Tech Conference",
            date: "2025-06-15",
            location: "New York",
            description: "A conference about AI and ML",
            available_seats: 100
        };
        const response = await request(app)
            .post("/addevent")
            .send(eventData)
            .set("Accept", "application/json");

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message", "Event created successfully!");
        expect(response.body.event).toHaveProperty("name", eventData.name);
    });

    it("should return 400 for missing required fields", async () => {
        const response = await request(app)
            .post("/addevent")
            .send({ name: "Incomplete Event" })
            .set("Accept", "application/json");

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Missing required fields");
    });

    it("should return 500 if an error occurs in event creation", async () => {
        jest.spyOn(Event, "create").mockRejectedValue(new Error("Database error"));

        const eventData = {
            name: "Tech Meetup",
            date: "2025-06-20",
            location: "San Francisco",
            description: "A meetup for developers",
            available_seats: 50
        };

        const response = await request(app)
            .post("/addevent")
            .send(eventData)
            .set("Accept", "application/json");

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty("error", "Internal Server Error");
        expect(response.body.details).toBe("Database error");

        Event.create.mockRestore(); 
    });
});
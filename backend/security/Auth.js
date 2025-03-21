const jwt = require("jsonwebtoken");

const authToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; 

    if (!token) {
        return res.status(401).json({ message: "Access Denied" });
    }

    jwt.verify(token, "Node", (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid Token" });
        }
        req.user = decoded;
        next();
    });
};

module.exports = authToken;

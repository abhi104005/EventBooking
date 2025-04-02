const jwt = require("jsonwebtoken");

const authToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const apikey = req.headers["apikey"];
    const token = authHeader && authHeader.split(" ")[1]; 

    if (!token) {
        return res.status(401).json({ message: "Access Denied" });
    }

    jwt.verify(token, "Node", (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid Token" });
        }else if (apikey !== process.env.API_KEY) {
            return res.status(403).json({ message: "Invalid Apikey" });
        } else {
            
        }
        req.user = decoded;
        next();
    });
};

module.exports = authToken;

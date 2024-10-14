const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {//เช็ค
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).send("Access token expired");
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;

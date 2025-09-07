import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
    try {
        const {token} = req.headers;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded === process.env.ADMIN_EMAIL + process.env.ADMIN_PASS) {
            next();
        } else {
            return res.status(401).json({ message: "Unauthorized" });
        }
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

export default adminAuth;
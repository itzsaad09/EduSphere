import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded) {
            next();
        } else {
            return res.status(401).json({ message: "Unauthorized" });
        }
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

export default userAuth;
import jwt from "jsonwebtoken";

/* ===========================
   DEFAULT ADMIN LOGIN
=========================== */
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Entered Email:", email);
        console.log("Entered Password:", password);
        console.log("ENV Email:", process.env.ADMIN_EMAIL);
        console.log("ENV Password:", process.env.ADMIN_PASSWORD);

        // Compare with default credentials
        if (
            email !== process.env.ADMIN_EMAIL ||
            password !== process.env.ADMIN_PASSWORD
        ) {
            return res.status(401).json({ message: "Invalid Admin Credentials" });
        }

        const token = jwt.sign(
            { type: "admin" },
            process.env.JWT_ADMIN_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Admin Login Successful",
            token
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
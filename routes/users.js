import express from 'express';
import bcrypt from 'bcryptjs';
import userModel from './model/user.js';
import usersRoutes from './routes/users.js';

const app = express();
const routes = express.Router();


app.use(express.json());
app.use('/users', usersRoutes);

// Signup route
routes.post('/signup', async (req, res) => {
    try {
        const { firstname, lastname, username, email, password } = req.body;

        if (!firstname || !lastname || !username || !email || !password) {
            return res.status(400).json({ status: 'fail', message: 'All fields are required' });
        }

        const existingUser = await userModel.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ status: 'fail', message: 'Username already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            firstname,
            lastname,
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({ status: 'success', message: 'User account created successfully', data: { user: newUser } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

app.use('/', routes);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

// Login route
routes.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(401).json({ status: 'fail', message: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ status: 'fail', message: "Invalid password" });
        }

        res.status(200).json({ status: 'success', message: "Login successful", data: { user } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

export default userRoutes;
module.exports = routes;

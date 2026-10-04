const express = require('express')
const cors = require('cors')
require('dotenv').config()

const connectDB = require("./config/db.js")
const authRoutes = require('./routes/authRoutes')
const protect = require('./middleware/authMiddleware')

const app = express()

app.use(cors())
app.use(express.json());

connectDB()

app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
    res.send("Study notes Backend is running");
})
app.get('/api/protected', protect, (req, res) => {
    res.json({message: 'You accessed a protected route',
        user: req.user
    })
})
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server is runnning on port ${PORT}`)
})

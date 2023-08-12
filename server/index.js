const express = require('express');
const app = express()
const logger = require('morgan')
const dotenv = require('dotenv')
const cookieparser = require('cookie-parser')
const multer = require('multer')
dotenv.config();

const { connectdb } = require('./config/db')

//ROUTES

const authRoutes = require('./routes/authRoutes.js')
const postRoutes = require('./routes/postRoutes.js')


app.use(express.json());
app.use(cookieparser())
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));

//FILE UPLOAD

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

const upload = multer({ storage })

app.post('/api/upload', upload.single('file'), function (req, res) {
    const file = req.file
    res.status(200).json(file.filename)
})


//Routes
app.use('/api', authRoutes)
app.use('/api/posts', postRoutes)


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    connectdb();
    console.log("server started");
})
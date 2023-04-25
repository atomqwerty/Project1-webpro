const { response } = require('express');
const express = require('express');
const path = require('path')
const mysql = require('mysql2');
const app = express();
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
app.use(router)
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT
app.use(express.static(path.join(__dirname,'public')))

var connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});
/* Connect to DB */
connection.connect(function (err) {
    if (err) throw err;
    console.log(`Connected DB: ${process.env.MYSQL_DATABASE}`);
});

router.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, '../Project1-webpro/html/test.html'));
})


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Project1-webpro/html/home.html'));
})
router.get('/about_us', (req, res) => {
    res.sendFile(path.join(__dirname, '../Project1-webpro/html/About_Us.html'));
})
router.get('/Login_signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../Project1-webpro/html/Login_signup.html'));
})
router.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, '../Project1-webpro/html/search.html'));
})
router.get('/searchadmin', (req, res) => {
    res.sendFile(path.join(__dirname, '../Project1-webpro/html/search admin.html'));
})

router.get('/Add_product', (req, res) => {
    res.sendFile(path.join(__dirname, '../Project1-webpro/html/Add_product.html'));
})
router.get('/Edit_product', (req, res) => {
    res.sendFile(path.join(__dirname, '../Project1-webpro/html/Edit_product.html'));
})
router.get('/Admin_home', (req, res) => {
    res.sendFile(path.join(__dirname, '../Project1-webpro/html/Admin_home.html'));
})
router.get('/Admin_Product', (req, res) => {
    res.sendFile(path.join(__dirname, '../Project1-webpro/html/Admin_Product.html'));
})
router.get('/Admin_profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../Project1-webpro/html/Admin_profile.html'));
})
router.get('/Adminlogin', (req, res) => {
    res.sendFile(path.join(__dirname, '../Project1-webpro/html/Adminlogin.html'));
})
router.get('/Edit_user', (req, res) => {
    res.sendFile(path.join(__dirname, '../Project1-webpro/html/Edit_user.html'));
})

router.get('/Bass', (req, res) => {
    res.sendFile(path.join(__dirname, '../Project1-webpro/html/Bass.html'));
})
router.get('/Bass1', (req, res) => {
    res.sendFile(path.join(__dirname, '../Project1-webpro/html/Bass1.html'));
})
router.get('/Bass2', (req, res) => {
    res.sendFile(path.join(__dirname, '../Project1-webpro/html/Bass2.html'));
})
router.get('/Bass3', (req, res) => {
    res.sendFile(path.join(__dirname, '../Project1-webpro/html/Bass3.html'));
})
router.get('/Acoustic', (req, res) => {
    res.sendFile(path.join(__dirname, '../Project1-webpro/html/Acoustic.html'));
})
router.get('/Acoustic1', (req, res) => {
    res.sendFile(path.join(__dirname, '../Project1-webpro/html/acous1.html'));
})
router.get('/Acoustic2', (req, res) => {
    res.sendFile(path.join(__dirname, '../Project1-webpro/html/acous2.html'));
})
router.get('/Acoustic3', (req, res) => {
    res.sendFile(path.join(__dirname, '../Project1-webpro/html/acous3.html'));
})
router.get('/Guitar', (req, res) => {
    res.sendFile(path.join(__dirname, '../Project1-webpro/html/Guitar.html'));
})
router.get('/Guitar1', (req, res) => {
    res.sendFile(path.join(__dirname, '../Project1-webpro/html/Guitar1.html'));
})
router.get('/Guitar2', (req, res) => {
    res.sendFile(path.join(__dirname, '../Project1-webpro/html/Guitar2.html'));
})
router.get('/Guitar3', (req, res) => {
    res.sendFile(path.join(__dirname, '../Project1-webpro/html/Guitar3.html'));
})


//log
app.listen(port, () => {
    console.log(`Server listening on port: ${port}`)
})
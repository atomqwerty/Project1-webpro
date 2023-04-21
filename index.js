const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT;
const router = express.Router();
const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Database connected!");
});

// INSERT
router.post('/student', function(req, res) {
    const student = req.body.student;
    if (!student) {
        return res.status(400).send({ error: true, message: 'Please provide student information' });
    }
    connection.query("INSERT INTO personal_info SET ?", student, function(error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results.insertId, message: 'New student has been created successfully.' });
    });
});

// UPDATE
router.put('/student/:id', function(req, res) {
    const student_id = req.params.id;
    const student = req.body.student;
    if (!student_id || !student) {
        return res.status(400).send({ error: true, message: 'Please provide student information' });
    }
    connection.query("UPDATE personal_info SET ? WHERE StudentID = ?", [student, student_id], function(error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results.affectedRows, message: 'Student has been updated successfully.' });
    });
});

// DELETE
router.delete('/student/:id', function(req, res) {
    const student_id = req.params.id;
    if (!student_id) {
        return res.status(400).send({ error: true, message: 'Please provide student id' });
    }
    connection.query('DELETE FROM personal_info WHERE StudentID = ?', student_id, function(error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results.affectedRows, message: 'Student has been deleted successfully.' });
    });
});

// SELECT
router.get('/student/:id', function(req, res) {
    const student_id = req.params.id;
    if (!student_id) {
        return res.status(400).send({ error: true, message: 'Please provide student id' });
    }
    connection.query('SELECT * FROM personal_info WHERE StudentID = ?', student_id, function(error, results) {
        if (error) throw error;
        if (results.length === 0) {
            return res.status(404).send({ error: true, message: 'Student not found' });
        }
        return res.send({ error: false, data: results[0], message: 'Student retrieved' });
    });
});

// SELECT ALL
router.get('/students', function(req, res) {
    connection.query('SELECT * FROM personal_info', function(error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Students retrieved' });
    });
});

app.use('/api', router);

app.listen(port, function() {
    console.log('Server running on port', port);
});
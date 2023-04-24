const dotenv = require("dotenv");
dotenv.config();

const { response } = require('express')
const express = require('express');
const path = require('path')
const mysql = require('mysql2');
const port = process.env.PORT
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const date = require('date-and-time')
const jwt = require('jsonwebtoken');
const sec = 'login'

//SQL conection
var connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});
connection.connect(function (err) {
    if (err) throw err;
    console.log(`Connected DB: ${process.env.MYSQL_DATABASE}`);
});
app.use(express.json());
app.use(cors())

app.post('/register', jsonParser, function (req, res, next) {
    // execute will internally call prepare and query
    const now  =  new Date();
    const value = date.format(now,'YYYY-MM-DD HH:mm:ss');
    connection.execute(
        'INSERT INTO admin_login (username,password,login_log,role) VALUES( ?, ?, ?, "user")'  ,
        [req.body.username,req.body.password,value],
        function (err, results, fields) {
            if(err){
                res.json({status: 'error', message: err})
                return
            }
            res.json({status: 'ok'})    
        }
    );
})

app.post('/login', jsonParser, function (req, res, next) {
    // execute will internally call prepare and query
    const now  =  new Date();
    const value = date.format(now,'YYYY-MM-DD HH:mm:ss');
    connection.execute(
        'SELECT * FROM admin_login WHERE username=?'  ,
        [req.body.username],
        function (err, results, fields) {
            if(err||results.length==0){res.json({status: 'error', message: 'no user'});return}
            if(req.body.password==results[0].password){
                
                const token = jwt.sign({ username: results[0].username }, sec, { expiresIn: '10h' });
                res.json({status: 'login',token})
                connection.query("UPDATE admin_login SET login_log= ? WHERE ID = ?", [value, results[0].id], function(error, results) {
                    if (error) throw error;
                });
            }
            else{res.json({status: 'Login-Failed'})}  
        }
    );
})

app.post('/login-admin', jsonParser, function (req, res, next) {
    // execute will internally call prepare and query
    const now  =  new Date();
    const value = date.format(now,'YYYY-MM-DD HH:mm:ss');
    connection.execute(
        'SELECT * FROM admin_login WHERE username=?'  ,
        [req.body.username],
        function (err, results, fields) {
            if(err||results.length==0){res.json({status: 'error', message: 'no user'});return}
            if(results[0].role!='admin'){res.json({status: 'error', message: 'admin only'});return}
            if(req.body.password==results[0].password){
                
                const token = jwt.sign({ username: results[0].username }, sec, { expiresIn: '10h' });
                res.json({status: 'login',token})
                connection.query("UPDATE admin_login SET login_log= ? WHERE ID = ?", [value, results[0].id], function(error, results) {
                    if (error) throw error;
                });
            }
            else{res.json({status: 'Login-Failed'})}  
        }
    );
})

app.post('/authen', jsonParser, function (req, res, next) {
    const token =req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, sec);
    res.json({status: 'authen',decoded})
});

app.get('/product/:id', function(req, res) {
    const product_id = req.params.id;
    if (!product_id) {
        return res.status(400).send({ error: true, message: 'Please provide product id' });
    }
    connection.query('SELECT * FROM products WHERE id = ?', product_id, function(error, results) {
        if (error) throw error;
        if (results.length === 0) {
            return res.status(404).send({ error: true, message: 'product not found' });
        }
        return res.send({data: results[0]});
    });
});
app.get('/products', function(req, res) {
    connection.query('SELECT * FROM project.products', function(error, results) {
        if (error) throw error;
        if (results.length === 0) {
            return res.status(404).send({ error: true, message: 'products not found' });
        }
        return res.send({data: results});
    });
});
app.get('/admin', function(req, res) {
    connection.query('SELECT * FROM project.admin_login', function(error, results) {
        if (error) throw error;
        if (results.length === 0) {
            return res.status(404).send({ error: true, message: 'user not found' });
        }
        return res.send({data: results});
    });
});
app.delete('/admin/:id', function(req, res) {
    const ID = req.params.id;
    if (!ID) {
        return res.status(400).send({ error: true, message: 'Please provide student id' });
    }
    connection.query('DELETE FROM admin_login WHERE ID = ?', ID, function(error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results.affectedRows, message: 'Student has been deleted successfully.' });
    });
});
app.post('/form', function(req, res){
    if (req.body.search_choice === 'ID') {
        const searchVal = req.body.search_value;
        connection.query(`
        SELECT * FROM products WHERE ID = ?`, [searchVal], (err,rows,field)=>{
        if(rows.length > 0){
            console.log(`Search by ID\n${rows.length} rows returned`);
            return res.send(rows)
        }
    console.log(`Search by ID\n${rows.length} rows returned`);    
    return null
        
    }); 
    }
    else if(req.body.search_choice === 'type'){
        const searchVal = req.body.search_value;
        connection.query(`
        SELECT * FROM products WHERE product_type like ?"%"`, [searchVal], (err,rows,field)=>{
        if(rows.length > 0){
            console.log(`Search by ID\n${rows.length} rows returned`);
            return res.send(rows)
        }
    console.log(`Search by ID\n${rows.length} rows returned`);    
    return null
        
    }); 
    }
    else{
        const searchVal = req.body.search_value;
        connection.query(`SELECT * FROM products WHERE product_name like ?"%"`, [searchVal], (err,rows,field)=>{
        if(rows.length > 0){
            console.log(`Search by Name\n${rows.length} rows returned`);
            return res.send(rows)
        }
    console.log(`Search by Name\n${rows.length} rows returned`);    
    return res.send("NOT FOUND")
        
    }); 
    }
})
app.listen(port, function () {
    console.log('CORS-enabled web server listening on port ' + port)
})
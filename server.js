// Dependencies
const mysql = require("mysql");
const cTable = require('console.table');
// Create instance of express app.

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "123asdjkl",
    database: "emp_db"
});

// Initiate MySQL Connection.
connection.connect(function(err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    // console.log("connected as id " + connection.threadId);
});



// // =============================================================================
// connection.query("SELECT * FROM actors WHERE attitude = ?", [req.params.att], function(err, result) {
//     if (err) throw err;
//     var html = "<h1>Actors With an Attitude of " + req.params.att + "</h1>";
//     html += "<ul>";
//     for (var i = 0; i < result.length; i++) {
//       html += "<li><p> ID: " + result[i].id + "</p>";
//       html += "<p> Name: " + result[i].name + "</p>";
//       html += "<p> Coolness Points: " + result[i].coolness_points + "</p>";
//       html += "<p>Attitude: " + result[i].attitude + "</p></li>";
//     }
//     html += "</ul>";
//     res.send(html);
//   });
// // =============================================================================




// // =============================================================================
// console.table([
//     {
//       name: 'foo',
//       age: 10
//     }, {
//       name: 'bar',
//       age: 20
//     }
//   ]);
  
//   // prints
//   name  age
//   ----  ---
//   foo   10
//   bar   20
// console.table('Several objects', [...]);
 
// Several objects
// ---------------
// name  age
// ----  ---
// foo   10
// bar   20
// baz   30

// var values = [
//     ['max', 20],
//     ['joe', 30]
//   ];
//   console.table(['name', 'age'], values);
   
//   name  age
//   ----  ---
//   max   20 
//   joe   30

//   var values = [
//     ['name', 'age'],
//     ['max', 20],
//     ['joe', 30]
// ]
// console.table(values[0], values.slice(1));
// // =============================================================================
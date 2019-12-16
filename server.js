// Dependencies
const mysql = require("mysql");
const cTable = require('console.table');
const inquirer = require('inquirer');
// mysql connection settings
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "123asdjkl",
    database: "emp_db"
});

// A main menu for selecting application options from, and the start of the UI
let start = () => {
    inquirer.prompt({
        name: "start",
        type: "list",
        message: "What would you like to do?",
        choices: ["View all employees.", 
        "View all departments.", 
        "View all roles.",
        "Add an employee.",
        "Add a department.",
        "Add a role.",
        "Update an employee's role.",
        "EXIT"]
      }).then(answer => {
        //   a routing section for each of the options firing off a function for each
        if (answer.start === "View all employees.") {
            viewEmp();
        }
        else if (answer.start === "View all departments.") {
            viewDep();
        }
        else if (answer.start === "View all roles.") {
            viewRole();
        }
        else if (answer.start === "Add an employee.") {
            addEmp();
        }
        else if (answer.start === "Add a department.") {
            addDep();
        }
        else if (answer.start === "Add a role.") {
            addRole();
        }
        else if (answer.start === "Update an employee's role.") {
            updateRole();
        }
        else {
          // exit
          console.log("Exiting...")
          connection.end();
        };
    });
}
// Modular function for pulling SQL data
// pulls all results based on the specified table input
// let view = (table) => {
//     if (table === "employee") viewEmp();
//     else if (table === "department") viewDep();
//     else if (table === "role") viewRole();
// }
let viewEmp = () => {
    connection.query(`
    select distinct e.id, e.first_name, e.last_name, r.title, e.role_id, r.salary, 
    d.name, d.id as "depID", CONCAT(e2.first_name, " ", e2.last_name) as "manager", 
    e.manager_id from employee e
    inner join employee e2 on e.manager_id = e2.id
    inner join role r on r.id = e.role_id
    inner join department d on r.department_id = d.id`, (err, res) => {
        if (err) throw err;
        let displayArr = [];
        res.forEach((value) => {
            let element = [value.id, value.first_name, value.last_name, 
                value.title, value.role_id, value.salary, value.name, value.depID, 
                value.manager, value.manager_id];
            displayArr.push(element)
        });
        console.table(['ID', 'First Name', 'Last Name', 
        'Title', 'Role ID', 'Salary', 'Department', 'Department ID',
         'Manager', 'Manager ID'], displayArr);
        start();
    });

    
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
}
let viewDep = () => {
    
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        let displayArr = [];
        res.forEach((value) => {
            let element = [value.name];
            displayArr.push(element);
        });
        // display results
        console.table(['Department Name'], displayArr);
        // return to main menu
        start();
    });
}
let viewRole = () => {
    connection.query(`select distinct r.title, r.salary, d.name from role r 
    inner join department d on r.department_id = d.id`, (err, res) => {
        if (err) throw err;
        let displayArr = [];
        res.forEach((value) => {
            let element = [value.title, value.salary, value.name];
            displayArr.push(element);
        });
        // display results
        console.table(['Title', 'Salary', 'Department'], displayArr);
        // return to main menu
        start();
    });
}

let addEmp = () => {
    // query for roles and employees
    // inquirer
    inquirer.prompt([{
        name: "first",
        type: "input",
        message: "New Employee's First Name?"
      },
      {
        name: "last",
        type: "input",
        message: "New Employee's Last Name?"
      },
      {
        name: "role",
        type: "input",
        message: "New Employee's Role ID?",
        validate: answer => {
          const pass = answer.match(
            /^[1-9]\d*$/
          );
          if (pass) {
            return true;
          }
          return "Please enter a positive number greater than zero.";
        }
      },
      {
        name: "manager",
        type: "input",
        message: "New Employee's Manager's ID?",
        validate: answer => {
          const pass = answer.match(
            /^[1-9]\d*$/
          );
          if (pass) {
            return true;
          }
          else if (pass === null || pass === undefined) {
            return true;
          }
          else return "Please enter a positive number or leave blank if they have no manager.";
        }
      }
    ]).then(answer => {
        // console.log(answer.first + answer.last + answer.role + answer.manager);
        if (answer.manager === null || answer.manager === undefined || answer.manager === '') {
            // // insertion
            connection.query(
                `INSERT INTO employee SET ?`,
                {
                    first_name: answer.first,
                    last_name: answer.last,
                    role_id: answer.role,
                },
                (err) => {
                  if (err) throw err;
                  console.log("Employee Added.");
                  start();
                }
            );
        }
        else {
            // // insertion
            connection.query(
                `INSERT INTO employee SET ?`,
                {
                    first_name: answer.first,
                    last_name: answer.last,
                    role_id: answer.role,
                    manager_id: answer.manager
                },
                (err) => {
                  if (err) throw err;
                  console.log("Employee Added.");
                  start();
                }
            );
        }
    });
}
let addDep = () => {
    inquirer.prompt([{
        name: "name",
        type: "input",
        message: "New Department Name?",
        validate: answer => {
          if (answer !== "") {
            return true;
          }
          return "Please enter at least one character.";
        }
      }
    ]).then(answer => {
            // // insertion
            connection.query(
                `INSERT INTO department SET ?`,
                {
                    name: answer.name
                },
                (err) => {
                  if (err) throw err;
                  console.log("Department Added.");
                  start();
                }
            );
    });
}
let addRole = () => {
    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "New Role Title?",
            validate: answer => {
                if (answer !== "") {
                    return true;
                }
                return "Please enter at least one character.";
            }
        },
        {
            name: "salary",
            type: "input",
            message: "New Role Salary?",
            validate: answer => {
                const pass = answer.match(
                    /^[1-9]\d*$/
                );
                if (pass) {
                    return true;
                }
                return "Please enter a positive number.";
            }
        },
        {
            name: "dep",
            type: "input",
            message: "New Role's Department ID?",
            validate: answer => {
                const pass = answer.match(
                    /^[1-9]\d*$/
                );
                if (pass) {
                    return true;
                }
                return "Please enter a positive number.";
            }
        }
    ]).then(answer => {
            // // insertion
            connection.query(
                `INSERT INTO role SET ?`,
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.dep
                },
                (err) => {
                    if (err) throw err;
                    console.log("Role Added.");
                    start();
                }
            );
    });
}
let updateRole = () => {
    
    inquirer.prompt([
        {
            name: "empID",
            type: "input",
            message: "What is the Employee's ID?",
            validate: answer => {
                const pass = answer.match(
                    /^[1-9]\d*$/
                );
                if (pass) {
                    return true;
                }
                return "Please enter a positive number greater than zero.";
            }
      },
      {
          name: "roleID",
          type: "input",
          message: "What is the ID of their new Role?",
          validate: answer => {
              const pass = answer.match(
                  /^[1-9]\d*$/
              );
              if (pass) {
                  return true;
              }
              return "Please enter a positive number greater than zero.";
          }
    }
    ]).then(answer => {
        // // insertion
        connection.query(
            `UPDATE employee SET ? where ?`,
            [
                {
                    role_id: answer.roleID
                },
                {
                    id: answer.empID
                }
            ],
            (err) => {
                if (err) throw err;
                console.log('Employee Updated.');
                start();
            }
        );
    });
}

// Initiate MySQL Connection and start the application
connection.connect(function(err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    // Start the application after successfully connecting to the database
    start();
});





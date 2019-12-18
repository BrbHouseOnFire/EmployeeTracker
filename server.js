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
    inquirer.prompt(
        {
        name: "start",
        type: "list",
        message: "What would you like to do?",
        choices: ["View all employees.", 
        // "View all employees in a Department.",
        // "View employees in a specific role.",
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
        else if (answer.start === "View all employees in a Department.") {
            viewSingleDep();
        }
        else if (answer.start === "View employees in a specific role.") {
            viewSingleRole();
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
let viewEmp = () => {
    connection.query(`
    select distinct e.id, e.first_name, e.last_name, r.title, e.role_id, r.salary, 
    d.name, d.id as "depID", CONCAT(e2.first_name, " ", e2.last_name) as "manager", 
    e.manager_id from employee e
    left join employee e2 on e.manager_id = e2.id
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
// To build & add to start
let viewSingleDep = () => {

}
// To build & add to start
let viewSingleRole = () => {

}

// Update Role & Manager to function off inquirer choice list of existing data options.
let addEmp = () => {

    // collect list of employees for inquirer prompt
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        // array of just employee names
        let empChoiceArr = [];
        // array of employee names & IDs
        let empFullArr = []
        res.forEach((value) => {
            empChoiceArr.push(value.first_name + " " + value.last_name);
            let tempArr = [];
            tempArr.push(value.first_name + " " + value.last_name, value.id);
            empFullArr.push(tempArr);
        });
        // Push an option for not having a manager
        empChoiceArr.push("No Manager");
        empFullArr.push("No Manager", "");

        // grab roles for inquirer choices
        connection.query("SELECT * FROM role", (err, res) => {
            if (err) throw err;
            // array of just role titles
            let roleChoiceArr = [];
            // array of role titles & IDs
            let roleFullArr = []
            res.forEach((value) => {
                roleChoiceArr.push(value.title);
                let tempArr = [];
                tempArr.push(value.title, value.id);
                roleFullArr.push(tempArr);
            });
    

            // inquirer TO UPDATE
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
            name: "empIDChoice",
            type: "list",
            message: "Who is their Manager?",
            choices: empChoiceArr
            },
            {
            name: "roleIDChoice",
            type: "list",
            message: "What role are they to be assigned?",
            choices: roleChoiceArr
            }
            ]).then(answer => {


                // Grab the ID of the corresponding manager
                let empHoldingID;
                empFullArr.forEach((value) => {
                    if (value[0] === answer.empIDChoice) {
                        empHoldingID = value[1];
                    }
                })
                // Grab the ID of the corresponding role
                let roleHoldingID;
                roleFullArr.forEach((value) => {
                    if (value[0] === answer.roleIDChoice) {
                        roleHoldingID = value[1];
                    }
                })



                // console.log(answer.first + answer.last + answer.role + answer.manager);
                if (empHoldingID === null || empHoldingID === undefined || empHoldingID === '') {
                    // // insertion
                    connection.query(
                        `INSERT INTO employee SET ?`,
                        {
                            first_name: answer.first,
                            last_name: answer.last,
                            role_id: roleHoldingID,
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
                            role_id: roleHoldingID,
                            manager_id: empHoldingID
                        },
                        (err) => {
                        if (err) throw err;
                        console.log("Employee Added.");
                        start();
                        }
                    );
                }
            });


        });
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
    
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        // array of just department names
        let choiceArr = [];
        // array of department names & IDs
        let fullArr = []
        res.forEach((value) => {
            choiceArr.push(value.name);
            let tempArr = [];
            tempArr.push(value.name, value.id);
            fullArr.push(tempArr);
        });
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
            name: "depChoice",
            type: "list",
            message: "What department are they in?",
            choices: choiceArr
            }
        ]).then(answer => {
                let depHoldingID;
                // Grab the ID of the corresponding department
                fullArr.forEach((value) => {
                    if (value[0] === answer.depChoice) {
                        depHoldingID = value[1];
                    }
                })
                // // insertion
                connection.query(
                    `INSERT INTO role SET ?`,
                    {
                        title: answer.title,
                        salary: answer.salary,
                        department_id: depHoldingID
                    },
                    (err) => {
                        if (err) throw err;
                        console.log("Role Added.");
                        start();
                    }
                );
        });
    });
}
let updateRole = () => {
    // collect list of employees for inquirer prompt
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        // array of just employee names
        let empChoiceArr = [];
        // array of employee names & IDs
        let empFullArr = []
        res.forEach((value) => {
            empChoiceArr.push(value.first_name + " " + value.last_name);
            let tempArr = [];
            tempArr.push(value.first_name + " " + value.last_name, value.id);
            empFullArr.push(tempArr);
        });
        // collect list of roles for inquirer prompt
        connection.query("SELECT * FROM role", (err, res) => {
            if (err) throw err;
            // array of just role titles
            let roleChoiceArr = [];
            // array of role titles & IDs
            let roleFullArr = []
            res.forEach((value) => {
                roleChoiceArr.push(value.title);
                let tempArr = [];
                tempArr.push(value.title, value.id);
                roleFullArr.push(tempArr);
            });
            
    
            inquirer.prompt([
                {
                name: "empIDChoice",
                type: "list",
                message: "Which employee would you like to update?",
                choices: empChoiceArr
                },
                {
                name: "roleIDChoice",
                type: "list",
                message: "Which role should they be assigned?",
                choices: roleChoiceArr
                }
            ]).then(answer => {
                // collect the relevant IDs for role and employee
                // Grab the ID of the corresponding employee
                let empHoldingID;
                empFullArr.forEach((value) => {
                    if (value[0] === answer.empIDChoice) {
                        empHoldingID = value[1];
                    }
                })
                // Grab the ID of the corresponding role
                let roleHoldingID;
                roleFullArr.forEach((value) => {
                    if (value[0] === answer.roleIDChoice) {
                        roleHoldingID = value[1];
                    }
                })

                // // insertion
                connection.query(
                    `UPDATE employee SET ? where ?`,
                    [
                        {
                            role_id: roleHoldingID
                        },
                        {
                            id: empHoldingID
                        }
                    ],
                    (err) => {
                        if (err) throw err;
                        console.log('Employee Updated.');
                        start();
                    }
                );
                // end final query
            });
            // end prompt
            
        });
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





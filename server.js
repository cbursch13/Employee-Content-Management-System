// Packages needed for this application
const inquirer = require('inquirer');
const mysql = require('mysql2');
const fs = require('fs');
const consoleTable = require('console.table');
const database = require('.');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'employee_info_db'
  },
  console.log(`Connected to the employee_info_db database.`)
);

db.connect(function(result) {
  startEmployeeDashboard();
});

function startEmployeeDashboard(){
  return inquirer.prompt([
  {name: "select",
  message: "What would you like to do within the Employee Dashboard?",
  type: 'list',
  choices: [
    "View all departments", 
    "View all roles", 
    "View all employees",
    "Add a department", 
    "Add a role", 
    "Add an employee", 
    "Update an employee role",
    "Quit"
  ]},
  ])
  .then(function(result) {
    console.log("You entered: " + result.select);

    switch (result.select) {
      case "Add a department":
        addDepartment();
        break;
      case "Add a role":
        addRole();
        break;
      case "Add an employee":
        addEmployee();
        break;
      case "View all departments":
        viewDepartments();
        break;
      case "View all roles":
        viewRoles();
        break;
      case "View all employees":
        viewEmployees();
        break;
      case "Update an employee role":
        updateEmployeeRole();
        break;
        default:
          quit();
    }
  });
}

function addDepartment () {
  inquirer.prompt({
    name: "departmentName",
    message: "What is the name of the department?",
    type: "input"
  })
  .then(function(answer){
    db.query("INSERT INTO department (name) VALUES (?)", [answer.departmentName], function(err, res) {
      if (err) {
        console.error(err);
      } else {
        console.table(res);
        startEmployeeDashboard();
      }
    });
  });
}

function addRole () {
  inquirer.prompt([
    {
      name: "roleName",
      message: "What is the name of the role?",
      type: "input"
    },
    {
      name: "salaryTotal",
      message: "What is the salary for this role?",
      type: "input" 
    },
    {
      name: "deptID",
      message: "What is the department id number?",
      type: "input" 
    }
  ])
  .then(function(answer){
    db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answer.roleName, answer.salaryTotal, answer.deptID], function(err, res) {
      if (err) {
        console.error(err);
      } else {
        console.table(res);
        startEmployeeDashboard();
      }
    });
  });
}

function addEmployee() {
  inquirer.prompt([
  {
    name: "firstName",
    message: "What is the first name of the new employee?",
    type: "input"
  },
  {
    name: "lastName",
    message: "What is the last name of the new employee?",
    type: "input"
  },
  {
    name: "roleID",
    message: "What is the new employee's role id number?",
    type: "input"
  },
  {
    name: "managerID",
    message: "What is the new employee's manager id number?",
    type: "input"
  }
])
  .then(function(answer) {
    db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)", [answer.firstName, answer.lastName, answer.roleID, answer.managerID], function(err, res) {
      if (err) {
        console.error(err);
      } else {
        console.table(res);
        startEmployeeDashboard();
      }
    });
  });
}

//update functionality so update employee actually updates the role_id in the db
function updateEmployeeRole() {
  inquirer.prompt([
    {
      name: "employeeUpdate",
      message: "Which employee would you like to update?",
      type: "input"
    },
    {
      name: "roleUpdate",
      message: "What is the employee's new role id?",
      type: "input"
    }
  ])
  .then(function(answer) {
    db.query("UPDATE employee SET role_id=? WHERE first_name=?", [answer.employeeUpdate, answer.roleUpdate, ], function(err, res){
      if (err) {
        console.error(err);
      } else {
        console.table(res);
        startEmployeeDashboard();
      }
    });
  });
}

function viewDepartments() {
  let query = "SELECT * FROM department";
  db.query(query, function(err, res) {
    if (err) {
      console.error(err);
    } else {
      console.table(res);
      startEmployeeDashboard();
    }
  });
}

function viewRoles() {
  let query = "SELECT * FROM role";
  db.query(query, function(err, res) {
    if (err) {
      console.error(err);
    } else {
      console.table(res);
      startEmployeeDashboard();
    }
  });
}

//update this function to include job title, departments, salaries and managers that employees report to.
function viewEmployees() {
  let query = "SELECT * FROM employee";
  db.query(query, function(err, res) {
    if (err) {
      console.error(err);
    } else {
      console.table(res);
      startEmployeeDashboard();
    }
  });
}

function quit() {
  db.end();
  process.exit();
}



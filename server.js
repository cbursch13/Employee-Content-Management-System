// Packages needed for this application
const inquirer = require('inquirer');
const mysql = require('mysql');
const fs = require('fs');
const consoleTable = require('console.table');
const database = require('./db');


const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'employee_info_db'
  },
  console.log(`Connected to the employee_info_db database.`)
);

db.connect(function(err) {
  if (err) throw err;
  console.log("Connected as ID" + db.threadId);
  
  startEmployeeDashboard();
});


function startEmployeeDashboard(){
  return inquirer.prompt([
  {name: "Commands",
  message: "What would you like to do within the Employee Dashboard?",
  type: 'list',
  choices: [
    "Add department", 
    "Add role", 
    "Add employee", 
    "View departments", 
    "View roles", 
    "View employees",
    "Update employee role",
    "Quit"
  ]},
  ])
  .then(function(result) {
    console.log("You entered: " + result.option);

    switch (result.option) {
      case "Add department":
        addDepartment();
        break;
      case "Add role":
        addRole();
        break;
      case "Add employee":
        addEmployee();
        break;
      case "View departments":
        viewDepartments();
        break;
      case "View roles":
        viewRoles();
        break;
      case "View employees":
        viewEmployees();
        break;
      case "Update employee role":
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
      if (err) throw err;
      console.table(res)
      startEmployeeDashboard()
    })
  })
}

function addEmployee () {
  inquirer.prompt({
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

  )
  .then(function(answer){
    db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answer.roleName, answer.salaryTotal, answer.deptID], function(err, res) {
      if (err) throw err;
      console.table(res)
      startEmployeeDashboard()
    })
  })
}


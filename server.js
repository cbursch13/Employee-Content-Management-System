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

function addRole() {
  
  db.query("SELECT id, name FROM department", function (err, departments) {
    if (err) {
      console.error("Error fetching departments:", err);
      return;
    }

   
    const departmentChoices = departments.map(department => department.name);

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
        name: "dept",
        message: "Which department does this role belong to?",
        type: "list",
        choices: departmentChoices
      }
    ])
    .then(function (answer) {
      
      const chosenDepartment = departments.find(department => department.name === answer.dept);
      
      if (!chosenDepartment) {
        console.error("Error: Chosen department not found.");
        return;
      }

      const departmentId = chosenDepartment.id;

      db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answer.roleName, answer.salaryTotal, departmentId], function (err, res) {
        if (err) {
          console.error(err);
        } else {
          console.table(res);
          startEmployeeDashboard();
        }
      });
    });
  });
}

function addEmployee() {

  db.query("SELECT id, title FROM role", function (err, roles) {
    if (err) {
      console.error("Error fetching roles:", err);
      return;
    }

    
    db.query("SELECT id, CONCAT(first_name, ' ', last_name) AS manager FROM employee", function (err, managers) {
      if (err) {
        console.error("Error fetching managers:", err);
        return;
      }

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
          message: "Select the role for the new employee:",
          type: "list",
          choices: roles.map(role => ({ name: role.title, value: role.id }))
        },
        {
          name: "managerID",
          message: "Select the manager for the new employee:",
          type: "list",
          choices: managers.map(manager => ({ name: manager.manager, value: manager.id }))
        }
      ])
      .then(function(answer) {
        db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [answer.firstName, answer.lastName, answer.roleID, answer.managerID], function(err, res) {
          if (err) {
            console.error(err);
          } else {
            console.table(res);
            startEmployeeDashboard();
          }
        });
      });
    });
  });
}

function updateEmployeeRole() {
  
  db.query("SELECT id, CONCAT(first_name, ' ', last_name) AS employeeName FROM employee", function (err, employees) {
    if (err) {
      console.error("Error fetching employees:", err);
      return;
    }

    db.query("SELECT id, title FROM role", function (err, roles) {
      if (err) {
        console.error("Error fetching roles:", err);
        return;
      }

      inquirer.prompt([
        {
          name: "employeeUpdate",
          message: "Select the employee to update:",
          type: "list",
          choices: employees.map(employee => ({ name: employee.employeeName, value: employee.id }))
        },
        {
          name: "roleUpdate",
          message: "Select the new role for the employee:",
          type: "list",
          choices: roles.map(role => ({ name: role.title, value: role.id }))
        }
      ])
      .then(function(answer) {
        db.query("UPDATE employee SET role_id=? WHERE id=?", [answer.roleUpdate, answer.employeeUpdate], function(err, res){
          if (err) {
            console.error(err);
          } else {
            console.table(res);
            startEmployeeDashboard();
          }
        });
      });
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
  let query = "SELECT role.id AS 'Role ID', role.title AS 'Job Title', department.name AS 'Department Name', role.salary AS 'Salary' FROM role JOIN department ON role.department_id = department.id";
  db.query(query, function(err, res) {
    if (err) {
      console.error(err);
    } else {
      console.table(res);
      startEmployeeDashboard();
    }
  });
}

function viewEmployees() {
  let query =  `SELECT 
  e.id AS employee_id, 
  e.first_name, 
  e.last_name, 
  r.title AS job_title,
  d.name AS department,
  r.salary,
  CONCAT(m.first_name, ' ', m.last_name) AS manager
FROM 
  employee e
  INNER JOIN role r ON e.role_id = r.id
  INNER JOIN department d ON r.department_id = d.id
  LEFT JOIN employee m ON e.manager_id = m.id`;
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



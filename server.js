// Packages needed for this application
const inquirer = require('inquirer');
const mysql = require('mysql');
const fs = require('fs');
const consoleTable = require('console.table');

// TODO: Create an array of questions for user input
function userInput(){
  return inquirer.prompt([
  {name: 'license',
  message: 'Select kind of license for this application:',
  type: 'list',
  choices: ["Academic Free License v3.0", "Apache license 2.0", "Artistic license 2.0", "Boost Software License 1.0", "BSD 2-clause license", "BSD 3-clause license", "Creative Commons Zero v1.0 Universal", "Creative Commons Attribution 4.0", "Creative Commons Attribution Share Alike 4.0", "Do What The Fuck You Want To Public License", "Educational Community License v2.0", "Eclipse Public License 1.0", "Eclipse Public License 2.0", "European Union Public License 1.1", "GNU Affero General Public License v3.0", "GNU General Public License v2.0", "GNU General Public License v3.0",  "GNU Lesser General Public License v2.1", "GNU Lesser General Public License v3.0", "ISC", "LaTeX Project Public License v1.3c", "Microsoft Public License",  "MIT", "Mozilla Public License 2.0", "Open Software License 3.0", "SIL Open Font License 1.1", "University of Illinois/NCSA Open Source License", "The Unlicense", "zLib License"]},
  {name: 'title',
  message: 'What is the title of this application?',
  type: 'input'},
 
])};


// TODO: Create a function to initialize app
async function init() {
  let answers = await userInput();
  }


// Function call to initialize app
init();

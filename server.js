const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const { connect } = require('http2');

require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'employee_db'
});

const promptUser = () => {
    inquirer.prompt ([
        {
            type: 'list',
            name: 'choices',
            message: 'Please choose next action!',
            choices: [
                'View all department',
                'View all roles',
                'View all employees',
                'View department budget',
                'View employees by department',
                'Add a department',
                'Add a role',
                'Add a employee',
                'Update employee role',
                'Update employee manager',
                'Delete a department',
                'Delete a role',
                'Delete a employee',
                'Quit'
            ]
        }
    ])
    .then((answer) => {
        const {choices} = answer;
    })
}
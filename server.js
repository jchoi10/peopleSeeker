const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const { connect } = require('http2');
const { allowedNodeEnvironmentFlags } = require('process');

require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'employee_db'
});

connection.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
    console.log('EMPLOYEE MANAGER');
    promptUser();
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
        if (choices === 'View all department') {
            showDepartment();
        }
        if (choices === 'View all roles') {
            showRoles();
        }
        if (choices === 'View all employees') {
            showEmployees();
        }
        if (choices === 'View department budget') {
            showBudget();
        }
        if (choices === 'View employees by department') {
            showEmployeeDepartment();
        }
        if (choices === 'Add a department') {
            addDepartment();
        }
        if (choices === 'Add a role') {
            addRole();
        }
        if (choices === 'Add a employee') {
            addEmployee();
        }
        if (choices === 'Update employee role') {
            updateEmployee();
        }
        if (choices === 'Update employee manager') {
            updateManager();
        }
        if (choices === 'Delete a department') {
            deleteDepartment();
        }
        if (choices === 'Delete a role') {
            deleteRole();
        }
        if (choices === 'Delete a employee') {
            deleteEmployee();
        }
        if (choices === 'Quit') {
            connection.end();
        }
    });
};

showDepartment = () => {
    console.log('Getting ready to show all departments...' + '/n');
    const sql = `SELECT department.id AS id, department.name AS department FROM department`;

    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

showRoles = () => {
    console.log('Getting ready to show all roles...' + '/n');
    const sql = `SELECT role.id, role.title, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id`;

    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

showEmployees = () => {
    console.log('Getting ready to show all employees...' + '/n');

}
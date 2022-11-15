const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

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
    console.log('Getting ready to show all departments...\n');
    const sql = `SELECT department.id AS id, department.name AS department FROM department`;

    connection.query(sql, (err, response) => {
        if (err) throw err;
        console.table(response);
        promptUser();
    });
};

showRoles = () => {
    console.log('Getting ready to show all roles...' + '\n');
    const sql = `SELECT role.id, role.title, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

showEmployees = () => {
    console.log('Getting ready to show all employees...' + '/n');
    const sql = `SELECT 
                employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary,
                CONCAT (manager.first_name, " ", manager.last_name) AS manager
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                LEFT JOIN employee manager ON employee.manager_id = manager.id`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

showBudget = () => {
    console.log('Getting ready to show budget...' +'\n');
    const sql = `SELECT department_id AS id,
                    department.name AS department,
                    SUM(salary) AS budget
                FROM role
                JOIN department ON role.department_id = department.id GROUP BY department_id`;

    connection.query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);
        promptUser();
    });
};

showEmployeeDepartment = () => {
    console.log('Getting ready to show employee by department...' + '\n');
    const sql = `SELECT employee.first_name, employee.last_name, department.name AS department
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id`;
    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDepartment',
            message: 'What department do you want to add?',
            validate: addDepartment => {
                if (addDepartment) {
                    return true;
                } else {
                    console.log('Please enter proper department!');
                    return false;
                }
            }
        }
    ])
    .then(answer => {
        const sql = `INSERT INTO department (name) VALUES (?)`;
        connection.query(sql, answer.addDepartment, (err, result) => {
            if (err) throw err;
            console.log(answer.addDepartment + 'was added to department list!');
            showDepartment();
        });
    });
};

addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addRole',
            message: 'What role do you want to add?',
            validate: addRole => {
                if (addRole) {
                    return true;
                } else {
                    console.log('Please enter proper role!');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'addSalary',
            message: 'How much is the salary for this role?',
            validate: addSalary => {
                if (isNaN(addSalary)) {
                    return true;
                } else {
                    console.log('Please enter a valid salary!');
                    return false;
                }
            }
        }
    ])
    .then(answer => {
        const params = [answer.role, answer.salary];
        const roleTable = `SELECT name, id FROM department`;

        connection.query(roleTable, (err, data) => {
            if (err) throw err;

            const depart = data.map(({name, id}) => ({name: name, value: id}));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'depart',
                    message: 'What department is this role in?',
                    choice: depart
                }
            ])
            .then(departClick => {
                const depart = departClick.depart;
                params.push(depart);

                const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;

                connection.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log(answer.role + 'was added to role list!');

                    showRoles();
                });
            });
        });
    });
};

addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the employees first name?',
            validate: addFirstName => {
                if (addFirstName) {
                    return true;
                } else {
                    console.log('Please enter a first name!');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the employees last name?',
            validate: addLastName => {
                if (addLastName) {
                    return true;
                } else {
                    console.log('Please enter a last name!');
                    return false;
                }
            }
        }
    ])
    .then(answer => {
        const params = [answer.addFirstName, answer.addLastName]
        const roleTable = `SELECT role.id, role.title FROM role`;

        connection.query(roleTable, (err, data) => {
            if (err) throw err;

            const roleTable = data.map(({id, title}) => ({name: title, value: id}));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is the employees role?',
                    choices: roles
                }
            ])
            .then(rolePick => {
                const role = rolePick.role;
                params.push(role);

                const managerTable = `SELECT * FROM employee`;

                connection.query(managerTable, (err, data) => {
                    if (err) throw err;

                    const managers = data.map(({id, first_name, last_name}) => ({name: first_name + ' ' + last_name, value: id}));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: 'who is the employees manager?',
                            choice: managers
                        }
                    ])
                    .then(managerPick => {
                        const manager = managerPick.manager;
                        params.push(manager);

                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

                        connection.query(sql, params, (err, result) => {
                            if (err) throw err;
                            console.log('Employee has been added to the list!')
                            
                            showEmployees();
                        });
                    });
                });
            });
        });
    });
};

updateEmployee = () => {
    const employeeTable = `SELECT * FROM employee`;

    connection.query(employeeTable, (err, data) => {
        if (err) throw err;

        const employees = data.map(({id, first_name, last_name}) => ({name: first_name + ' ' + last_name, value: id}));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: 'which employee would you liek to modify?',
                choices: employees
            }
        ])
        .then(employeePick => {
            const employee = employeePick.name;
            const params = [];
            params.push(employee);

            const roleTable = `SELECT * FROM role`;

            connection.query(roleTable, (err, data) => {
                if (err) throw err;

                const roles = data.map(({id, title}) => ({name: title, value: id}));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the employees new role?',
                        choices: roles
                    }
                ])
                .then(rolePick => {
                    const role = rolePick.role;
                    params.push(role);

                    let employee = params[0];
                    params[0] = role
                    params[1] = employee

                    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                    connection.query(sql, params, (err, result) => {
                        if (err) throw err;
                        showEmployees();
                    });
                });
            });
        });
    });
};

updateManager = () => {
    const employeeTable = `SELECT * FROM employee`;

    connection.query(employeeTable, (err, data) => {
        if (err) throw err;

        const employees = data.map(({id, first_name, last_name}) => ({name: first_name + ' ' + last_name, value: id}));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: 'Which employee would you like to update?',
                choices: employees
            }
        ])
        .then(employeePick => {
            const employee = employeePick.name;
            const params = [];
            params.push(employee);

            const managerTable = `SELECT * FROM employee`;

            connection.query(managerTable, (err, data) => {
                if (err) throw err;

                const managers = data.map(({id, first_name, last_name}) => ({name: first_name + ' ' + last_name, value: id}));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Who is the employees manager?',
                        choices: managers
                    }
                ])
                .then(managerPick => {
                    const manager = managerPick.manager;
                    params.push(manager);

                    let employee = params[0]
                    params[0] = manager
                    params[1] = employee

                    const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;

                    connection.query(sql, params, (err, result) => {
                        if (err) throw err;
                        console.log('employee has been updated!');

                        showEmployees();
                    });
                });
            });
        });
    });
};
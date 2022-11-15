INSERT INTO department (name)
VALUES 
('IT / Sortware Development'),
('Marketing'),
('Accounting'),
('Operations'),
('Sales');

INSERT INTO role (title, salary, department_id)
VALUES
('Full Stack Developer', 100000, 1),
('Software Engineer', 100000, 1),
('Marketing', 100000, 2),
('Accountant', 9000, 3), 
('Project Manager', 90000, 4),
('Sales', 85000, 5),
('Operations Manager', 85000, 5);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('John', 'Smith', 1, null),
('Neo', 'Anderson', 2, 1),
('Mary', 'Poppins', 3, null),
('Ashley', 'Sanders', 4, 2),
('Lyn', 'Lipka', 5, null),
('Ana', 'Lee', 6, 5),
('Smith', 'Morgan', 7, null),
('Rachel', 'Green', 8, 3);
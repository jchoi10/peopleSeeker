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
('Software Engineer', 100000, 4),
('Accountant', 9000, 2), 
('Project Manager', 90000, 3),
('Sales', 85000, 3),
('Operations Manager', 85000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('John', 'Smith', 4, null),
('Neo', 'Anderson', 1, 3),
('Mary', 'Poppins', 2, null),
('Ashley', 'Sanders', 6, 1),
('Lyn', 'Lipka', 3, null),
('Ana', 'Lee', 7, 5),
('Smith', 'Morgan', 5, null),
('Rachel', 'Green', 8, 7);
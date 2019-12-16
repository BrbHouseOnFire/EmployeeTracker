USE emp_db;

INSERT INTO employee (first_name, last_name, role_id) values 
("Abb", "Woj", "1"),
("Bob", "Bones", "2"),
("Cardy", "Cee", "3"),
("Dirk", "Dag", "4"),
("Eve", "Ear", "5"),
("Frank", "Fortune", "6"),
("George", "Garth", "7"),
("Hip", "Hooray", "8"),
("Ilhar", "Ivar", "9"),
("Joanne", "Jos", "10"),
("Kirk", "Kaptain", "11"),
("Loser", "Lost", "12");

INSERT INTO department (name) values 
("Miners"),
("Footmen"),
("Specialists");

INSERT INTO role (title, salary, department_id) values 
('Wisp', '55000', 1),
('Laborer', '45000', 1),
('Peon', '35000', 1),
('Manager', '900000', 1),

('Grunt', '65000', 2),
('Footman', '64000', 2),
('Ghoul', '63000', 2),
('Manager', '901000', 2),

('Wyvern', '130000', 3),
('Warg Rider', '120000', 3),
('Technician', '110000', 3),
('Manager', '902000', 3);
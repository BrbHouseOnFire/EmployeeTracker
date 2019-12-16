USE emp_db;

INSERT INTO employee (first_name, last_name, role_id, manager_id) values 
("Abb", "Woj", "1", "4"),
("Bob", "Bones", "2", "4"),
("Cardy", "Cee", "3", "4"),
("Dirk", "Dag", "4", NULL),
("Eve", "Ear", "5", "8"),
("Frank", "Fortune", "6", "8"),
("George", "Garth", "7", "8"),
("Hip", "Hooray", "8", NULL),
("Ilhar", "Ivar", "9", "12"),
("Joanne", "Jos", "10", "12"),
("Kirk", "Kaptain", "11", "12"),
("Loser", "Lost", "12", NULL);

INSERT INTO department (name) values 
("Miners"),
("Footmen"),
("Specialists");

INSERT INTO role (title, salary, department_id) values 
('Wisp', '55000', 1),
('Laborer', '45000', 1),
('Peon', '35000', 1),
('Boss Man', '900000', 1),

('Grunt', '65000', 2),
('Footman', '64000', 2),
('Ghoul', '63000', 2),
('Foot Master', '901000', 2),

('Wyvern', '130000', 3),
('Warg Rider', '120000', 3),
('Technician', '110000', 3),
('Specialist-est', '902000', 3);
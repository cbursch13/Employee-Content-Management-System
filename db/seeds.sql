INSERT INTO department (name)
VALUES ("Apparel & Accessories"), ("Electronics"), ("Essentials & Beauty"), ("Food & Beverage"), ("Home");

INSERT INTO role (title, salary, department_id)
VALUE ("Inventory Analyst", 60000.00, 2), ("Buyer", 110000.00, 3), ("Director", 160000.00, 4), ("Strategy Lead", 90000.00, 1), ("Merchandising Specialist", 40000.00, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Rachel", "Johnson", 1, 2), ("Tony", "Ballatelo", 2, 3), ("Harley", "Swanson", 3, null), ("Joe", "Dirt", 4, 3), ("June", "Roberts", 5, 4)
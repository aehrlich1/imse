"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dog = exports.intern = exports.software_engineer = exports.manager = exports.car_model = exports.car = exports.employee_assigned_department = exports.collaborate = exports.department = exports.work = exports.employee = exports.building = exports.book = exports.company = void 0;
exports.company = {
    name: "company",
    config: `(tax_id INT(5) AUTO_INCREMENT,
           company_name VARCHAR(50),
           motto VARCHAR(50),
           CONSTRAINT pk_company PRIMARY KEY (tax_id))`
};
exports.book = {
    name: "book",
    config: `(isbn CHAR(13),
           author VARCHAR(50) NOT NULL,
           title VARCHAR(50) NOT NULL,
           tax_id VARCHAR(15) NOT NULL,
           CONSTRAINT pk_book PRIMARY KEY (isbn),
           CONSTRAINT book_fk_company FOREIGN KEY (tax_id) REFERENCES company(tax_id))`
};
exports.building = {
    name: "building",
    config: `(location VARCHAR(100),
            floor_space INT(5),
            building_name VARCHAR(15),
            CONSTRAINT pk_building PRIMARY KEY (location))`
};
exports.employee = {
    name: "employee",
    config: `(employee_id INT(10) AUTO_INCREMENT,
           employee_name VARCHAR(30),
           salary NUMERIC(9,2) NOT NULL,
           tax_id INT(5),
           CONSTRAINT pk_employee PRIMARY KEY (employee_id),
           CONSTRAINT employee_fk_company FOREIGN KEY (tax_id) REFERENCES company(tax_id))`
};
exports.work = {
    name: "work",
    config: `(tax_id VARCHAR(15),
           location VARCHAR(100),
           employee_id INT(10),
           CONSTRAINT unique_tax_id_employee_id UNIQUE (tax_id, employee_id),
           CONSTRAINT pk_work PRIMARY KEY (location, employee_id),
           CONSTRAINT work_fk_company FOREIGN KEY (tax_id) REFERENCES company(tax_id),
           CONSTRAINT work_fk_building FOREIGN KEY (location) REFERENCES building(location),
           CONSTRAINT work_fk_employee FOREIGN KEY (employee_id) REFERENCES employee(employee_id))`
};
exports.department = {
    name: "department",
    config: `(department_id INT AUTO_INCREMENT,
           department_name VARCHAR(30) NOT NULL,
           purpose VARCHAR(50),
           CONSTRAINT pk_department PRIMARY KEY (department_id))`
};
exports.collaborate = {
    name: "collaborate",
    config: `(department_id_a INT(5),
           department_id_b INT(5),
           CONSTRAINT pk_collaborate PRIMARY KEY (department_id_a, department_id_b),
           CONSTRAINT collaborate_fk_department_a FOREIGN KEY (department_id_a) REFERENCES department(department_id) ON DELETE CASCADE,
           CONSTRAINT collaborate_fk_department_b FOREIGN KEY (department_id_b) REFERENCES department(department_id))`
};
exports.employee_assigned_department = {
    name: "employee_assigned_department",
    config: `(employee_id INT(10),
           department_id INT(5),
           CONSTRAINT pk_employee_assigned_department PRIMARY KEY (employee_id, department_id),
           CONSTRAINT employee_assigned_department_fk_employee FOREIGN KEY (employee_id) REFERENCES employee(employee_id) ON DELETE CASCADE,
           CONSTRAINT employee_assigned_department_fk_department FOREIGN KEY (department_id) REFERENCES department(department_id) ON DELETE CASCADE)`
};
exports.car = {
    name: "car",
    config: `(license CHAR(7),
           model VARCHAR(30) UNIQUE,
           CONSTRAINT pk_car PRIMARY KEY (license))`
};
exports.car_model = {
    name: "car_model",
    config: `(model VARCHAR(30),
           price NUMERIC(10,1),
           CONSTRAINT pk_car_model PRIMARY KEY (model),
           CONSTRAINT car_model_fk_car FOREIGN KEY (model) REFERENCES car(model))`
};
exports.manager = {
    name: "manager",
    config: `(employee_id INT(10),
           quarterly_target INT(8),
           bonus INT(5) DEFAULT 9500,
           CONSTRAINT pk_maanger PRIMARY KEY (employee_id),
           CONSTRAINT manager_fk_employee FOREIGN KEY (employee_id) REFERENCES employee(employee_id))`
};
exports.software_engineer = {
    name: "software_engineer",
    config: `(employee_id INT(10),
           prog_language VARCHAR(80),
           assigned_workspace_id VARCHAR(5),
           date DATE,
           was_promoted BOOLEAN,
           CONSTRAINT pk_software_engineer PRIMARY KEY (employee_id),
           CONSTRAINT software_engineer_fk_employee FOREIGN KEY (employee_id) REFERENCES employee(employee_id))`
};
exports.intern = {
    name: "intern",
    config: `(employee_id INT(10),
           age INT(3),
           contract_length INT,
           date DATE,
           CONSTRAINT pk_intern PRIMARY KEY (employee_id),
           CONSTRAINT intern_fk_employee FOREIGN KEY (employee_id) REFERENCES employee(employee_id))`
};
exports.dog = {
    name: "dog",
    config: `(employee_id INT(10),
           name VARCHAR(80) NOT NULL,
           breed VARCHAR(80),
           age INT(2),
           CONSTRAINT pk_dog PRIMARY KEY (employee_id, name),
           CONSTRAINT dog_fk_intern FOREIGN KEY (employee_id) REFERENCES intern(employee_id) ON DELETE CASCADE)`
};

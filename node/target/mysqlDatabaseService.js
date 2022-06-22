"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMySqlReport = exports.getSoftwareEngineerOnEmployee = exports.getInternOnEmployee = exports.getDataInterns = exports.getCompanies = exports.promoteIntern = exports.createMySqlDatabase = exports.createTestTable = void 0;
const mysql = require("mysql2");
const mysqlDatabaseTables_1 = require("./mysqlDatabaseTables");
const csvParser = require("csv-parser");
const fs = require("fs");
const mysqlDbConnection = mysql.createConnection({
    multipleStatements: true,
    host: "mysql",
    user: "root",
    password: "secret",
    database: "imse-database",
});
function createTestTable() {
    mysqlDbConnection.query("CREATE TABLE IF NOT EXISTS test (id INT)", (err) => {
        err ? console.log(err) : console.log("Table test successfully created.");
    });
}
exports.createTestTable = createTestTable;
function createMySqlDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        yield dropTable(mysqlDatabaseTables_1.intern.name);
        yield dropTable(mysqlDatabaseTables_1.manager.name);
        yield dropTable(mysqlDatabaseTables_1.software_engineer.name);
        yield dropTable(mysqlDatabaseTables_1.employee.name);
        yield dropTable(mysqlDatabaseTables_1.company.name);
        yield createTable(mysqlDatabaseTables_1.company);
        yield createTable(mysqlDatabaseTables_1.employee);
        yield createTable(mysqlDatabaseTables_1.manager);
        yield createTable(mysqlDatabaseTables_1.software_engineer);
        yield createTable(mysqlDatabaseTables_1.intern);
        yield insertCompanyData();
        yield insertEmployeeData();
        yield insertSoftwareEngineerData();
        yield insertManagerData();
        yield insertInternData();
    });
}
exports.createMySqlDatabase = createMySqlDatabase;
function dropTable(tableName) {
    return new Promise((resolve) => {
        mysqlDbConnection.query("DROP TABLE IF EXISTS ??", [tableName], (err) => {
            err
                ? console.log(err)
                : (console.log('Table "' + tableName + '" successfully dropped.'),
                    resolve());
        });
    });
}
function createTable(tableConfig) {
    return new Promise((resolve) => {
        mysqlDbConnection.query("CREATE TABLE IF NOT EXISTS " + tableConfig.name + " " + tableConfig.config, (err) => {
            err
                ? console.log(err)
                : (console.log('Table "' + tableConfig.name + '" successfully created.'), resolve());
        });
    });
}
function insertValue(insertConfig) {
    return new Promise((resolve) => {
        mysqlDbConnection.query("INSERT INTO " +
            insertConfig.name +
            " (" +
            insertConfig.properties +
            ") VALUES (" +
            insertConfig.data +
            ")", (err) => {
            err
                ? console.log(err)
                : resolve();
        });
    });
}
function insertCompanyData() {
    return __awaiter(this, void 0, void 0, function* () {
        const promises = [];
        const company = {
            name: "company",
            properties: "",
            data: ""
        };
        for (let i = 0; i < 5; i++) {
            promises.push(new Promise((resolve, reject) => {
                insertValue(company).then(() => resolve());
            }));
        }
        return Promise.all(promises);
    });
}
function insertEmployeeData() {
    return __awaiter(this, void 0, void 0, function* () {
        const names = [];
        const surnames = [];
        let tax_ids;
        function readNames() {
            return new Promise((resolve) => {
                fs.createReadStream("/app/data/names.csv")
                    .pipe(csvParser({ headers: false }))
                    .on("data", (data) => names.push(data[0]))
                    .on("end", () => resolve());
            });
        }
        function readSurnames() {
            return new Promise((resolve) => {
                fs.createReadStream("/app/data/surnames.csv")
                    .pipe(csvParser({ headers: false }))
                    .on("data", (data) => surnames.push(data[0]))
                    .on("end", () => resolve());
            });
        }
        function readCompanies() {
            return new Promise((resolve) => {
                getCompanies().then((data) => {
                    tax_ids = data;
                    resolve();
                });
            });
        }
        yield Promise.all([readNames(), readSurnames(), readCompanies()]);
        for (let i = 0; i < 1000; i++) {
            const name = names[Math.floor(Math.random() * names.length)] +
                " " +
                surnames[Math.floor(Math.random() * surnames.length)];
            yield insertIntoEmployee(mysqlDbConnection, name, getRandomSalary(), getRandomTaxId());
        }
        function getRandomTaxId() {
            return tax_ids[Math.floor(Math.random() * tax_ids.length)]["tax_id"];
        }
        function insertIntoEmployee(db, name, salary, tax_id) {
            const employee = {
                name: "employee",
                properties: "employee_name, salary, tax_id",
                data: `"${name}", ${salary}, ${tax_id}`,
            };
            return new Promise((resolve) => {
                insertValue(employee).then(() => resolve());
            });
        }
    });
}
function insertSoftwareEngineerData() {
    return __awaiter(this, void 0, void 0, function* () {
        mysqlDbConnection.query("SELECT employee_id FROM employee WHERE employee_id BETWEEN 50 AND 600", (err, results) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Query successfully executed.");
                var i = 50;
                for (const element of results) {
                    insertIntoSoftwareEngineer(element.employee_id, getRandomDate(), getRandomBoolean());
                    i++;
                    if (i == 601) {
                        break;
                    }
                }
            }
        });
        function insertIntoSoftwareEngineer(employee_id, date, was_promoted) {
            const softwareEngineer = {
                name: "software_engineer",
                properties: "employee_id, date, was_promoted",
                data: `${employee_id}, "${date}", ${was_promoted}`
            };
            return new Promise((resolve) => {
                insertValue(softwareEngineer).then(() => resolve());
            });
        }
    });
}
function insertManagerData() {
    return __awaiter(this, void 0, void 0, function* () {
        mysqlDbConnection.query("SELECT employee_id FROM employee WHERE employee_id < 50", (err, results) => {
            if (err) {
                console.error(err);
            }
            else {
                console.log("Query successfully executed.");
                var i = 0;
                for (const element of results) {
                    insertIntoManager(element.employee_id);
                    i++;
                    if (i == 50) {
                        break;
                    }
                }
            }
        });
        function insertIntoManager(employee_id) {
            const manager = {
                name: "manager",
                properties: "employee_id",
                data: `${employee_id}`
            };
            return new Promise((resolve) => {
                insertValue(manager).then(() => resolve());
            });
        }
    });
}
function insertInternData() {
    return __awaiter(this, void 0, void 0, function* () {
        mysqlDbConnection.query("SELECT employee_id FROM employee WHERE employee_id > 600", (err, results) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Query successfully executed.");
                var i = 601;
                for (const element of results) {
                    insertIntoIntern(element.employee_id, getRandomDate());
                    i++;
                    if (i == 1000) {
                        break;
                    }
                }
            }
        });
        function insertIntoIntern(employee_id, date) {
            const intern = {
                name: "intern",
                properties: "employee_id, date",
                data: `${employee_id}, "${date}"`
            };
            return new Promise((resolve) => {
                insertValue(intern).then(() => resolve());
            });
        }
    });
}
function promoteIntern(employee_id) {
    mysqlDbConnection.query("DELETE FROM intern WHERE employee_id = ?", [employee_id], (err, results) => {
        if (err) {
            console.error(err);
        }
        else {
            console.log(results);
        }
    });
    mysqlDbConnection.query("INSERT INTO software_engineer (employee_id, date, was_promoted) VALUES (?, ?, true)", [employee_id, getDateToday()], (err, results) => {
        if (err) {
            console.error(err);
        }
        else {
            console.log(results);
        }
    });
}
exports.promoteIntern = promoteIntern;
function getCompanies() {
    return new Promise((resolve) => {
        mysqlDbConnection.query("SELECT tax_id FROM company", (err, results) => {
            if (err) {
                console.error(err);
            }
            else {
                resolve(results);
            }
        });
    });
}
exports.getCompanies = getCompanies;
function getDataInterns() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("==========GETTING DATA INTERNS============");
        return new Promise((resolve) => {
            mysqlDbConnection.query("SELECT * FROM employee NATURAL JOIN intern", (err, results) => {
                if (err) {
                    console.error(err);
                }
                else {
                    resolve(results);
                }
            });
        });
    });
}
exports.getDataInterns = getDataInterns;
function getInternOnEmployee() {
    return new Promise((resolve) => {
        mysqlDbConnection.query("SELECT * FROM intern LEFT JOIN employee ON intern.employee_id = employee.employee_id", (err, results) => {
            if (err) {
                console.error(err);
            }
            else {
                resolve(results);
            }
        });
    });
}
exports.getInternOnEmployee = getInternOnEmployee;
function getSoftwareEngineerOnEmployee() {
    return new Promise((resolve) => {
        mysqlDbConnection.query("SELECT * FROM software_engineer LEFT JOIN employee ON software_engineer.employee_id = employee.employee_id", (err, results) => {
            if (err) {
                console.error(err);
            }
            else {
                resolve(results);
            }
        });
    });
}
exports.getSoftwareEngineerOnEmployee = getSoftwareEngineerOnEmployee;
function getMySqlReport() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("==========GENERATING MYSQL REPORT============");
        const mySqlQuery = `DROP VIEW IF EXISTS A;
  DROP VIEW IF EXISTS B;
  
  CREATE VIEW A AS
  SELECT YEAR(date) AS year, tax_id, COUNT(YEAR(date)) AS interns_hired
      FROM intern
      NATURAL JOIN employee
      GROUP BY year, tax_id
      ORDER BY tax_id, year;
      
  CREATE VIEW B AS
  SELECT YEAR(date) AS year, tax_id, COUNT(YEAR(date)) AS software_engineers_hired
      FROM software_engineer
      NATURAL JOIN employee
      GROUP BY year, tax_id
      ORDER BY tax_id, year;
  
  (SELECT tax_id, year, interns_hired, software_engineers_hired  FROM A LEFT JOIN B USING (tax_id, year))
  UNION ALL
  (SELECT tax_id, year, interns_hired, software_engineers_hired FROM A RIGHT JOIN B USING (tax_id, year) WHERE A.interns_hired IS NULL)
  ORDER BY tax_id, year;`;
        return new Promise((resolve) => {
            mysqlDbConnection.query(mySqlQuery, (err, results) => {
                if (err) {
                    console.error(err);
                }
                else {
                    resolve(results);
                }
            });
        });
    });
}
exports.getMySqlReport = getMySqlReport;
function getRandomDate() {
    const start = new Date(2008, 0, 1);
    const end = new Date(2021, 11, 31);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split("T")[0];
}
function getDateToday() {
    return new Date().toISOString().split("T")[0];
}
function getRandomSalary() {
    return Math.random() * 100000;
}
function getRandomBoolean() {
    return Math.random() < 0.5;
}

import * as mysql from "mysql2";
import {
  employee,
  software_engineer,
  intern,
  manager,
  company,
} from "./mysqlDatabaseTables";
import Connection = require("mysql2/typings/mysql/lib/Connection");
import csvParser = require("csv-parser");
import fs = require("fs");

const mysqlDbConnection = mysql.createConnection({
  multipleStatements: true,
  host: "mysql",
  user: "root",
  password: "secret",
  database: "imse-database",
});

export function createTestTable(): void {
  mysqlDbConnection.query("CREATE TABLE IF NOT EXISTS test (id INT)", (err) => {
    err ? console.log(err) : console.log("Table test successfully created.");
  });
}

export async function createMySqlDatabase(): Promise<void> {
  await dropTable(intern.name);
  await dropTable(manager.name);
  await dropTable(software_engineer.name);
  await dropTable(employee.name);
  await dropTable(company.name);

  await createTable(company);
  await createTable(employee);
  await createTable(manager);
  await createTable(software_engineer);
  await createTable(intern);

  await insertCompanyData();
  await insertEmployeeData();
  await insertSoftwareEngineerData();
  await insertManagerData();
  await insertInternData();
}

function dropTable(tableName: String): Promise<void> {
  return new Promise((resolve) => {
    mysqlDbConnection.query("DROP TABLE IF EXISTS ??", [tableName], (err) => {
      err
        ? console.log(err)
        : (console.log('Table "' + tableName + '" successfully dropped.'),
          resolve());
    });
  });
}

function createTable(tableConfig: TableConfig): Promise<void> {
  return new Promise((resolve) => { 
    mysqlDbConnection.query(
      "CREATE TABLE IF NOT EXISTS " + tableConfig.name + " " + tableConfig.config,
      (err) => {
        err
          ? console.log(err)
          : (console.log('Table "' + tableConfig.name + '" successfully created.'), resolve())
      }
    );
  }) 
}

function insertValue(insertConfig: InsertConfig): Promise<void> {
  return new Promise((resolve) => {  
    mysqlDbConnection.query(
      "INSERT INTO " +
        insertConfig.name +
        " (" +
        insertConfig.properties +
        ") VALUES (" +
        insertConfig.data +
        ")",
      (err) => {
        err
          ? console.log(err)
          : resolve()
      }
    );
  })
}

async function insertCompanyData() {
  const promises: Promise<void>[] = [];

  const company: InsertConfig = {
    name: "company",
    properties: "",
    data: ""
  }

  for (let i = 0; i < 5; i++) {
    promises.push(new Promise ((resolve, reject) => {
      insertValue(company).then(() => resolve());
    }))
    
  }

  return Promise.all(promises);
}

async function insertEmployeeData() {
  const names: string[] = [];
  const surnames: string[] = [];
  let tax_ids: number[];

  function readNames(): Promise<void> {
    return new Promise((resolve) => {
      fs.createReadStream("/app/data/names.csv")
        .pipe(csvParser({ headers: false }))
        .on("data", (data) => names.push(data[0]))
        .on("end", () => resolve());
    });
  }

  function readSurnames(): Promise<void> {
    return new Promise((resolve) => {
      fs.createReadStream("/app/data/surnames.csv")
        .pipe(csvParser({ headers: false }))
        .on("data", (data) => surnames.push(data[0]))
        .on("end", () => resolve());
    });
  }

  function readCompanies(): Promise<void> {
    return new Promise((resolve) => {
      getCompanies().then((data: number[]) => {
        tax_ids = data;
        resolve();
      })
    })
  }

  await Promise.all([readNames(), readSurnames(), readCompanies()]);

  for (let i = 0; i < 1000; i++) {
    const name: string =
      names[Math.floor(Math.random() * names.length)] +
      " " +
      surnames[Math.floor(Math.random() * surnames.length)];
    await insertIntoEmployee(mysqlDbConnection, name, getRandomSalary(), getRandomTaxId());
  }

  function getRandomTaxId(): number {
    return tax_ids[Math.floor(Math.random()*tax_ids.length)]["tax_id"];
  }

  function insertIntoEmployee(db: any, name: string, salary: number, tax_id: number): Promise<void> {
    const employee: InsertConfig = {
      name: "employee",
      properties: "employee_name, salary, tax_id",
      data: `"${name}", ${salary}, ${tax_id}`,
    };
  
    return new Promise((resolve) => { 
      insertValue(employee).then(() => resolve());
    })
  }
}

async function insertSoftwareEngineerData() {
  mysqlDbConnection.query("SELECT employee_id FROM employee WHERE employee_id BETWEEN 50 AND 600", (err, results: mysql.RowDataPacket[]) => {
    if (err) {
      console.log(err)
    } else {
      console.log("Query successfully executed.");
      
      var i = 50
      for (const element of results) {
        insertIntoSoftwareEngineer(element.employee_id, getRandomDate(), getRandomBoolean());
        i++
        if (i == 601) {
          break;
        }
      }
      
    }
  })

  function insertIntoSoftwareEngineer(employee_id: number, date: String, was_promoted: boolean): Promise<void>  {
    const softwareEngineer: InsertConfig = {
       name: "software_engineer",
       properties: "employee_id, date, was_promoted",
       data: `${employee_id}, "${date}", ${was_promoted}`
    }
  
    return new Promise((resolve) => { 
      insertValue(softwareEngineer).then(() => resolve());
    })
  }
}

async function insertManagerData() {
  mysqlDbConnection.query("SELECT employee_id FROM employee WHERE employee_id < 50", (err, results: mysql.RowDataPacket[]) => {
    if (err) {
      throw err;
    } else {
      console.log("Query successfully executed.");

      var i = 0
      for (const element of results) {
        insertIntoManager(element.employee_id);
        i++
        if (i == 50) {
          break;
        }
      }
    }
  })

  function insertIntoManager(employee_id: number): Promise<void>  {
    const manager: InsertConfig = {
       name: "manager",
       properties: "employee_id",
       data: `${employee_id}`
    }
  
    return new Promise((resolve) => { 
      insertValue(manager).then(() => resolve());
    })
  }
}

async function insertInternData() {
  mysqlDbConnection.query("SELECT employee_id FROM employee WHERE employee_id > 600", (err, results: mysql.RowDataPacket[]) => {
    if (err) {
      console.log(err)
    } else {
      console.log("Query successfully executed.");

      var i = 601
      for (const element of results) {
        insertIntoIntern(element.employee_id, getRandomDate());
        i++
        if (i == 1000) {
          break;
        }
      }
    }
  })

  function insertIntoIntern(employee_id: number, date: string): Promise<void>  {
    const intern: InsertConfig = {
       name: "intern",
       properties: "employee_id, date",
       data: `${employee_id}, "${date}"`
    }
  
    return new Promise((resolve) => { 
      insertValue(intern).then(() => resolve());
    })
  }
}

export function promoteIntern(employee_id: number) {
  mysqlDbConnection.query("DELETE FROM intern WHERE employee_id = ?", [employee_id], (err, results) => {
    if (err) {
      throw err;
    } else {
      console.log(results)
    }
  })

  mysqlDbConnection.query("INSERT INTO software_engineer (employee_id, date, was_promoted) VALUES (?, ?, true)", [employee_id, getDateToday()], (err, results) => {
    if (err) {
      throw err;
    } else {
      console.log(results)
    }
  })
}

export function getCompanies() {
  return new Promise((resolve) => {
    mysqlDbConnection.query("SELECT tax_id FROM company", (err, results) => {
      if (err) {
        console.log(err);
      } else {
        resolve(results)
      }
    })
  })
}

export async function getDataInterns(): Promise<mysql.RowDataPacket[]> {
  console.log("==========GETTING DATA INTERNS============");
  return new Promise((resolve) => {
    mysqlDbConnection.query("SELECT * FROM employee NATURAL JOIN intern", (err, results: mysql.RowDataPacket[]) => {
      if (err) {
        throw err;
      } else {
        resolve(results)
      }
    })
  });
}

export function getInternOnEmployee(): Promise<mysql.RowDataPacket[]> {
  return new Promise((resolve) => {
    mysqlDbConnection.query("SELECT * FROM intern LEFT JOIN employee ON intern.employee_id = employee.employee_id", (err, results: mysql.RowDataPacket[]) => {
      if (err) {
        throw err;
      } else {
        resolve(results)
      }
    })
  });
}

export function getSoftwareEngineerOnEmployee(): Promise<mysql.RowDataPacket[]> {
  return new Promise((resolve) => {
    mysqlDbConnection.query("SELECT * FROM software_engineer LEFT JOIN employee ON software_engineer.employee_id = employee.employee_id", (err, results: mysql.RowDataPacket[]) => {
      if (err) {
        throw err;
      } else {
        resolve(results)
      }
    })
  });
}

export async function getMySqlReport() {
  console.log("==========GENERATING MYSQL REPORT============");
  const mySqlQuery: string =
  `DROP VIEW IF EXISTS A;
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
        console.log(err);
      } else {
        resolve(results)
      }
    })
  })
}

function getRandomDate(): string {
  const start = new Date(2008, 0, 1);
  const end = new Date(2021, 11, 31);

  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split("T")[0];
}

function getDateToday(): string {
  return new Date().toISOString().split("T")[0];
}

function getRandomSalary(): number {
  return Math.random() * 100000;
}

function getRandomBoolean(): boolean {
  return Math.random() < 0.5;
}
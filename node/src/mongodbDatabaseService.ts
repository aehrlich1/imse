import * as mongodb from "mongodb";
import { MongoClient } from "mongodb";
import csvParser = require("csv-parser");
import fs = require("fs");
import { getDateToday, getRandomBoolean, getRandomDate, getRandomSalary } from "./databaseHelper";

const mongoUri: string =
    "mongodb://mongoadmin:secret@mongodb:27017/?authMechanism=DEFAULT&tls=false";
const client: mongodb.MongoClient = new MongoClient(mongoUri);
client.connect();
const mongodbClient: mongodb.Db = client.db("imse-database");

export async function createMongodbDatabase(): Promise<void> {
  const collections: mongodb.Collection<mongodb.Document>[] = await mongodbClient.collections();
  await Promise.all(collections.map(async (collection) => {
    await collection.drop();
  }))

  await mongodbClient.createCollection("company");
  await mongodbClient.createCollection("employee");

  insertCompanyData();
  insertEmployeesData();
}

export async function getMongoDbInterns() {
  const employee = [];
  const employeeCollection = mongodbClient.collection("employee");
  const cursor = employeeCollection.find({position: "intern"}, {projection: {employee_id: 1, employee_name: 1, salary: 1, _id:0}});
  await cursor.forEach((element) => {
    employee.push(element);
  });

  return employee;
}

export async function promoteMongoDbIntern(employee_id: number) {
  const employeeCollection = mongodbClient.collection("employee");
  const updateDoc = {
    $set: {
      entry_date: getDateToday(),
      was_promoted: true,
      position: "software_engineer"
    }
  }
  employeeCollection.updateOne( {employee_id: employee_id}, updateDoc);
}

export async function getMongoDbReport() {
  const companyCollection = mongodbClient.collection("company");
  const pipeline =
  [
    {
      '$lookup': {
        'from': 'employee', 
        'localField': 'tax_id', 
        'foreignField': 'tax_id', 
        'as': 'employees'
      }
    }, {
      '$unwind': {
        'path': '$employees', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$project': {
        '_id': 0
      }
    }, {
      '$match': {
        '$expr': {
          '$or': [
            {
              '$eq': [
                '$employees.position', 'intern'
              ]
            }, {
              '$eq': [
                '$employees.position', 'software_engineer'
              ]
            }
          ]
        }
      }
    }, {
      '$set': {
        'employees.entry_date': {
          '$dateFromString': {
            'dateString': '$employees.entry_date'
          }
        }
      }
    }, {
      '$set': {
        'employees.entry_date': {
          '$dateToString': {
            'date': '$employees.entry_date', 
            'format': '%Y'
          }
        }
      }
    }, {
      '$group': {
        '_id': {
          'tax_id': '$tax_id', 
          'year': '$employees.entry_date'
        }, 
        'interns_hired': {
          '$sum': {
            '$cond': [
              {
                '$eq': [
                  '$employees.position', 'intern'
                ]
              }, 1, 0
            ]
          }
        }, 
        'software_engineers_hired': {
          '$sum': {
            '$cond': [
              {
                '$eq': [
                  '$employees.position', 'software_engineer'
                ]
              }, 1, 0
            ]
          }
        }
      }
    }, {
      '$set': {
        'tax_id': '$_id.tax_id', 
        'year': '$_id.year'
      }
    }, {
      '$project': {
        '_id': 0
      }
    }, {
      '$sort': {
        'tax_id': 1, 
        'year': 1
      }
    }
  ];

  const cursor = companyCollection.aggregate(pipeline);
  const report = []
  for await (const doc of cursor) {
    console.log(doc);
    report.push(doc)
  }

  return report;
}

function insertCompanyData() {
  const companyCollection = mongodbClient.collection("company");

  for (let i = 0; i < 5; i++) {
    let company: Object = {
      "tax_id": i
    }
    companyCollection.insertOne(company);
  }
}

async function insertEmployeesData() {
  const employeeCollection = mongodbClient.collection("employee");
  const names: string[] = [];
  const surnames: string[] = [];
  const tax_ids: number[] = [];

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

  async function readMongoDbCompanies(db: mongodb.Db): Promise<void> {
    const companyCollection = db.collection("company");
    const cursor = companyCollection.find({}, {projection: {tax_id: 1, _id:0}});
    await cursor.forEach((data) => {
      tax_ids.push(data.tax_id);
    });
  }

  await Promise.all([readNames(), readSurnames(), readMongoDbCompanies(mongodbClient)]);

  // Insert managers
  for (let i = 0; i < 50; i++) {
    const manager = {
      "employee_id": i,
      "employee_name": names[Math.floor(Math.random()*names.length)] + " " + surnames[Math.floor(Math.random()*surnames.length)],
      "salary": getRandomSalary(),
      "tax_id": tax_ids[Math.floor(Math.random()*tax_ids.length)],
      "position": "manager"
    }
    employeeCollection.insertOne(manager);
  }

  // Insert software engineers
  for (let i = 50; i <= 600; i++) {
    const software_engineer = {
      "employee_id": i,
      "employee_name": names[Math.floor(Math.random()*names.length)] + " " + surnames[Math.floor(Math.random()*surnames.length)],
      "salary": getRandomSalary(),
      "tax_id": tax_ids[Math.floor(Math.random()*tax_ids.length)],
      "position": "software_engineer",
      "entry_date": getRandomDate(),
      "was_promoted": getRandomBoolean()
    }
    employeeCollection.insertOne(software_engineer);
  }

  // Insert interns
  for (let i = 601; i < 1000; i++) {
    const intern = {
      "employee_id": i,
      "employee_name": names[Math.floor(Math.random()*names.length)] + " " + surnames[Math.floor(Math.random()*surnames.length)],
      "salary": getRandomSalary(),
      "tax_id": tax_ids[Math.floor(Math.random()*tax_ids.length)],
      "position": "intern",
      "entry_date": getRandomDate(),
    }
    employeeCollection.insertOne(intern);
  }

  // Create Indexes
  employeeCollection.createIndex( {employee_id: 1}, {unique: true} );
  employeeCollection.createIndex( {position: "text"} );
}
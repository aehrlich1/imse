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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMongoDbReport = exports.promoteMongoDbIntern = exports.getMongoDbInterns = exports.createMongodbDatabase = void 0;
const mongodb_1 = require("mongodb");
const csvParser = require("csv-parser");
const fs = require("fs");
const databaseHelper_1 = require("./databaseHelper");
const mongoUri = "mongodb://mongoadmin:secret@mongodb:27017/?authMechanism=DEFAULT&tls=false";
const client = new mongodb_1.MongoClient(mongoUri);
client.connect();
const mongodbClient = client.db("imse-database");
function createMongodbDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const collections = yield mongodbClient.collections();
        yield Promise.all(collections.map((collection) => __awaiter(this, void 0, void 0, function* () {
            yield collection.drop();
        })));
        yield mongodbClient.createCollection("company");
        yield mongodbClient.createCollection("employee");
        insertCompanyData();
        insertEmployeesData();
    });
}
exports.createMongodbDatabase = createMongodbDatabase;
function getMongoDbInterns() {
    return __awaiter(this, void 0, void 0, function* () {
        const employee = [];
        const employeeCollection = mongodbClient.collection("employee");
        const cursor = employeeCollection.find({ position: "intern" }, { projection: { employee_id: 1, employee_name: 1, salary: 1, _id: 0 } });
        yield cursor.forEach((element) => {
            employee.push(element);
        });
        return employee;
    });
}
exports.getMongoDbInterns = getMongoDbInterns;
function promoteMongoDbIntern(employee_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const employeeCollection = mongodbClient.collection("employee");
        const updateDoc = {
            $set: {
                entry_date: (0, databaseHelper_1.getDateToday)(),
                was_promoted: true,
                position: "software_engineer"
            }
        };
        employeeCollection.updateOne({ employee_id: employee_id }, updateDoc);
    });
}
exports.promoteMongoDbIntern = promoteMongoDbIntern;
function getMongoDbReport() {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        const companyCollection = mongodbClient.collection("company");
        const pipeline = [
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
        const report = [];
        try {
            for (var cursor_1 = __asyncValues(cursor), cursor_1_1; cursor_1_1 = yield cursor_1.next(), !cursor_1_1.done;) {
                const doc = cursor_1_1.value;
                console.log(doc);
                report.push(doc);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (cursor_1_1 && !cursor_1_1.done && (_a = cursor_1.return)) yield _a.call(cursor_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return report;
    });
}
exports.getMongoDbReport = getMongoDbReport;
function insertCompanyData() {
    const companyCollection = mongodbClient.collection("company");
    for (let i = 0; i < 5; i++) {
        let company = {
            "tax_id": i
        };
        companyCollection.insertOne(company);
    }
}
function insertEmployeesData() {
    return __awaiter(this, void 0, void 0, function* () {
        const employeeCollection = mongodbClient.collection("employee");
        const names = [];
        const surnames = [];
        const tax_ids = [];
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
        function readMongoDbCompanies(db) {
            return __awaiter(this, void 0, void 0, function* () {
                const companyCollection = db.collection("company");
                const cursor = companyCollection.find({}, { projection: { tax_id: 1, _id: 0 } });
                yield cursor.forEach((data) => {
                    tax_ids.push(data.tax_id);
                });
            });
        }
        yield Promise.all([readNames(), readSurnames(), readMongoDbCompanies(mongodbClient)]);
        // Insert managers
        for (let i = 0; i < 50; i++) {
            const manager = {
                "employee_id": i,
                "employee_name": names[Math.floor(Math.random() * names.length)] + " " + surnames[Math.floor(Math.random() * surnames.length)],
                "salary": (0, databaseHelper_1.getRandomSalary)(),
                "tax_id": tax_ids[Math.floor(Math.random() * tax_ids.length)],
                "position": "manager"
            };
            employeeCollection.insertOne(manager);
        }
        // Insert software engineers
        for (let i = 50; i <= 600; i++) {
            const software_engineer = {
                "employee_id": i,
                "employee_name": names[Math.floor(Math.random() * names.length)] + " " + surnames[Math.floor(Math.random() * surnames.length)],
                "salary": (0, databaseHelper_1.getRandomSalary)(),
                "tax_id": tax_ids[Math.floor(Math.random() * tax_ids.length)],
                "position": "software_engineer",
                "entry_date": (0, databaseHelper_1.getRandomDate)(),
                "was_promoted": (0, databaseHelper_1.getRandomBoolean)()
            };
            employeeCollection.insertOne(software_engineer);
        }
        // Insert interns
        for (let i = 601; i < 1000; i++) {
            const intern = {
                "employee_id": i,
                "employee_name": names[Math.floor(Math.random() * names.length)] + " " + surnames[Math.floor(Math.random() * surnames.length)],
                "salary": (0, databaseHelper_1.getRandomSalary)(),
                "tax_id": tax_ids[Math.floor(Math.random() * tax_ids.length)],
                "position": "intern",
                "entry_date": (0, databaseHelper_1.getRandomDate)(),
            };
            employeeCollection.insertOne(intern);
        }
        // Create Indexes
        employeeCollection.createIndex({ employee_id: 1 }, { unique: true });
        employeeCollection.createIndex({ position: "text" });
    });
}

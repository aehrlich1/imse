"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const mysqlDatabaseService_1 = require("./mysqlDatabaseService");
const mongodbDatabaseService_1 = require("./mongodbDatabaseService");
const port = 3000;
http
    .createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    switch (req.url) {
        case "/test": {
            console.log("test url was called!");
            (0, mongodbDatabaseService_1.migrateMongodbDatabase)();
            res.end();
            break;
        }
        case "/mysql": {
            res.writeHead(200, { "Content-Type": "text/plain" });
            if (req.method == "POST") {
                (0, mysqlDatabaseService_1.createMySqlDatabase)().then(() => res.end());
            }
            else {
                res.end();
            }
            break;
        }
        case "/mysql/interns": {
            res.writeHead(200, { "Content-Type": "application/json" });
            (0, mysqlDatabaseService_1.getDataInterns)().then((x) => res.end(JSON.stringify(x)));
            break;
        }
        case "/mysql/promoteintern": {
            res.writeHead(200, { "Content-Type": "application/json" });
            req.setEncoding("utf-8");
            req.on("data", (data) => {
                const employee_id = JSON.parse(data).employee_id;
                (0, mysqlDatabaseService_1.promoteIntern)(employee_id);
            });
            res.end(JSON.stringify({ OK: 1 }));
            break;
        }
        case "/mysql/report": {
            res.writeHead(200, { "Content-Type": "application/json" });
            (0, mysqlDatabaseService_1.getMySqlReport)().then((x) => res.end(JSON.stringify(x)));
            break;
        }
        case "/mongodb": {
            if (req.method == "POST") {
                (0, mongodbDatabaseService_1.createMongodbDatabase)();
            }
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end();
            break;
        }
        case "/mongodb/migrate": {
            res.writeHead(200, { "Content-Type": "application/json" });
            (0, mongodbDatabaseService_1.migrateMongodbDatabase)().then(() => res.end());
            break;
        }
        case "/mongodb/interns": {
            res.writeHead(200, { "Content-Type": "application/json" });
            (0, mongodbDatabaseService_1.getMongoDbInterns)().then((x) => res.end(JSON.stringify(x)));
            break;
        }
        case "/mongodb/promoteintern": {
            res.writeHead(200, { "Content-Type": "application/json" });
            req.setEncoding("utf-8");
            req.on("data", (data) => {
                const employee_id = JSON.parse(data).employee_id;
                (0, mongodbDatabaseService_1.promoteMongoDbIntern)(employee_id);
            });
            res.end(JSON.stringify({ OK: 1 }));
            break;
        }
        case "/mongodb/report": {
            res.writeHead(200, { "Content-Type": "application/json" });
            (0, mongodbDatabaseService_1.getMongoDbReport)().then((x) => res.end(JSON.stringify(x)));
            break;
        }
        default: {
            console.log("Default");
            break;
        }
    }
})
    .listen(port);

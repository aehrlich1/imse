import * as http from "http";
import { createMySqlDatabase, createTestTable, getDataInterns, getMySqlReport, promoteIntern } from "./mysqlDatabaseService";
import { createMongodbDatabase, getMongoDbInterns, getMongoDbReport, promoteMongoDbIntern } from "./mongodbDatabaseService";

const port: number = 3000;

http
  .createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    switch (req.url) {
      case "/test": {
        console.log("test url was called!");
        createTestTable();
        res.end();
        break;
      }
      case "/mysql": {
        if (req.method == "POST") {
          createMySqlDatabase();
        }
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end();
        break;
      }
      case "/mysql/interns": {
        res.writeHead(200, { "Content-Type": "application/json" });
        getDataInterns().then((x) => res.end(JSON.stringify(x)));
        break;
      }
      case "/mysql/promoteintern": {
        res.writeHead(200, { "Content-Type": "application/json" });
        req.setEncoding("utf-8");
        req.on("data", (data) => {
          const employee_id: number = JSON.parse(data).employee_id;
          promoteIntern(employee_id);
        });
        res.end(JSON.stringify({ OK: 1 }));
        break;
      }
      case "/mysql/report": {
        res.writeHead(200, { "Content-Type": "application/json" });
        getMySqlReport().then((x) => res.end(JSON.stringify(x)))
        break;
      }
      case "/mongodb": {
        if (req.method == "POST") {
          createMongodbDatabase();
        }
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end();
        break;
      }
      case "/mongodb/interns": {
        res.writeHead(200, { "Content-Type": "application/json" });
        getMongoDbInterns().then((x) => res.end(JSON.stringify(x)))
        break;
      }
      case "/mongodb/promoteintern": {
        res.writeHead(200, { "Content-Type": "application/json" });
        req.setEncoding("utf-8");
        req.on("data", (data) => {
          const employee_id: number = JSON.parse(data).employee_id;
          promoteMongoDbIntern(employee_id);
        });
        res.end(JSON.stringify({ OK: 1 }));
        break;
      }
      case "/mongodb/report": {
        res.writeHead(200, { "Content-Type": "application/json" });
        getMongoDbReport().then((x) => res.end(JSON.stringify(x)))
        break;
      }
      default: {
        console.log("Default");
        break;
      }
    }
  })
  .listen(port);
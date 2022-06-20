function mySql() {
  fetch("http://localhost:3000/mysql", {
    method: "POST"
  });
  console.log("MySql button was pressed!")
}

function mongoDb() {
  fetch("http://localhost:3000/mongodb", {
    method: "POST"
  });
  console.log("MongoDb button was pressed!")
}

function testCase() {
  fetch("http://localhost:3000/test", {
    method: "POST"
  });
  console.log("Test button was pressed!")
}

function mySqlEmployees() {
  fetch("http://localhost:3000/mysql/employees", {
    method: "GET"
  });
  console.log("MYSQL Employees were requested");
}
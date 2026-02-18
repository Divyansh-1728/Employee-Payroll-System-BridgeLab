const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


//  DATA STORAGE 
let employees = [];


// HOME PAGE 
app.get("/", (req, res) => {
  const search = req.query.search || "";

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  res.render("index", {
    employees: filteredEmployees,
    search
  });
});


//  ADD PAGE 
app.get("/add", (req, res) => {
  res.render("add");
});


// ADD EMPLOYEE 
app.post("/add", (req, res) => {
  const { name, gender, department, salary, startDate } = req.body;

  const newEmployee = {
    id: Date.now().toString(),
    name,
    gender,
    department,
    salary,
    startDate
  };

  employees.push(newEmployee);
  res.redirect("/");
});


//EDIT PAGE OPEN 
app.get("/edit/:id", (req, res) => {
  const id = req.params.id;

  const employee = employees.find(emp => emp.id == id);

  if (!employee) {
    return res.send("Employee not found");
  }

  res.render("edit", { employee });
});


//  UPDATE EMPLOYEE 
app.post("/edit/:id", (req, res) => {
  const id = req.params.id;

  const { name, gender, department, salary, startDate } = req.body;

  const employee = employees.find(emp => emp.id == id);

  if (employee) {
    employee.name = name;
    employee.gender = gender;
    employee.department = department;
    employee.salary = salary;
    employee.startDate = startDate;
  }

  res.redirect("/");
});

 
app.post("/delete/:id", (req, res) => {
  const id = req.params.id;

  employees = employees.filter(emp => emp.id != id);

  res.redirect("/");
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
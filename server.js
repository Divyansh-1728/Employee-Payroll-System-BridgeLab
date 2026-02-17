const express = require('express');
const app = express();
const fileHandler = require('./modules/fileHandler');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    const employees = await fileHandler.read();

    const totalBasic = employees.reduce((sum, emp) => sum + Number(emp.basicSalary), 0);
    
    const stats = {
        totalEmployees: employees.length,
        uniqueDepts: new Set(employees.map(e => e.department)).size,
        totalBasic: totalBasic.toLocaleString(),
        totalTax: (totalBasic * 0.12).toLocaleString(),
        totalNet: (totalBasic * 0.88).toLocaleString(),
        avgSalary: employees.length ? (totalBasic / employees.length).toFixed(0) : 0
    };

    res.render('index', { employees, stats });
});

app.get('/add', (req, res) => res.render('add'));

app.post('/add', async (req, res) => {
    const employees = await fileHandler.read();
    employees.push({
        id: Date.now(), 
        name: req.body.name,
        department: req.body.department,
        basicSalary: Number(req.body.basicSalary)
    });
    await fileHandler.write(employees);
    res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
    const employees = await fileHandler.read();
    const employee = employees.find(e => e.id === Number(req.params.id));
    res.render('edit', { employee });
});

app.post('/edit/:id', async (req, res) => {
    const employees = await fileHandler.read();
    const index = employees.findIndex(e => e.id === Number(req.params.id));
    
    if (index !== -1) {
        employees[index] = { 
            id: Number(req.params.id),
            name: req.body.name,
            department: req.body.department,
            basicSalary: Number(req.body.basicSalary)
        };
        await fileHandler.write(employees);
    }
    res.redirect('/');
});

app.get('/delete/:id', async (req, res) => {
    const idToDelete = Number(req.params.id);
    console.log("Attempting to delete ID:", idToDelete); 

    const employees = await fileHandler.read();
    
    const filtered = employees.filter(e => e.id !== idToDelete);

    await fileHandler.write(filtered);
    res.redirect('/');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
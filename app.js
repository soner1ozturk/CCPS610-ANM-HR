const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Home route
app.get('/', (req, res) => {
    res.render('index');
});

// Employee hiring route
app.get('/employee_hiring', (req, res) => {
    res.render('employee_hiring');
});

// Update employee route
app.get('/update_employee', (req, res) => {
    res.render('update_employee');
});

// About page route
app.get('/about', (req, res) => {
    res.render('about');
});

// Search employee route
app.get('/search_employee', (req, res) => {
    res.render('search_employee');
});

// Hire employee endpoint
app.post('/hire_employee', (req, res) => {
    const { firstName, lastName, email, phone, hireDate, salary, jobId, managerId, departmentId } = req.body;
    // Database insertion logic here
    res.json({ message: 'Employee hired successfully!' });
});

// Update employee endpoint
app.post('/update_employee', (req, res) => {
    const { employeeId, email, phone, salary } = req.body;
    // Database update logic here
    res.json({ message: 'Employee information updated successfully!' });
});

// Search employee endpoint
app.post('/search_employee', (req, res) => {
    const { searchTerm } = req.body;
    // Database search logic here
    // Example: Searching in a mock database
    const mockDatabase = [
        { id: 1, name: 'John Doe', position: 'Manager' },
        { id: 2, name: 'Jane Smith', position: 'Developer' }
    ];
    const results = mockDatabase.filter(employee => 
        employee.name.includes(searchTerm) || employee.id.toString() === searchTerm
    );
    res.json({ results });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

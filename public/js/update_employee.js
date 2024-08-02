document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('employeeList').style.display = 'none';
});

// Function to extract relevant error message
function extractRelevantErrorMessage(errorMessage) {
    const regex = /ORA-\d{5}:[^]+?(?=ORA-\d{5}:|$)/;
    const match = errorMessage.match(regex);
    return match ? match[0] : errorMessage;
}

async function searchEmployee() {
    const searchTerm = document.getElementById('searchTerm').value.trim().toLowerCase();
    if (!searchTerm) {
        alert('Please enter a search term');
        return;
    }

    try {
        const response = await fetch('/search_employee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ searchTerm }),
        });

        const data = await response.json();
        populateEmployeeTable(data.results);
    } catch (error) {
        console.error('Error searching employee:', error);
    }
}

async function listAllEmployees() {
    try {
        const response = await fetch('/all_employees', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        populateEmployeeTable(data.employees);
    } catch (error) {
        console.error('Error listing all employees:', error);
    }
}

function populateEmployeeTable(employees) {
    const employeeTableBody = document.getElementById('employeeTableBody');
    employeeTableBody.innerHTML = '';
    if (employees.length > 0) {
        document.getElementById('employeeList').style.display = 'block';
        employees.forEach(employee => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${employee[0]}</td>
                <td>${employee[1]}</td>
                <td>${employee[2]}</td>
                <td><input type="text" value="${employee[3]}" data-employee-id="${employee[0]}" class="editable email"></td>
                <td><input type="text" value="${employee[4]}" data-employee-id="${employee[0]}" class="editable phone"></td>
                <td><input type="text" value="${employee[5]}" data-employee-id="${employee[0]}" class="editable salary"></td>
                <td>
                    <div class="action-buttons">
                        <button class="update" onclick="updateEmployee(${employee[0]})">Update</button>
                        <button class="delete" onclick="deleteEmployee(${employee[0]})">Delete</button>
                    </div>
                </td>
            `;
            employeeTableBody.appendChild(row);
        });
    } else {
        document.getElementById('employeeList').style.display = 'none';
    }
}

async function updateEmployee(employeeId) {
    const email = document.querySelector(`.email[data-employee-id="${employeeId}"]`).value;
    const phone = document.querySelector(`.phone[data-employee-id="${employeeId}"]`).value;
    const salary = document.querySelector(`.salary[data-employee-id="${employeeId}"]`).value;

    try {
        const response = await fetch('/update_employee_info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ employeeId, email, phone, salary }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
        } else {
            const errorMessage = extractRelevantErrorMessage(data.message);
            document.getElementById('errorMessage').innerText = `Error updating employee: ${errorMessage}`;
        }
    } catch (error) {
        document.getElementById('errorMessage').innerText = 'Error updating employee.';
        console.error('Error updating employee:', error);
    }
}

async function deleteEmployee(employeeId) {
    if (confirm('Are you sure you want to delete this employee?')) {
        try {
            const response = await fetch('/terminate_employee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ employeeId }),
            });

            const data = await response.json();
            alert(data.message);
            listAllEmployees(); // Refresh the list after deleting
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    }
}


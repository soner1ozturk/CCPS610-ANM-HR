document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/jobs');
        const data = await response.json();
        const jobSelect = document.getElementById('jobSelect');
        
        data.jobs.forEach(job => {
            const option = document.createElement('option');
            option.value = job.job_id;
            option.text = job.job_title;
            jobSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching jobs:', error);
    }
});

async function showJobInfo() {
    const jobId = document.getElementById('jobSelect').value;
    if (!jobId) {
        alert('Please select a job');
        return;
    }

    try {
        const response = await fetch(`/jobBoardDetails/${jobId}`);
        const jobDetails = await response.json();

        const jobTableBody = document.getElementById('jobTableBody');
        jobTableBody.innerHTML = '';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${jobDetails.job_id}</td>
            <td><input type="text" value="${jobDetails.job_title}" data-job-id="${jobDetails.job_id}" class="editable job_title"></td>
            <td><input type="text" value="${jobDetails.min_salary}" data-job-id="${jobDetails.job_id}" class="editable min_salary"></td>
            <td><input type="text" value="${jobDetails.max_salary}" data-job-id="${jobDetails.job_id}" class="editable max_salary"></td>
            <td>
                <div class="action-buttons">
                    <button class="update" onclick="updateJob('${jobDetails.job_id}')">Update</button>
                </div>
            </td>
        `;
        jobTableBody.appendChild(row);

        document.getElementById('jobInfo').style.display = 'block';
    } catch (error) {
        console.error('Error fetching job details:', error);
    }
}

async function updateJob(jobId) {
    const jobTitle = document.querySelector(`.job_title[data-job-id="${jobId}"]`).value;
    const minSalary = document.querySelector(`.min_salary[data-job-id="${jobId}"]`).value;
    const maxSalary = document.querySelector(`.max_salary[data-job-id="${jobId}"]`).value;

    try {
        const response = await fetch('/update_jobBoard_info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ jobId, jobTitle, minSalary, maxSalary }),
        });

        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error('Error updating job:', error);
    }
}
async function createJob() {
    const jobId = prompt('Enter Job ID:');
    const jobTitle = prompt('Enter Job Title:');
    const minSalary = prompt('Enter Minimum Salary:');

    if (!jobId || !jobTitle || !minSalary) {
        alert('All fields are required.');
        return;
    }

    console.log('Creating job with data:', { jobId, jobTitle, minSalary }); // Debug log

    try {
        const response = await fetch('/create_job', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ jobId, jobTitle, minSalary }),
        });

        const data = await response.json();
        alert(data.message);

        // Optionally, you can refresh the job list or job info here
        // Refresh job list
        const jobSelect = document.getElementById('jobSelect');
        const option = document.createElement('option');
        option.value = jobId;
        option.text = jobTitle;
        jobSelect.appendChild(option);
    } catch (error) {
        console.error('Error creating job:', error);
    }
}
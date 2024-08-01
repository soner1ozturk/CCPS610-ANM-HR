document.addEventListener('DOMContentLoaded', function() {
    // Fetch job IDs and populate the dropdown
    fetch('/jobs')
        .then(response => response.json())
        .then(data => {
            const jobSelect = document.getElementById('jobId');
            data.jobs.forEach(job => {
                const option = document.createElement('option');
                option.value = job.job_id;
                option.text = `${job.job_id} - ${job.job_title}`;
                jobSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching jobs:', error);
        });

    // Add event listener for job ID dropdown change
    document.getElementById('jobId').addEventListener('change', function() {
        const jobId = this.value;
        if (jobId) {
            fetch(`/jobDetails/${jobId}`)
                .then(response => response.json())
                .then(data => {
                    document.getElementById('managerId').value = data.manager_id || '';
                    document.getElementById('departmentId').value = data.department_id || '';
                })
                .catch(error => {
                    console.error('Error fetching job details:', error);
                });
        } else {
            document.getElementById('managerId').value = '';
            document.getElementById('departmentId').value = '';
        }
    });
});

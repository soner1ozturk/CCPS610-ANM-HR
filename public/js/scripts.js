// Employee Hiring Form Submission
document.getElementById('hiringForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    fetch('/hire_employee', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// Employee Update Form Submission
document.getElementById('updateForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    fetch('/update_employee', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// Employee Search Form Submission
document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    fetch('/search_employee', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const resultsContainer = document.getElementById('searchResults');
        resultsContainer.innerHTML = '';
        if (data.results.length > 0) {
            data.results.forEach(result => {
                const resultElement = document.createElement('div');
                resultElement.textContent = `ID: ${result.id}, Name: ${result.name}, Position: ${result.position}`;
                resultsContainer.appendChild(resultElement);
            });
        } else {
            resultsContainer.textContent = 'No results found.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// Carousel Initialization and Reinitialization
$(document).ready(function() {
    function initializeCarousel() {
        $("#carousel").owlCarousel({
            autoPlay: 3000,
            items: 1,
            loop: true,
            navigation: true,
            pagination: true,
            transitionStyle: "fade",
            stopOnHover: true,
            singleItem: true,
            responsive: true,
            responsiveRefreshRate: 200,
            navigationText: ["<", ">"]
        });
    }

    initializeCarousel();

    $(window).on('resize', function() {
        $("#carousel").trigger('destroy.owl.carousel');
        initializeCarousel();
    });
});

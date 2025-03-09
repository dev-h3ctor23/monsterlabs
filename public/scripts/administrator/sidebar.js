document.addEventListener("DOMContentLoaded", function() {
    fetch('../../components/sidebar-administrator.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar-container').innerHTML = data;
            setupTabSwitching();
        })
        .catch(error => console.error('Error al cargar el sidebar:', error));
});

function setupTabSwitching() {
    const tabs = document.querySelectorAll('.tabs input[type="radio"]');
    tabs.forEach(tab => {
        tab.addEventListener('change', function() {
            const contentSections = document.querySelectorAll('.content-section');
            contentSections.forEach(section => section.style.display = 'none');
            document.getElementById(`${this.id}-content`).style.display = 'block';
        });
    });
}
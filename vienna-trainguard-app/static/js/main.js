document.addEventListener('DOMContentLoaded', () => {
    const reportForm = document.getElementById('report-form');
    const sightingsList = document.getElementById('sightings-list');
    const timeInput = document.getElementById('time');

    // Set default time to current local time
    const setTimeToNow = () => {
        const now = new Date();
        timeInput.value = now.toTimeString().slice(0, 5);
    };
    setTimeToNow();

    // Fetch and display sightings
    const fetchSightings = async () => {
        try {
            const response = await fetch('/api/sightings');
            const data = await response.json();
            renderSightings(data);
        } catch (error) {
            console.error('Error fetching sightings:', error);
        }
    };

    // Render sightings to the DOM
    const renderSightings = (sightings) => {
        sightingsList.innerHTML = '';
        if (sightings.length === 0) {
            sightingsList.innerHTML = '<p class="empty-state">No sightings reported yet. You\'re safe for now! 😌</p>';
            return;
        }

        // Display newest sightings first
        const reversedSightings = [...sightings].reverse();

        reversedSightings.forEach((sighting, index) => {
            const card = document.createElement('div');
            card.className = 'sighting-card';
            // Slight animation delay for staggered entrance on initial load
            card.style.animationDelay = `${index * 0.1}s`; 
            
            card.innerHTML = `
                <h3>
                    ${escapeHtml(sighting.location)} 
                    <span class="line-badge">${escapeHtml(sighting.line)}</span>
                </h3>
                <p>🕒 Reported at: <strong>${escapeHtml(sighting.time)}</strong></p>
            `;
            sightingsList.appendChild(card);
        });
    };

    // Handle form submission
    reportForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = reportForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Reporting...';
        btn.disabled = true;

        const location = document.getElementById('location').value;
        const line = document.getElementById('line').value;
        const time = document.getElementById('time').value;

        const sightingData = { location, line, time };

        try {
            const response = await fetch('/api/sightings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sightingData)
            });

            if (response.ok) {
                // Clear form inputs nicely
                document.getElementById('location').value = '';
                document.getElementById('line').value = '';
                setTimeToNow();
                
                // Refresh the feed
                fetchSightings();

                // Show success on button briefly
                btn.textContent = 'Reported! ✅';
                btn.style.backgroundColor = '#28a745';
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                    btn.disabled = false;
                }, 2000);
            } else {
                throw new Error('Server returned an error');
            }
        } catch (error) {
            console.error('Error submitting sighting:', error);
            alert('Failed to submit sighting. Please try again.');
            btn.textContent = originalText;
            btn.disabled = false;
        }
    });

    // Helper function to prevent XSS
    function escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }

    // Initial fetch of data
    fetchSightings();

    // Optionally check for new sightings every 30 seconds
    setInterval(fetchSightings, 30000);
});

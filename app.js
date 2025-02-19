async function searchFlights() {
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const date = document.getElementById('date').value;

    if (!origin || !destination || !date) {
        alert('Please fill all fields');
        return;
    }

    try {
        const response = await fetch('/.netlify/functions/searchFlights', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ origin, destination, date })
        });
        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch flight data');
    }
}

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (data.data && data.data.length > 0) {
        data.data.forEach(flight => {
            const flightCard = document.createElement('div');
            flightCard.className = 'flight-card';
            flightCard.innerHTML = `
                <h3>${flight.itineraries[0].segments[0].carrierCode} ${flight.itineraries[0].segments[0].number}</h3>
                <p>From: ${flight.itineraries[0].segments[0].departure.iataCode}</p>
                <p>To: ${flight.itineraries[0].segments[0].arrival.iataCode}</p>
                <p>Departure: ${flight.itineraries[0].segments[0].departure.at}</p>
                <p>Price: ${flight.price.total} ${flight.price.currency}</p>
            `;
            resultsDiv.appendChild(flightCard);
        });
    } else {
        resultsDiv.innerHTML = '<p>No flights found.</p>';
    }
}
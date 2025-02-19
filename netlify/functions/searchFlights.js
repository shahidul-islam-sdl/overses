const fetch = require('node-fetch');

exports.handler = async (event) => {
    const { origin, destination, date } = JSON.parse(event.body);

    try {
        // Get Access Token
        const tokenResponse = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=client_credentials&client_id=${process.env.O6Jm4lNjJp2NA1BbLvvOwp68FU4phoCf}&client_secret=${process.env.AfekgL0mWNTTvnZW}`
        });
        const tokenData = await tokenResponse.json();
        const token = tokenData.access_token;

        // Search Flights
        const params = new URLSearchParams({
            originLocationCode: origin,
            destinationLocationCode: destination,
            departureDate: date,
            adults: 1,
            max: 5 // Limit results to 5 flights
        });

        const flightResponse = await fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?${params}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const flightData = await flightResponse.json();

        return {
            statusCode: 200,
            body: JSON.stringify(flightData)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch flight data' })
        };
    }
};
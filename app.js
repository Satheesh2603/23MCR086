const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const NUMBER_API_URL = 'http://localhost:9876/numbers/e';
const TIMEOUT = 500;
let windowNumbers = [];

async function getNumber(numberId) {
    try {
        const response = await axios.get(`${NUMBER_API_URL}/${numberId}`, { timeout: TIMEOUT });
        return response.data.number;
    } catch (error) {
        return null;
    } }
app.get('/numbers/:numberId', async (req, res) => {
    const { numberId } = req.params;
    const previousWindow = [...windowNumbers];
    const fetchedNumber = await getNumber(numberId);

    if (fetchedNumber !== null && !windowNumbers.includes(fetchedNumber)) {
        if (windowNumbers.length >= WINDOW_SIZE) {
            windowNumbers.shift();
        }
        windowNumbers.push(fetchedNumber);
    }

    const currentWindow = [...windowNumbers];
    const average = windowNumbers.length > 0
        ? (windowNumbers.reduce((sum, num) => sum + num, 0) / windowNumbers.length).toFixed(2)
        : '0.00';

    res.json({
        windowPrevState: previousWindow,
        windowCurrState: currentWindow,
        numbers: fetchedNumber !== null ? [fetchedNumber] : [],
        avg: parseFloat(average)
    });});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

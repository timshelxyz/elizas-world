const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');

// Load both .env and .env.local files
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testSolSnifferAPI() {
    const testAddresses = [
        'Gu3LDkn7Vx3bmCzLafYNKcDxv2mH7YN44NJZFXnypump',
        'wUtwjNmjCP9TTTtoc5Xn5h5sZ2cYJm5w2w44b79yr2o'
    ];

    const apiKey = process.env.SOLSNIFFER_API_KEY;
    console.log('Testing with addresses:', testAddresses);
    console.log('API Key available:', !!apiKey);
    console.log('API Key:', apiKey?.substring(0, 5) + '...');  // Show first 5 chars for verification
    
    try {
        const response = await axios.post('https://solsniffer.com/api/v2/tokens', 
            { addresses: testAddresses },
            {
                headers: {
                    'accept': 'application/json',
                    'X-API-KEY': apiKey,
                    'Content-Type': 'application/json',
                }
            }
        );

        console.log('Response status:', response.status);
        console.log('Response data:', JSON.stringify(response.data, null, 2));
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.error('Error response:', error.response?.status);
            console.error('Error data:', error.response?.data);
            console.error('Full error:', error.message);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testSolSnifferAPI();

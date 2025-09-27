import fetch from 'node-fetch';

async function testPublicEndpoint() {
  const baseURL = 'https://shraddha-backend.onrender.com/api';
  
  try {
    console.log('Testing public withdrawal endpoint...\n');
    
    // Test public admin endpoint
    console.log('1. Testing /withdrawals/admin/public endpoint...');
    try {
      const response = await fetch(`${baseURL}/withdrawals/admin`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Status:', response.status);
      const data = await response.json();
      console.log('Response:', JSON.stringify(data, null, 2));
      
      if (data.success && data.withdrawalRequests) {
        console.log(`✅ Found ${data.withdrawalRequests.length} withdrawal requests`);
        if (data.withdrawalRequests.length > 0) {
          console.log('Sample request:', data.withdrawalRequests[0]);
        }
      } else {
        console.log('❌ No withdrawal requests found or API error');
      }
    } catch (error) {
      console.error('Error testing public endpoint:', error.message);
    }
    
  } catch (error) {
    console.error('General error:', error);
  }
}

testPublicEndpoint();

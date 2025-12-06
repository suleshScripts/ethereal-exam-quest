// Test Razorpay key validity
const Razorpay = require('razorpay');

const RAZORPAY_KEY_ID = 'rzp_live_Rlz1BRY2tHLFgm';
const RAZORPAY_KEY_SECRET = 'axNRQm0pmgH90D8mHnIvyRHZ';

console.log('Testing Razorpay initialization...');
console.log('Key ID:', RAZORPAY_KEY_ID);
console.log('Key Secret:', RAZORPAY_KEY_SECRET.substring(0, 10) + '...');

try {
  const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
  
  console.log('✅ Razorpay instance created successfully');
  
  // Try to create a test order
  razorpay.orders.create({
    amount: 100, // ₹1 in paise
    currency: 'INR',
    receipt: 'test_receipt_' + Date.now(),
  })
  .then(order => {
    console.log('✅ Test order created successfully!');
    console.log('Order ID:', order.id);
    console.log('Keys are VALID and working!');
  })
  .catch(error => {
    console.error('❌ Order creation failed:', error.message);
    console.error('Error details:', error);
    if (error.statusCode === 401) {
      console.error('🔴 AUTHENTICATION FAILED - Keys are invalid or expired');
    }
  });
  
} catch (error) {
  console.error('❌ Razorpay initialization failed:', error.message);
}

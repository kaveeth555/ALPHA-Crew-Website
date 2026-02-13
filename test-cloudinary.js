require('dotenv').config({ path: '.env.local' });
const cloudinary = require('cloudinary').v2;

console.log('Checking Cloudinary Config...');
console.log('CLOUDINARY_URL exists:', !!process.env.CLOUDINARY_URL);

if (process.env.CLOUDINARY_URL) {
    // Hide secret in logs
    const url = process.env.CLOUDINARY_URL;
    console.log('URL Scheme:', url.split('://')[0]);
    console.log('Cloud Name present:', url.includes('@'));
}

cloudinary.api.ping((error, result) => {
    if (error) {
        console.error('❌ Connection Failed:', error);
    } else {
        console.log('✅ Connection Successful:', result);
    }
});

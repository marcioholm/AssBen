const fs = require('fs');
const _path = require('path');

async function uploadCSV() {
    const csvPath = _path.join(__dirname, '..', 'empresas-ficticias-acebraz.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');

    // Create form data boundary and payload manually to avoid extra dependencies
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    let data = '';

    data += `--${boundary}\r\n`;
    data += `Content-Disposition: form-data; name="file"; filename="empresas-ficticias-acebraz.csv"\r\n`;
    data += `Content-Type: text/csv\r\n\r\n`;
    data += csvContent + '\r\n';

    // Add additional fields
    data += `--${boundary}\r\n`;
    data += `Content-Disposition: form-data; name="termoAceito"\r\n\r\n`;
    data += `true\r\n`;

    data += `--${boundary}\r\n`;
    data += `Content-Disposition: form-data; name="responsavelName"\r\n\r\n`;
    data += `Admin ACEBRAZ\r\n`;

    data += `--${boundary}\r\n`;
    data += `Content-Disposition: form-data; name="responsavelRegistro"\r\n\r\n`;
    data += `123456\r\n`;

    data += `--${boundary}--\r\n`;

    try {
        console.log('Fetching JWT token...');
        // 1. Get JWT Token from live API
        const loginRes = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@acebraz.com.br', password: 'adminpassword' })
        });

        if (!loginRes.ok) throw new Error('Login failed on production. ' + await loginRes.text());

        const { token } = await loginRes.json();

        console.log('Token received. Uploading CSV to production API...');

        // 2. Upload CSV
        const uploadRes = await fetch('http://localhost:3001/api/beneficiarios/upload-csv', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': `multipart/form-data; boundary=${boundary}`
            },
            body: data
        });

        const result = await uploadRes.json();
        console.log('Upload result:', result);
    } catch (err) {
        console.error('Migration failed:', err.message);
    }
}

uploadCSV();

const fs = require('fs');
const https = require('https');
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const validator = require('validator');

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// Load SSL certificate and key
const options = {
    key: fs.readFileSync('./../cert.key'), // Replace with your key path
    cert: fs.readFileSync('./../cert.crt'), // Replace with your certificate path
};

// Security middleware
app.use(helmet());

// Disable 'X-Powered-By' header
app.disable('x-powered-by');

// CORS configuration
const corsOptions = {
    origin: ['https://localhost:3000'], // Restrict to your frontend's domain
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Rate limiting
/*
const limiter = rateLimit({
    windowMs: 1000, // 1 second window
    max: 5, // Limit each IP to 5 requests per second
});
app.use(limiter);
*/

// Middleware to parse JSON bodies
app.use(express.json());

// Route to fetch metadata
app.post('/fetch-metadata', async (req, res) => {
    const urls = req.body.urls;

    // Validate input
    if (!Array.isArray(urls) || urls.length < 3) {
        return res.status(400).json({ error: 'Please provide at least 3 URLs' });
    }

    if (!urls.every(url => validator.isURL(url))) {
        return res.status(400).json({ error: 'Invalid URL(s) provided' });
    }

    try {
        const metadata = await Promise.all(urls.map(async (url) => {
            try {
                const { data } = await axios.get(url, { timeout: 5000 }); // Timeout after 5 seconds
                const $ = cheerio.load(data);
                const title = $('title').text();
                const description = $('meta[name="description"]').attr('content');
                const image = $('meta[property="og:image"]').attr('content');
                console.log( { url, title, description, image } );
                return { url, title, description, image };
            } catch (error) {
                return { url, error: 'Failed to fetch metadata' };
            }
        }));

        res.json(metadata);
    } catch (error) {
        console.error('Server error:', error); // Log the error for debugging
        res.status(500).json({ error: 'Server error' });
    }
});

// Create HTTPS server
https.createServer(options, app).listen(PORT, () => {
    console.log(`Server running securely on https://localhost:${PORT}`);
});

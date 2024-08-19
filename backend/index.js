const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5001;
const cors = require('cors');
app.use(cors());

// Security middleware
app.use(helmet());

// Rate limiting
/* const limiter = rateLimit({
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

    if (!Array.isArray(urls) || urls.length < 3) {
        return res.status(400).json({ error: 'Please provide at least 3 URLs' });
    }

    try {
        const metadata = await Promise.all(urls.map(async (url) => {
            try {
                const { data } = await axios.get(url);
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
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

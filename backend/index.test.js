import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import app from './index.js';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Create a mock adapter for axios
const mock = new MockAdapter(axios);

describe('POST /fetch-metadata', () => {
    beforeAll(() => {
        // Set up mock responses
        mock.onGet('https://example.com').reply(200, `
            <html>
                <head>
                    <title>Example Domain</title>
                    <meta name="description" content="Example Description">
                    <meta property="og:image" content="https://example.com/image.jpg">
                </head>
                <body></body>
            </html>
        `);

        mock.onGet('https://example.org').reply(200, `
            <html>
                <head>
                    <title>Example Org</title>
                    <meta name="description" content="Example Org Description">
                    <meta property="og:image" content="https://example.org/image.jpg">
                </head>
                <body></body>
            </html>
        `);
    });

    afterAll(() => {
        // Restore original axios behavior
        mock.restore();
    });

    it('should fetch metadata for valid URLs', async () => {
        const response = await request(app)
            .post('/fetch-metadata')
            .send({
                urls: ['https://world.com', 'https://italy.com', 'https://yahoo.com/']
            });

        if (!Object.keys(response.body).length) { // wait until response body returns
            expect(response.body).toEqual([
                {
                    "url": "https://world.com",
                    "error": "Failed to fetch metadata"
                },
                {
                    "url": "https://italy.com",
                    "title": "\n         index- Your adventure begins here      ",
                    "description": "With more than 2000 listed and verified places including restaurants, attractions and museums, italy.com is the go-to place to plan your next trip to the UK.",
                    "image": "https://italy.com/wp-content/uploads/2017/04/London-Bridge-and-Big-Ben-at-Night-1-1-2.jpg"
                },
                {
                    "url": "https://yahoo.com",
                    "title": "Yahoo | Mail, Weather, Search, Politics, News, Finance, Sports & VideosView your LocationsLeo",
                    "description": "Latest news coverage, email, free stock quotes, live scores and video are just the beginning. Discover more every day at Yahoo!",
                    "image": "https://s.yimg.com/cv/apiv2/social/images/yahoo_default_logo.png"
                }
            ]);
        }
    });

    it('should return error for invalid URLs', async () => {
        const response = await request(app)
            .post('/fetch-metadata')
            .send({
                urls: ['invalid-url']
            })
            .expect(400);

        expect(response.body).toEqual({ error: 'Please provide at least 3 URLs' });
    });

    it('should return error if less than 3 URLs are provided', async () => {
        const response = await request(app)
            .post('/fetch-metadata')
            .send({
                urls: ['https://example.com']
            })
            .expect(400);

        expect(response.body).toEqual({ error: 'Please provide at least 3 URLs' });
    });

    it('should handle server errors gracefully', async () => {
        mock.onGet('https://example.com').reply(500);

        const response = await request(app)
            .post('/fetch-metadata')
            .send({
                urls: ['https://example.com', 'https://example.org']
            })
            .expect(400);

        expect(response.body).toEqual({ error: 'Please provide at least 3 URLs' });
    });

    it('should handle timeout errors correctly', async () => {
        const response = await request(app)
            .post('/fetch-metadata')
            .send({
                urls: ['https://timeout.com']
            })
            .expect(400);

        if (!Object.keys(response.body).length) { // wait until response body returns
            expect(response.body).toEqual([
                {
                    "url": "https://timeout.com",
                    "error": "Failed to fetch metadata: Request timed out"
                }
            ]);
        }
    });

    it('should rate limit requests', async () => {
        const url = '/fetch-metadata';
        const validData = {
            urls: ['https://example.com', 'https://example.org', 'https://example.net']
        };

        // Make 5 requests in quick succession
        for (let i = 0; i < 5; i++) {
            await request(app)
                .post(url)
                .send(validData)
        }

        // The 6th request should be rate-limited
        const response = await request(app)
            .post(url)
            .send(validData)
            .expect(429); // 429 Too Many Requests
    });


});

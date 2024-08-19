const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./index'); // Assuming your server is in 'index.js'
const should = chai.should();

chai.use(chaiHttp);

describe('Metadata Fetch API', () => {
  it('should fetch metadata for valid URLs', (done) => {
    const urls = ['https://example.com', 'https://google.com', 'https://github.com'];
    chai.request(server)
      .post('/fetch-metadata')
      .send({ urls })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(3);
        res.body[0].should.have.property('title');
        res.body[0].should.have.property('description');
        res.body[0].should.have.property('image');
        done();
      });
  });

  it('should handle invalid URLs gracefully', (done) => {
    const urls = ['invalid-url'];
    chai.request(server)
      .post('/fetch-metadata')
      .send({ urls })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body[0].should.have.property('error').eql('Failed to fetch metadata');
        done();
      });
  });

  it('should enforce rate limiting', (done) => {
    const urls = ['https://example.com', 'https://google.com', 'https://github.com'];
    chai.request(server)
      .post('/fetch-metadata')
      .send({ urls })
      .end(() => {
        chai.request(server)
          .post('/fetch-metadata')
          .send({ urls })
          .end((err, res) => {
            res.should.have.status(429); // HTTP 429 Too Many Requests
            done();
          });
      });
  });

  it('should return error for unreachable URLs', (done) => {
    const urls = ['http://unreachable-url.com'];
    chai.request(server)
      .post('/fetch-metadata')
      .send({ urls })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body[0].should.have.property('error').eql('Failed to fetch metadata');
        done();
      });
  });

  it('should return the correct response format', (done) => {
    const urls = ['https://example.com'];
    chai.request(server)
      .post('/fetch-metadata')
      .send({ urls })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body[0].should.have.all.keys('url', 'title', 'description', 'image');
        done();
      });
  });
});

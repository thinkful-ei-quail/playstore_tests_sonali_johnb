const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../playstoreServer.js');

describe('Playstore app', () => {
  it('should get a 200 status', () => {
    return supertest(app)
      .get('/apps')
      .expect(200);
  });

  it('should return a response body that is an array', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1);
      });
  });

  it('should return full app objects in response', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body[0]).to.include.keys('App', 'Rating', 'Genres');
      });
  });

  it('should filter apps by genre param', () => {
    return supertest(app)
      .get('/apps')
      .query({ genres: 'Puzzle'})
      .expect(200)
      .expect('Content-Type', /json/)
      .then( res => {
        let validFilter = true;
        res.body.find(app => {
          if(!app.Genres.includes('Puzzle')){
            return validFilter = false;  
          }
        });
        expect(validFilter).to.be.true;
      });
  });

  it('should sort the response alphabetically when given "App" as a sort param', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'App' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then( res => {
        let sorted = true;
        let i = 0;
        while(i < res.body.length - 1) {
          if(res.body[i].App > res.body[i + 1].App) {
            return sorted = false;
          } 
          i++;
        }
        expect(sorted).to.be.true;
      });
  });

  it('should sort the response in descending order when given "Rating" as a sort param', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'Rating' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then( res => {
        let sorted = true;
        let i = 0;
        while(i < res.body.length - 1) {
          if(res.body[i].Rating < res.body[i + 1].Rating) {
            return sorted = false;
          } 
          i++;
        }
        expect(sorted).to.be.true;
      });
  });

  it('should return 400 status if invalid sort parameter', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'invalid' })
      .expect(400, 'Please sort by either rating or app');
  });

  it('should return 400 status if given invalid genre parameter', () => {
    return supertest(app)
      .get('/apps')
      .query({ genres: 'invalid' })
      .expect(400, 'Please filter by "Action, Puzzle, Strategy, Casual, Arcade or Card"');
  });

});

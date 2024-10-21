const request = require('supertest');
const app = require('../server'); // Import Express app
const { Loan, User, sequelize } = require('../models'); // Import models

let token;
let adminToken;
let loanId;

beforeAll(async () => {
  // Sync database
  await sequelize.sync({ force: true });

  // Create user and admin for testing
  const user = await User.create({ username: 'testuser', password: 'password' });
  const admin = await User.create({ username: 'admin', password: 'password', role: 'admin' });

  // Login as user and get token
  const userLogin = await request(app)
    .post('/api/auth/login')
    .send({ username: 'testuser', password: 'password' });

  token = userLogin.body.token;

  // Login as admin and get admin token
  const adminLogin = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'password' });

  adminToken = adminLogin.body.token;
});

afterAll(async () => {
  await sequelize.close(); // Close DB connection after tests
});

describe('Loan API', () => {
  it('should allow user to create a loan', async () => {
    const response = await request(app)
      .post('/api/loans/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 10000, term: 3 });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.status).toBe('PENDING');
    loanId = response.body.id; // Store loanId for future tests
  });

  it('should allow user to view their loans', async () => {
    const response = await request(app)
      .get('/api/loans')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].status).toBe('PENDING');
  });

  it('should allow admin to approve a loan', async () => {
    const response = await request(app)
      .put(`/api/loans/approve/${loanId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('APPROVED');
  });

  it('should not allow non-admin to approve a loan', async () => {
    const response = await request(app)
      .put(`/api/loans/approve/${loanId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Access denied. Admins only.');
  });
});

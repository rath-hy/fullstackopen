const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');
const api = supertest(app);

after(async () => {
    await mongoose.connection.close();
});

test('invalid users are not created', async () => {
    const userWithTooShortUsername = {
        "username": "jm",
        "name": "James Madison",
        "password": "jamesmadison123"
    }

    const userWithTooShortPassword = {
        "username": "benjamin-franklin",
        "name": "Benjamin Franklin",
        "password": "bf"
    }

    await api 
        .post('/api/users')
        .send(userWithTooShortUsername)
        .expect(400)

    await api
        .post('/api/users')
        .send(userWithTooShortPassword)
        .expect(400)

})
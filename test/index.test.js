// Unit testing library;
const assert = require('assert');

// Constants
const constants = require('./constants.test');

// Main file
const index = require('../index');

describe('Grafana - Get Source IPs', async () => {
    it('Should pass - Is response array', async () => {
        const ips = await index.getGrafanaSourceIPs();
        assert.strictEqual(Array.isArray(ips), true);
    });

    it('Should pass - Is response array is not empty', async () => {
        const ips = await index.getGrafanaSourceIPs();
        assert.notStrictEqual(ips.length, 0);
    });
});

describe('Responses - Check response formatting', () => {
    it('Should pass - Valid okay response', () => {
        const response = index.returnSuccess();

        assert.strictEqual(response.ok, true);
        assert.strictEqual(response.message, 'Database updated successfully');
    });

    it('Should pass - Valid okay response with custom message', () => {
        const messasge = 'We managed to do something okay';
        const response = index.returnSuccess(messasge);

        assert.strictEqual(response.ok, true);
        assert.strictEqual(response.message, messasge);
    });
});

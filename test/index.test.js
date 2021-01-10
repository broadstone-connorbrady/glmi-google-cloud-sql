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

    it('Should pass - Valid bad response', () => {
        const error = 'An error happened';
        const response = index.returnError(error);

        assert.strictEqual(response.ok, false);
        assert.strictEqual(response.message, error);
    });
});

describe('Filtering out old generated IPs', () => {
    it('Should pass - Filtering out generated IPs', () => {
        const networks = [
            {
                value: '102.202.418.20',
                name: 'A VPN',
                kind: 'sql#aclEntry',
                expirationTime: '2022-10-02T15:01:23Z'
            },
            {
                value: '35.227.45.117',
                name: 'grafana-auto-35.227.45.117',
                kind: 'sql#aclEntry'
            },
            {
                value: '34.83.215.95',
                name: 'grafana-auto-34.83.215.95',
                kind: 'sql#aclEntry'
            }];

        const nonGeneratedIpsOnly = index.filterOldGrafanaSourceIps(networks);

        assert.strictEqual(nonGeneratedIpsOnly.length, 1);
    });
});

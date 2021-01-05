// Unit testing library;
const assert = require('assert');

// Constants
const constants = require('constants.test');

// Main file
const index = require('../index');

describe('Grafana - Get Source IPs', async () => {
    const ips = await index.getGrafanaSourceIPs();

    console.log(ips);
})
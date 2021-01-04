const {google} = require('googleapis');
const axios = require('axios');
const constants = require('./constants');

const auth = new google.auth.GoogleAuth({
    keyFile: 'keyfile.json',
    scopes: constants.SCOPES
});

exports.updateAuthorizedNetworks = async (req, res) => {
    const authClient = await auth.getClient();

    const sqlAdmin = await google.sqladmin({
        version: 'v1beta4',
        project: constants.PROJECT_ID,
        auth: authClient
    })

    const instance = sqlAdmin

    const ips = await this.getGrafanaSourceIPS();
}

exports.getGrafanaSourceIPS = () => {
    return new Promise(function(resolve, reject) {
        axios.get(constants.URL_GRAFANA_SOURCE_IPS)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    });
}
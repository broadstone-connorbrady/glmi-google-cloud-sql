const {google} = require('googleapis');
const axios = require('axios');
const constants = require('./constants');

const auth = new google.auth.GoogleAuth({
    keyFile: 'keyfile.json',
    scopes: constants.SCOPES
});

exports.updateAuthorizedNetworks = async (req, res) => {

    const ips = await this.getGrafanaSourceIPS();
    console.log(ips);

    res.send({"Status": "Work2s"})
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
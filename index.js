const {google} = require('googleapis');
const constants = require('./constants');

const auth = new google.auth.GoogleAuth({
    keyFile: 'keyfile.json',
    scopes: constants.SCOPES
});

exports.updateAuthorizedNetworks = async (req, res) => {


    res.send({ "Status": "Work2s" })
}

exports.getGrafanaSourceIPS = async () => {
    
}
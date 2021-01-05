const {google} = require('googleapis');
const axios = require('axios');
const constants = require('./constants');

const auth = new google.auth.GoogleAuth({
    keyFile: 'keyfile.json',
    scopes: constants.SCOPES,
});

exports.updateAuthorizedNetworks = async (req, res) => {
    const authClient = await auth.getClient();

    const sqlAdmin = await google.sqladmin({
        version: 'v1beta4',
        project: constants.PROJECT_ID,
        auth: authClient
    })

    const instances = await sqlAdmin.instances.list({
        project: constants.PROJECT_ID
    });

    for (const instance of instances.data.items) {
        const authorizedNetworks = instance.settings.ipConfiguration.authorizedNetworks;
        const authorizedNetworksToUpdate = [];

        // Add any existing authorized networks to the array to update
        for(const authorizedNetwork of authorizedNetworks) {
            if(!authorizedNetwork.name.includes(constants.NAME_PREFIX)) authorizedNetworksToUpdate.push(authorizedNetwork);
        }

        console.log(authorizedNetworks);
        console.log(authorizedNetworksToUpdate);
    }

   // const ips = await this.getGrafanaSourceIPS();

    // TODO
    // Loop through all authorized IPS
        // Remove any GRAFANA-AUTO-<IP>


    // For each Grafana IPs
        // Add IP GRAFANA-AUTO-<IP>

    return res.send({ status: "ok" })
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
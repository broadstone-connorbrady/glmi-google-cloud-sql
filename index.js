const {google} = require('googleapis');
const axios = require('axios');
const constants = require('./constants');

const auth = new google.auth.GoogleAuth({
    keyFile: 'keyfile.json',
    scopes: constants.SCOPES,
});

exports.filterOldGrafanaSourceIps = (array) => {
    const authorizedNetworksToReturn = [];

    // Add any existing authorized networks to the array to update
    for(const authorizedNetwork of array) {
        if(!authorizedNetwork.name.includes(constants.NAME_PREFIX)) authorizedNetworksToReturn.push(authorizedNetwork);
    }

    return authorizedNetworksToReturn;
};

exports.addNewGrafanaSourceIps = (authorizedNetworksToUpdate, grafanaSourceIPs) => {
    for(const ip of grafanaSourceIPs) {
        authorizedNetworksToUpdate.push({
            value: ip,
            name: constants.NAME_PREFIX + ip,
            kind: 'sql#aclEntry', // This is always set to this,
        })
    }

    return authorizedNetworksToUpdate;
};

exports.updateAuthorizedNetworks = async (req, res) => {
    const authClient = await auth.getClient();

    const sqlAdmin = await google.sqladmin({
        version: 'v1beta4',
        project: constants.PROJECT_ID,
        auth: authClient
    });

    const instances = await sqlAdmin.instances.list({
        project: constants.PROJECT_ID
    });

    const grafanaSourceIPs = await this.getGrafanaSourceIPs();

    for (const instance of instances.data.items) {
        const name = instance.name;

        const authorizedNetworks = instance.settings.ipConfiguration.authorizedNetworks;

        // Remove any old Grafana source IPs from the current database instance
        let authorizedNetworksToUpdate = this.filterOldGrafanaSourceIps(authorizedNetworks);

        // Add the Grafana source IPs
        authorizedNetworksToUpdate = this.addNewGrafanaSourceIps(authorizedNetworksToUpdate, grafanaSourceIPs)

        console.log(authorizedNetworksToUpdate);
        return;



        try {
            const updateResult = await sqlAdmin.instances.patch({
                project: constants.PROJECT_ID,
                instance: name,
                requestBody: {
                    settings: {
                        ipConfiguration: {
                            authorizedNetworks: authorizedNetworksToUpdate
                        }
                    }
                }
            });
        } catch (error) {
            return res.send(this.returnError(error.message), 500)
        }
    }

    return res.send(this.returnSuccess(), 200)
};

exports.getGrafanaSourceIPs = () => {
    return new Promise(function(resolve, reject) {
        axios.get(constants.URL_GRAFANA_SOURCE_IPS)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    });
};

exports.returnError = (error) => {
    return {
        'ok': false,
        'message': error
    }
};

exports.returnSuccess = (message = 'Database updated successfully') => {
    return {
        'ok': true,
        'message': message
    }
};

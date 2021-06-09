const {google} = require('googleapis');
const axios = require('axios');
const constants = require('./constants');

const auth = new google.auth.GoogleAuth({
    keyFile: 'keyfile.json',
    scopes: constants.SCOPES,
});

/* istanbul ignore next */
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

    let grafanaSourceIPs = [];

    try {
        grafanaSourceIPs = await this.getGrafanaSourceIPs();
    } catch (error) {
        return res.send(this.returnError(error.message), 500)
    }


    for (const instance of instances.data.items) {
        const name = instance.name;
        
        if(!constants.DATABASE_INSTANCES.includes(name)) continue;

        const authorizedNetworks = instance.settings.ipConfiguration.authorizedNetworks;

        // Remove any old Grafana source IPs from the current database instance
        let authorizedNetworksToUpdate = this.filterOldGrafanaSourceIps(authorizedNetworks);

        // Add the Grafana source IPs
        authorizedNetworksToUpdate = this.addNewGrafanaSourceIps(authorizedNetworksToUpdate, grafanaSourceIPs)

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
                reject(error.message);
            });
    });
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

exports.filterOldGrafanaSourceIps = (array) => {
    const authorizedNetworksToReturn = [];

    // Add any existing authorized networks to the array to update
    for(const authorizedNetwork of array) {
        if(!authorizedNetwork.name.includes(constants.NAME_PREFIX)) authorizedNetworksToReturn.push(authorizedNetwork);
    }

    return authorizedNetworksToReturn;
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

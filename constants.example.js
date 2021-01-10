module.exports = Object.freeze({
    // DO NOT CHANGE - Access is needed to update your database instances
    SCOPES: [
        'https://www.googleapis.com/auth/cloud-platform',
        'https://www.googleapis.com/auth/sqlservice.admin'
    ],

    // DO NOT CHANGE (Unless needed) - URL To get Grafana's source IPs
    URL_GRAFANA_SOURCE_IPS: 'https://grafana.com/api/hosted-grafana/source-ips',

    // CHANGE - Set your GCP project ID here
    PROJECT_ID: 'a-gcp-project',

    // CHANGE - What databases to you want this function to run for
    DATABASE_INSTANCES: [
        'add-your-databases-here'
    ],

    // CHANGE - This will prefix the name of the Autorized Network
    NAME_PREFIX: 'grafana-auto-',
});

# Grafana Let Me In (Google Cloud SQL)

This repository contains a Google Cloud Platform specific Cloud Function in order to add the current source IPs for Grafana to a database's authorised networks. However, feel free to use this and adapt it for your needs.

## Why is this needed?

If you're sensible and don't expose your resources to the internet, then you'll be familiar with having to whitelist IPs. Whitelisting a single IP is great. However if these IPs constantly change, then whitelisting a range can be scary. Most vulnerability scanners will use preemptable cloud resources so you could end up with a scanner whitelisted for your database.

This function simply gets the current source IPs from Grafana and updates any running database instances.

**TL;DR**: Whitelist Grafana source IPs with your Cloud SQL database.

## Getting Started

 1. Clone, copy, do what you want to get this uploaded into a cloud function
 2. Rename `constants.example.js` to `constants.js`
 3. Updated any fields in `constants.js`
 4. Add your GCP service account in the same directory under the name `keyfile.json` (Please keep this file safe)
 5. Trigger your cloud function and enjoy

## Support

Post an issue and I will try to get around to fixing it as soon as possible.

## License

The license for this repository can be found in `LICENSE.txt`

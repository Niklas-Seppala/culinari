# Culinari

The REST backend for the Culinari recipe sharing web application.

## Installation

### Local development
* Clone this repository
* Generate the required keys and a certificate

```
$ openssl genrsa -out ssl-key.pem 2048
$ openssl req -new -key ssl-key.pem -out certrequest.csr
$ openssl x509 -req -in certrequest.csr -signkey ssl-key.pem -out ssl-cert.pem
```
* Run `npm install`
* Create an empty database and a user for it
* Fill the `.env` configuration file with the required information ([a template can be found](.env.template))
* Run `npm run clear-and-initialize-database` to initialize the database
* Run `node app.js`

### Production server
* install OpenSSL if you haven't already done so on your server
* Generate keys the necessary keys and the certificates
```
$ openssl genrsa -out ca.key 2048
$ openssl req -new -key ca.key -out ca.sr
$ openssl x509 -req -days 365 -in ca.csr -signkey ca.key -out ca.crt
```

* Copy the files to their appropriate locations
```
cp ca.crt /etc/pki/tls/certs
cp ca.key /etc/pki/tls/private/ca.key
cp ca.csr /etc/pki/tls/private/ca.csr
```

* set up the necessary configuration files for Apache (depending on the OS your server is running these might go somewhere else than listed here)

##### /etc/httpd/conf.d/node.conf
```
<VirtualHost *:80>
  ProxyPreserveHost On

  # the reverse proxy configuration.
  # the port can be almost any port, but it needs to match with the HTTP_PORT value in your .env file
  # the url part can be practically anything as long as it matches with the PROXY_PASS value in your .env file
  ProxyPass /culinari/ http://127.0.0.1:3000/
  ProxyPassReverse /culinari/ http://127.0.0.1:3000/
</VirtualHost>
```

##### /etc/httpd/conf.d/https-node.conf
```
<VirtualHost *:443>
    ServerName # server name
    SSLEngine on

    # the locations of your certificate and key files
    SSLCertificateFile # e.g. /etc/pki/tls/certs/ca.crt
    SSLCertificateKeyFile # e.g. /etc/pki/tls/private/ca.key
    SSLProxyCACertificateFile # e.g. /etc/pki/tls/certs/ca.crt

    SSLProxyEngine on
    SSLProxyCheckPeerCN off
    SSLProxyCheckPeerName off
    ProxyPreserveHost On
    RequestHeader set X-Forwarded-Proto https

    # the reverse proxy configuration.
    # the port can be almost any port, but it needs to match with the HTTP_PORT value in your .env file
    # the url part can be practically anything as long as it matches with the PROXY_PASS value in your .env file
    ProxyPass /culinari/ http://127.0.0.1:3000/
    ProxyPassReverse /culinari/ http://127.0.0.1:3000/
</VirtualHost>
```

* Go back to the root of your Culinari repository
* Run `npm install` to install your application
* Run `npm run clear-and-initialize-database` to initialize the database
* Run `node app.js` to run the backend
* After the initial setup is done, you can daemonize it
* Don't forget to change the admin profile's password after you've succesfully logged in

Culinari's backend should work with most daemon managers compatible with node. We recommend using [PM2](https://pm2.keymetrics.io/)
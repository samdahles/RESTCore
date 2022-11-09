<div align="center">

[![CodeFactor](https://www.codefactor.io/repository/github/samdahles/restcore/badge)](https://www.codefactor.io/repository/github/samdahles/restcore)
![Known Vulnerabilities](https://snyk.io/test/github/samdahles/RESTCore/badge.svg)
<h1>RESTCore</h3>
A minimalistic RESTful framework.
</div>

## Installation

### Step 1
Clone the repository.
```bash
git clone https://github.com/samdahles/RESTCore
```

### Step 2
Install all dependencies.
```bash
npm i
```

### Step 3 (optional)
To enable HTTPS, please save a valid SSL certificate and key as `./ssl/https.crt` and `./ssl/https.key` respectively.

However, if you do not have a SSL certificate but you would still like to explore the HTTPS possibilities; you can generate a self-signed certificate with the following command. However, I would really recommend that you get a certificated by a trusted third-party certificate authority.
```bash
openssl req -x509 -newkey rsa:4096 -keyout "./ssl/https.key" -out "./ssl/https.crt" -sha256 -days 365
```

## Usage
I am planning on making a detailed documentation for this framework. 
However, I wrote everything in plain JavaScript, so the next update will contain the transformation to typescript, as well as the addition of framework documentation.


## Contributing

Pull requests are more than welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

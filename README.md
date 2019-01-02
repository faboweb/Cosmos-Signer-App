# Cosmos Signer App POC

> An app to store keys and sign transactions for the cosmos eco system

## POC walkthrough

### Start the signer app

``` bash
cd ..
cd cosmos-signer-nsv
yarn
npm install -g nativescript
tns run <platform> --bundle
```

### Install Voyager and start it

``` bash
cd ..
git clone https://github.com/cosmos/voyager.git
cd voyager
git checkout fabo/signer-app
yarn
yarn build:gaia
yarn build:local
yarn start local-testnet
```

### Copy key from console

Look in the console output for `"seed":` and copy the seed for `main-account`.

### Import key in signer app

- Manage Keys
- Import Key

### Send tokens to yourself in Voyager

- Wallet
- Send Localcoins to yourself
- Use `Cosmos Signer App` signing method

### Store the QR code (i.e. do a photo of the QR code) on your phone

### Import SSL certificate in Android emulator

- follow https://medium.com/@noumaan/ssl-app-dev-a2923d5113c6
- use / drag and drop `ssl/server_dev.cert` into emulator

### Start Backend with HTTPS

- Close Voyager

``` bash
yarn backend:fixed-https
```

### Send transaction via signer app using the QR Code

(in signer app)

- Sign
- Scan QR Code (enable camera in emulator settings and then use the photo from your phone)
- Approve
- Enter password

### DONE
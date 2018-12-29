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

### Create a key

- Manage Keys
- Add Keys
...
- Click on seed to copy it -> store some place
- Manage Keys
- Click on address to copy it -> store some place 

### Install Voyager and send coins to the address you created

``` bash
cd ..
git clone https://github.com/cosmos/voyager.git
cd voyager
git checkout fabo/signer-app
yarn
yarn build:gaia
yarn build:local
```

### Import key in Voyager

- Sign out
- Import account
...

### Use Signer App branch of Voyager (HACKY)

``` bash
git checkout fabo/signer-app
```

### Start Voyager and do a transaction for your created address (i.e. send coins to yourself)

``` bash
yarn start local-testnet
```

- Sign in to address created with Signer App
- Wallet
- Send Localcoins to yourself

### Store the QR code (i.e. do a photo of the QR code)

### Import SSL certificate in Android emulator

- follow https://medium.com/@noumaan/ssl-app-dev-a2923d5113c6
- use / drag and drop `ssl/server_dev.cert` into emulator

### Start Backend with HTTPS

- Close Voyager

``` bash
yarn backend:fixed-https
```

### Send transaction via signer app using the QR Code

- Sign
- Scan QR Code
- Approve
- Enter password

### DONE
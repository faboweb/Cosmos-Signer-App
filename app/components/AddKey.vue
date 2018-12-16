<template>
    <Page>
        <ActionBar title="Add Key"/>
        <StackLayout>
            <Label>Key Name</Label>
            <TextField v-model="name" required/>
            <Label>Password</Label>
            <TextField type="password" v-model="password" required />
            <Button @tap="addKey()">ADD KEY</Button>
            <TextView v-if="error" v-model="error" editable="false" />
        </StackLayout>
    </Page>
</template>

<script>
// require the plugin
import { SecureStorage } from "nativescript-secure-storage";
// instantiate the plugin
let secureStorage = new SecureStorage();
let AES = require("crypto-js/aes");

// import {getCrypto} from "irisnet-crypto"
import { generateWallet } from "./wallet.js";
import DisplaySeed from "./DisplaySeed";
import { NSCrypto } from "nativescript-crypto";
export default {
  data() {
    return {
      keys: [],
      password: null,
      name: null,
      error: null
    };
  },
  methods: {
    async storeKeyNames(keys) {
      // async
      let success = await secureStorage.set({
        key: "keys",
        value: JSON.stringify(keys)
      });
    },
    async storeKey(key, name, password) {
      // TODO encrypt
      var ciphertext = AES.encrypt(JSON.stringify(key), password).toString();
      let success = await secureStorage.set({
        key: "key_" + name,
        value: ciphertext
      });
    },
    async load() {
      let keys = await secureStorage.get({
        key: "keys"
      });
      this.keys = keys ? JSON.parse(keys) : [];
    },
    async addKey() {
      console.log("keys", this.keys);
      if (!this.name || !this.password) {
        this.error = "You need to specify a name and password";
        return;
      }
      if (this.keys.find(key => key.name === this.name)) {
        this.error = "Key with that name already exists";
        return;
      }
      try {
        const crypto = new NSCrypto();
        const wallet = generateWallet(crypto.secureRandomBytes);

        this.keys.push({
          name: this.name,
          address: wallet.cosmosAddress
        });
        this.storeKeyNames(this.keys);
        console.log(this.keys);
        this.storeKey(wallet, this.name, this.password);

        this.goToSeedDisplay(wallet.mnemonic);
      } catch (err) {
        this.error = err;
      }
    },
    goToSeedDisplay(seed) {
      this.$navigateTo(DisplaySeed, { props: { seed } });
    }
  },
  mounted() {
    this.load();
  }
};
</script>

<style scoped>
ActionBar {
  background-color: #53ba82;
  color: #ffffff;
}

.message {
  vertical-align: center;
  text-align: center;
  font-size: 20;
  color: #333333;
}
</style>

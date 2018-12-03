<template>
    <Page>
        <ActionBar title="Import Key"/>
        <StackLayout>
            <Label>Key Name</Label>
            <TextField v-model="name" required/>
            <Label>Password</Label>
            <TextField type="password" v-model="password" required />
            <Label>Seed</Label>
            <TextField v-model="seed" required />
            <Button @tap="addKey()">ADD KEY</Button>
            <TextField v-if="error" v-model="error" disabled="disabled" />
        </StackLayout>
    </Page>
</template>

<script>
// require the plugin
import { SecureStorage } from "nativescript-secure-storage";
// instantiate the plugin
let secureStorage = new SecureStorage();
// import {getCrypto} from "irisnet-crypto"
import { generateWalletFromSeed } from "./wallet.js";
import DisplaySeed from "./DisplaySeed";
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
      let success = await secureStorage.set({
        key: "key_" + name,
        value: JSON.stringify(key)
      });
    },
    async load() {
      let keys = await secureStorage.get({
        key: "keys"
      });
      this.keys = keys ? JSON.parse(keys) : [];
    },
    async addKey() {
      if (!this.name || !this.password || !this.seed) {
        this.error = "You need to specify a name and password and the seed";
        return;
      }
      if (this.keys.find(key => key.name === name)) {
        this.error = "Key with that name already exists";
        return;
      }
      try {
        this.keys.push({
          name: this.name,
          address: wallet.cosmosAddress
        });
        this.storeKeyNames(this.keys);
        console.log(this.keys);
        this.storeKey(wallet, this.name, this.password);

        this.goToSeedDisplay(seed);
      } catch (err) {
        this.error = err;
      }
    },
    goToSeedDisplay(seed) {
      this.$navigateTo(DisplaySeed);
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

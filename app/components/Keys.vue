<template>
    <Page>
        <ActionBar title="Keys"/>
        <StackLayout>
            <Button height="120" @tap="goToAddKey()">ADD KEY</Button>
            <Button height="120" @tap="">IMPORT KEY</Button>
            <ListView for="key in keys" @itemTap="">
                <v-template>
                    <FlexboxLayout>
                      <StackLayout>
                        <Label :text="key.name" />  
                        <Label :text="key.address" flexShrink="1" />  
                      </StackLayout>
                      <Button width="20%" @tap="deleteKey(key.name)">Delete</Button>
                    </FlexboxLayout>
                </v-template>
            </ListView>
        </StackLayout>
    </Page>
</template>

<script>
// require the plugin
import { SecureStorage } from "nativescript-secure-storage";
// instantiate the plugin
let secureStorage = new SecureStorage();
let AES = require("crypto-js/aes");
let CryptoJS = require("crypto-js");
var dialogs = require("tns-core-modules/ui/dialogs");
import { generateWallet } from "./wallet.js";
import AddKey from "./AddKey";
export default {
  data() {
    return {
      keys: []
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
    async load() {
      let keys = await secureStorage.get({
        key: "keys"
      });

      this.keys = keys ? JSON.parse(keys) : [];
      console.log("keys", this.keys);
    },
    async addKey(name, password) {
      const { privateKey, publicKey, cosmosAddress } = await generateWallet();
      const wallet = await generateWallet();

      this.keys.push({
        name,
        address: wallet.address
      });
      this.storeKeyNames(this.keys);
      this.storeKey(wallet, name, password);
    },
    goToAddKey() {
      this.$navigateTo(AddKey);
    },
    async deleteKey(name) {
      const { password } = await dialogs.login(
        "Please unlock your key to delete it",
        name
      );

      const key = await secureStorage.get({
        key: "key_" + name
      });
      var bytes = AES.decrypt(key, password);
      try {
        var originalText = bytes.toString(CryptoJS.enc.Utf8);
        // parsing should fail if not the correct password
        JSON.parse(originalText);
      } catch (err) {
        dialogs.alert(
          "The password you entered to unlock the key wasn't correct."
        );
        return;
      }

      secureStorage.remove({
        key: "key_" + name
      });
      this.keys = this.keys.filter(key => key.name !== name);
      this.storeKeyNames(this.keys);
    }
  },
  mounted() {
    this.load();
    console.log(this.keys);
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

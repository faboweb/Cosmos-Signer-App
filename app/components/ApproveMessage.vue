<template>
    <Page>
        <ActionBar title="Approve Message"/>
        <StackLayout>
            <TextView class="message" height="500" :text="message" editable="false" />
            <Button height="120" @tap="sign()">SIGN MESSAGE</Button>
            <Button height="120" @tap="goToStart()">ABORT</Button>
        </StackLayout>
    </Page>
</template>

<script>
import { BarcodeScanner } from "nativescript-barcodescanner";
let barcodescanner = new BarcodeScanner();
// require the plugin
import { SecureStorage } from "nativescript-secure-storage";
// instantiate the plugin
let secureStorage = new SecureStorage();
import AES from "crypto-js/aes";
import CryptoJS from "crypto-js";
var dialogs = require("tns-core-modules/ui/dialogs");
import App from "./App.vue";
import Sending from "./Sending.vue";
import { sign } from "./wallet.js";
export default {
  computed: {
    message() {
      return JSON.stringify(this.tx, null, 2);
    }
  },
  methods: {
    async sign() {
      try {
        console.log(JSON.stringify(this.keys), this.address, this.tx);
        let key = this.keys.find(({ address }) => this.address === address);
        if (!key) {
          throw Error(
            "Address for this transaction not stored on this device."
          );
        }

        const { password } = await dialogs.login(
          "Please unlock the key",
          key.name
        );

        let wallet = await this.loadKey(key.name, password);

        const signature = sign(this.tx, wallet, this.requestMetaData);
        console.log(signature);

        this.goToSending(signature);
      } catch (err) {
        dialogs.alert(err);
      }
    },
    async loadKey(name, password) {
      let key = await secureStorage.get({
        key: "key_" + name
      });

      // Decrypt
      var bytes = AES.decrypt(key, password);
      var originalText = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(originalText);
    },
    async loadKeyNames() {
      let keys = await secureStorage.get({
        key: "keys"
      });
      this.keys = keys ? JSON.parse(keys) : [];
    },
    goToSending(signature) {
      this.$navigateTo(Sending, {
        props: {
          tx: this.tx,
          signature,
          endpoint: this.endpoint
        }
      });
    },
    goToStart() {
      this.$navigateTo(App);
    }
  },
  props: {
    tx: Object,
    endpoint: String,
    address: String,
    requestMetaData: Object
  },
  mounted() {
    this.loadKeyNames();
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
  text-align: left;
  font-size: 20;
  color: #333333;
}
</style>

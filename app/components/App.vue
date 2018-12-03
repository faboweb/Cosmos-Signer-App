<template>
    <Page>
        <ActionBar title="Welcome to NativeScript-Vue!"/>
        <StackLayout>
            <TextView class="message" height="120" :text="msg" />
            <Button height="120" @tap="scan()">SIGN</Button>
            <Button height="120" @tap="goToKeysPage()">MANAGE KEYS</Button>
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
import Keys from "./Keys.vue";
import { sign } from "./wallet.js";
import ApproveMessageVue from "./ApproveMessage.vue";
export default {
  data() {
    return {
      msg: "Hello World!"
    };
  },
  methods: {
    increase() {
      this.msg += "!";
    },
    async scan() {
      await barcodescanner.hasCameraPermission();
      // let result = await barcodescanner.scan({
      //   formats: "QR_CODE,PDF_417", // Pass in of you want to restrict scanning to certain types
      //   cancelLabel: "EXIT. Also, try the volume buttons!", // iOS only, default 'Close'
      //   cancelLabelBackgroundColor: "#333333", // iOS only, default '#000000' (black)
      //   message: "Use the volume buttons for extra light", // Android only, default is 'Place a barcode inside the viewfinder rectangle to scan it.'
      //   showFlipCameraButton: true, // default false
      //   preferFrontCamera: false, // default false
      //   showTorchButton: true, // default false
      //   beepOnScan: true, // Play or Suppress beep on scan (default true)
      //   torchOn: false, // launch with the flashlight on (default false)
      //   closeCallback: function() {
      //     console.log("Scanner closed");
      //   }, // invoked when the scanner was closed (success or abort)
      //   resultDisplayDuration: 500, // Android only, default 1500 (ms), set to 0 to disable echoing the scanned text
      //   orientation: "landscape", // Android only, optionally lock the orientation to either "portrait" or "landscape"
      //   openSettingsIfPermissionWasPreviouslyDenied: true // On iOS you can send the user to the settings app if access was previously denied
      // });
      var message;
      var parts = {};
      await barcodescanner.scan({
        formats: "QR_CODE",
        orientation: "portrait",
        // this callback will be invoked for every unique scan in realtime!
        continuousScanCallback: function(result) {
          console.log("result", result.text);
          const part = JSON.parse(result.text);
          if (message.type === "single") {
            message = JSON.parse(part.payload);
            barcodescanner.stop();
          }

          if (message.type === "multi") {
            parts[part.part] = part.tx;
          }
          console.log("parts", Object.keys(parts));
          if (Object.keys(parts).length === part.parts) {
            console.log("parts", parts);
            let stitchedTx = Object.keys(parts)
              .sort()
              .reduce((sum, cur) => {
                return sum + parts[cur];
              }, "");
            console.log("stitchedTx", stitchedTx);
            message = JSON.parse(stitchedTx);
            console.log("tx", message.tx);

            barcodescanner.stop();
          }
        },
        closeCallback: function() {
          console.log("Scanner closed");
        }, // invoked when the scanner was closed
        reportDuplicates: false // which is the default
      });
      let result = {
        text: JSON.stringify({
          consumer: "cosmos-signer",
          type: "single",
          endpoint: "https://10.0.2.2:9070/tx/broadcast",
          address:
            "cosmos1vcurycmpx33rgd3exfskgdt9v43kydn9vcurgef4xyunqe35xqcngvesxgergvfnzdz2z6",
          requestMetaData: {
            sequence: "0",
            account_number: "1",
            chain_id: "local-testnet"
          },
          tx: {
            fee: { amount: [{ amount: "0", denom: "" }], gas: "200000" },
            memo: "",
            msg: [
              {
                type: "cosmos-sdk/Send",
                value: {
                  inputs: [
                    {
                      address:
                        "cosmos1vcurycmpx33rgd3exfskgdt9v43kydn9vcurgef4xyunqe35xqcngvesxgergvfnzdz2z6",
                      coins: [{ amount: "10", denom: "localcoin" }]
                    }
                  ],
                  outputs: [
                    {
                      address: "cosmos1ehev36xzn994a5kc5leak83ztz2n97n99nekug",
                      coins: [{ amount: "10", denom: "localcoin" }]
                    }
                  ]
                }
              }
            ],
            signatures: null
          }
        })
      };
      try {
        const payload = JSON.parse(result.text);
        console.log(payload);
        this.$navigateTo(ApproveMessageVue, {
          props: {
            tx: payload.tx,
            endpoint: payload.endpoint,
            address: payload.address,
            requestMetaData: payload.requestMetaData
          }
        });
      } catch (err) {
        console.error(err);
      }
    },
    goToKeysPage() {
      this.$navigateTo(Keys);
    }
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

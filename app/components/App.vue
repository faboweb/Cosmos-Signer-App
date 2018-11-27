<template>
    <Page>
        <ActionBar title="Welcome to NativeScript-Vue!"/>
        <StackLayout>
            <Label class="message" height="120" :text="msg" />
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
    import Keys from "./Keys.vue"
  export default {
    data() {
      return {
        msg: 'Hello World!'
      }
    },
    methods: {
        increase() {
            this.msg += "!"
        },
        async scan() {
            await barcodescanner.hasCameraPermission();
            let result = await barcodescanner.scan({
                formats: "QR_CODE,PDF_417",   // Pass in of you want to restrict scanning to certain types
                cancelLabel: "EXIT. Also, try the volume buttons!", // iOS only, default 'Close'
                cancelLabelBackgroundColor: "#333333", // iOS only, default '#000000' (black)
                message: "Use the volume buttons for extra light", // Android only, default is 'Place a barcode inside the viewfinder rectangle to scan it.'
                showFlipCameraButton: true,   // default false
                preferFrontCamera: false,     // default false
                showTorchButton: true,        // default false
                beepOnScan: true,             // Play or Suppress beep on scan (default true)
                torchOn: false,               // launch with the flashlight on (default false)
                closeCallback: function () { console.log("Scanner closed"); }, // invoked when the scanner was closed (success or abort)
                resultDisplayDuration: 500,   // Android only, default 1500 (ms), set to 0 to disable echoing the scanned text
                orientation: "landscape",     // Android only, optionally lock the orientation to either "portrait" or "landscape"
                openSettingsIfPermissionWasPreviouslyDenied: true // On iOS you can send the user to the settings app if access was previously denied
            })
            this.msg = JSON.stringify(result)
            this.store(result.text)
        },
        async store(msg) {
            // async
            let success = await secureStorage.set({
                key: "scan",
                value: `I scanned ${msg} set at ${new Date()}`
            })
        },
        async load() {
            let msg = await secureStorage.get({
                key: "scan"
            })
            this.msg = msg
        },
        goToKeysPage() {
            this.$navigateTo(Keys);
        }
    },
    mounted() {
        this.load()
    }
  }
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

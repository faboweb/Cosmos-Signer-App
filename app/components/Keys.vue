<template>
    <Page>
        <ActionBar title="Keys"/>
        <StackLayout>
            <Button height="120" @tap="addKey('default', '1234567890')">ADD KEY</Button>
            <Button height="120" @tap="">IMPORT KEY</Button>
            <ListView for="key in keys" @itemTap="">
                <v-template>
                    <!-- Shows the list item label in the default color and style. -->
                    <Label :text="key.name" />
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
    // import {getCrypto} from "irisnet-crypto"
    import fundraiser from "cosmos-fundraiser"
  export default {
    data() {
      return {
        keys: []
      }
    },
    methods: {
        async storeKeyNames(keys) {
            // async
            let success = await secureStorage.set({
                key: "keys",
                value: JSON.stringify(keys)
            })
        },
        async storeKey(keyPair, name, password) {
            // TODO encrypt
            let success = await secureStorage.set({
                key: "key_" + name,
                value: JSON.stringify(keyPair)
            })
        },
        async load() {
            let keys = await secureStorage.get({
                key: "keys"
            })
            this.keys = keys
        },
        addKey(name, password) {
            // let Crypto = getCrypto("iris") // only "iris" and "ethereum" work
            // const keyPair = Crypto.create()
            // this.keys.push({
            //     name,
            //     address: keyPair.address,
            //     publicKey: keyPair.publicKey,
            // })
            // this.storeKeyNames(this.keys)
            // this.storeKey(keyPair, name, password)
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

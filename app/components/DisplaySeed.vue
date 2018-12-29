<template>
    <Page>
        <ActionBar title="Secure Seed"/>
        <StackLayout>
            <Label>Seed</Label>
            <TextView v-model="seed" editable="false" @tap="copy(seed)"/>
            <Button @tap="goToStart()">I wrote down my seed</Button>
        </StackLayout>
    </Page>
</template>

<script>
var clipboard = require("nativescript-clipboard");
var dialogs = require("tns-core-modules/ui/dialogs");
import App from "./App";
export default {
  methods: {
    goToStart(seed) {
      this.$navigateTo(App);
    },
    async copy(value) {
      await clipboard.setText(value);
      dialogs.alert("Copied the seed to the clipboard.");
    }
  },
  props: {
    seed: String
  }
};
</script>

<style scoped>
</style>

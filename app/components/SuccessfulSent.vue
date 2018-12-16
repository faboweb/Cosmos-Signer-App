<template>
    <Page>
        <ActionBar title="Transaction Successful"/>
        <StackLayout>
            <Label>Delivery Information</Label>
            <TextView v-model="responseText" editable="false" />
            <Button @tap="goToStart()">To Home</Button>
        </StackLayout>
    </Page>
</template>

<script>
import App from "./App";
let CryptoJS = require("crypto-js");
export default {
  computed: {
    responseText() {
      let copy = JSON.parse(JSON.stringify(this.response));

      function decodeTags(tags) {
        return tags.map(tag => ({
          key: Buffer.from(tag.key, "base64").toString("utf8"),
          value: Buffer.from(tag.value, "base64").toString("utf8")
        }));
      }
      copy.deliver_tx.tags = decodeTags(copy.deliver_tx.tags);
      copy.check_tx.tags = decodeTags(copy.check_tx.tags);

      return JSON.stringify(copy, null, 2);
    }
  },
  methods: {
    goToStart(seed) {
      this.$navigateTo(App);
    }
  },
  props: {
    response: Object
  }
};
</script>

<style scoped>
</style>

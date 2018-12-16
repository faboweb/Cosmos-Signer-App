<template>
    <Page>
        <ActionBar title="Sending Message"/>
        <StackLayout>
            <TextView class="message" height="120" :text="message" />
            <Button height="120" @tap="goToStart()">SIGN OTHER MESSAGE</Button>
        </StackLayout>
    </Page>
</template>

<script>
import App from "./App.vue";
import SuccessfulSent from "./SuccessfulSent.vue";
import { createSignedTx, createBroadcastBody } from "./wallet.js";
import * as Https from "nativescript-https";
const httpModule = require("http");
import * as app from "application";
export default {
  data: () => ({
    message: "Sending message ..."
  }),
  methods: {
    async send(tx, endpoint, signature) {
      try {
        let url = endpoint;
        if (TNS_ENV === "development" && app.android) {
          url = url.replace("localhost", "10.0.2.2");
        }
        try {
          let signedTx = createSignedTx(tx, signature);
          let content = createBroadcastBody(signedTx);

          console.log("content", content);
          console.log("endpoint", url);
          await httpModule
            .request({
              url,
              method: "POST",
              content
            })
            .then(res => {
              let content;
              try {
                content = res.content.toJSON();
              } catch (err) {
                content = res.content.toString();
              }
              console.log("res", res.statusCode, content);
              if (res.statusCode === 200) {
                this.message = "Send successfull";
                this.$navigateTo(SuccessfulSent, {
                  props: {
                    response: content
                  }
                });
                return;
              }
              this.message = "Sending failed: " + content;
            })
            .catch(err => {
              console.error(err);
              this.message = "Sending failed: " + err;
            });
        } catch (err) {
          console.error(err);
          this.message = "Sending failed: " + err.message;
        }
      } catch (err) {
        console.error(err);
        this.message = "Sending failed: " + err.message;
      }
    },
    goToStart() {
      this.$navigateTo(App);
    }
  },
  props: {
    tx: Object,
    endpoint: String,
    signature: Object
  },
  mounted() {
    this.send(this.tx, this.endpoint, this.signature);
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

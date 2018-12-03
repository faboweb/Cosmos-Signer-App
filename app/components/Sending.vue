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
export default {
  data: () => ({
    message: "Sending message ..."
  }),
  methods: {
    async send(tx, endpoint, signature) {
      try {
        let signedTx = Object.assign({}, tx, {
          signatures: [signature]
        });
        let body = JSON.stringify({
          tx: signedTx,
          return: "block"
        });

        console.log("body", body);
        console.log("endpoint", endpoint);
        await fetch(endpoint, {
          method: "POST",
          body
        })
          .then(res => {
            if (res.ok) {
              this.message = "Send successfull";
              return;
            }

            this.message = "Sending failed: " + res.status;
            console.log("res", res);
          })
          .catch(err => {
            this.message = "Sending failed: " + err.message;
          });
      } catch (err) {
        console.error(err);
      }
    },
    goToStart() {
      this.$navigateTo(App);
    }
  },
  props: {
    tx: Object,
    endpoint: String,
    signature: String
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

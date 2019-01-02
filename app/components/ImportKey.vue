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
            <TextView v-if="error" v-model="error" editable="false" />
        </StackLayout>
    </Page>
</template>

<script>
import { loadKeyNames, importKey } from "./keystore.js";
import Keys from "./Keys";
import { alert } from "tns-core-modules/ui/dialogs/dialogs";
export default {
  data() {
    return {
      keys: [],
      password: null,
      name: null,
      error: null,
      seed: null
    };
  },
  methods: {
    async load() {
      let keys = await loadKeyNames();
      this.keys = keys ? JSON.parse(keys) : [];
    },
    async addKey() {
      console.log("AddKey");
      if (!this.name || !this.password || !this.seed) {
        this.error = "You need to specify a name and password and the seed";
        return;
      }
      if (this.keys.find(key => key.name === this.name)) {
        this.error = "Key with that name already exists";
        return;
      }
      try {
        await importKey(this.name, this.password, this.seed);

        this.goToKeys();
      } catch (err) {
        this.error = err;
      }
    },
    goToKeys() {
      this.$navigateTo(Keys);
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

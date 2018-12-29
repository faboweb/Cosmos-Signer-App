<template>
    <Page>
        <ActionBar title="Add Key"/>
        <StackLayout>
            <Label>Key Name</Label>
            <TextField v-model="name" required/>
            <Label>Password</Label>
            <TextField type="password" v-model="password" required />
            <Button @tap="addKey()">ADD KEY</Button>
            <TextView v-if="error" v-model="error" editable="false" />
        </StackLayout>
    </Page>
</template>

<script>
import DisplaySeed from "./DisplaySeed";
import { loadKeyNames, addNewKey } from "./keystore.js";
export default {
  data() {
    return {
      keys: [],
      password: null,
      name: null,
      error: null
    };
  },
  methods: {
    async load() {
      let keys = await loadKeyNames();
      this.keys = keys ? JSON.parse(keys) : [];
    },
    async addKey() {
      if (!this.name || !this.password) {
        this.error = "You need to specify a name and password";
        return;
      }
      if (this.keys.find(key => key.name === this.name)) {
        this.error = "Key with that name already exists";
        return;
      }
      try {
        const { mnemonic } = await addNewKey(this.name, this.password);

        this.goToSeedDisplay(mnemonic);
      } catch (err) {
        this.error = err;
      }
    },
    goToSeedDisplay(seed) {
      this.$navigateTo(DisplaySeed, { props: { seed } });
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

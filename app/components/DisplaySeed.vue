<template>
    <Page>
        <ActionBar title="Secure Seed"/>
        <StackLayout>
            <Label>Seed</Label>
            <TextView v-model="seed" editable="false" />
            <Button @tap="goToStart()">I wrote down my seed</Button>
        </StackLayout>
    </Page>
</template>

<script>
import App from "./App";
export default {
  methods: {
    goToStart(seed) {
      this.$navigateTo(App);
    }
  },
  props: {
    seed: String
  }
};
</script>

<style scoped>
</style>

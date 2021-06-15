<template>
  <form @submit="onSubmit">
    <input
      class="search-bar"
      v-model="channel"
      type="text"
      name="channel"
      placeholder="Enter your twitch name..."
    />
    <input type="submit" value="Submit" class="btn" />
  </form>
</template>

<script>
export default {
  name: "Search",
  props: {
    id: String,
  },
  data() {
    return {
      channel: this.id,
    };
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      if (this.channel.length > 0) {
        this.$router.push("/channel/" + this.channel);
      } else {
        alert("Please enter a channel");
      }
    },
  },
};
</script>

<style scoped>
.search-bar {
  box-sizing: border-box;
  font-family: Inter, sans-serif;
  margin: 8px;
  padding: 8px;
  font-size: 16px;
  height: calc(100% - 16px);
  border-radius: 8px;
  border: 0;
}
.search-bar:focus {
  outline: 0;
}
.btn {
  margin: 8px;
}
</style>

<template>
  <div class="page">
    <transition name="fade">
      <Search />
    </transition>
  </div>
</template>

<script>
// @ is an alias to /src
import Search from "@/components/Search.vue";

export default {
  name: "Home",
  components: {
    Search,
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

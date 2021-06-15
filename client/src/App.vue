<template>
  <router-view />
</template>

<script>
export default {
  name: "App",
  components: {},
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter&display=swap");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Inter, sans-serif;
  background-color: #12141d;
  color: hsla(0, 0%, 100%, 0.5);
  font-size: 16px;
  font-weight: 500;
}

h1,
h2,
h3,
h4,
h5,
h6,
ul,
a {
  color: #fff;
  font-weight: 600;
}

h1,
h2,
h3,
p {
  margin-bottom: 24px;
}

html,
body {
  height: 100%;
}

.page {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#app {
  background-color: #12141d;
  color: hsla(0, 0%, 100%, 0.5);
  height: 100%;
}

.container {
  background-color: hsla(0, 0%, 100%, 0.05);
  border-radius: 8px;
  display: flex;
}

.btn {
  border-radius: 6px;
  background-color: #ff715b;
  padding: 9px 24px;
  box-shadow: inset 0 0 20px 20px transparent;
  transition: box-shadow 0.2s ease;
  font-weight: 600;
  border: 1px solid transparent;
  color: white;
  font-size: 16px;
  font-family: inherit;
}
.btn:focus {
  outline: 0;
}
.btn:hover {
  box-shadow: inset 0 0 20px 20px rgb(0 0 0 / 10%);
}
.btn-block {
  display: block;
  width: 100%;
}

.loader {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #ff715b;
  border-radius: 50%;
  margin: 8px;
  width: 60px;
  height: 60px;
  animation: spin 2s linear infinite;
  position: absolute;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

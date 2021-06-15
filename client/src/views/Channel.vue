<template>
  <div class="page">
    <div class="box">
      <transition name="fade">
        <Search v-if="!loading" :id="$route.params.id" />
      </transition>
      <transition name="fade">
        <div v-if="loading" class="loader"></div>
      </transition>
      <transition name="fade">
        <div v-if="error">{{error}}</div>
      </transition>
      <transition name="fade">
        <div class="container" v-if="channelName">
          <p>
            Channel Name:
            <span>{{channelName}}</span>
          </p>
          <p>
            Follower Count:
            <span>{{followerCount}}</span>
          </p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Search from "@/components/Search.vue";

export default {
  name: "Channel",
  components: {
    Search,
  },
  data() {
    return {
      loading: false,
      channelName: null,
      followerCount: null,
      error: null,
    };
  },
  created() {
    this.fetchData();
  },
  watch: {
    $route: "fetchData",
  },
  methods: {
    fetchData() {
      this.error = this.channelName = this.followerCount = null;
      this.loading = true;
      const fetchedId = this.$route.params.id;

      const URL = "http://localhost:3000/channel/" + fetchedId;
      const options = {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      };
      fetch(URL, options)
        .then((response) => {
          this.loading = false;
          if (!response.ok) {
            throw new Error(response.status);
          }
          return response;
        })
        .then((response) => response.json())
        .then((channel) => {
          this.channelName = channel.name;
          this.followerCount = channel.followers;
        })
        .catch((error) => {
          const messages = {
            400: "Please enter a valid Twitch Channel",
            404: "Could not find the Twitch Channel",
            500: "Oops. Something wrong happening on our server",
          };
          if (messages[error.message]) {
            this.error = messages[error.message];
          } else {
            this.error = "Oops. Something wrong happening on our server";
          }
        });
    },
  },
};
</script>

<style scoped>
.box {
  display: flex;
  flex-flow: column wrap;
  align-items: center;
}
.container {
  margin: 8px;
  padding: 8px;
  flex-flow: row wrap;
  justify-content: space-between;
}

p {
  margin: 8px;
}

span {
  color: white;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const redis_port = process.env.REDIS_PORT || 6379;

app.use(cors());
const redis = require("redis");
const client = redis.createClient(redis_port);

var AccessToken = "";
const getToken = () => {
  const url = process.env.GET_TOKEN;
  const query = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: "client_credentials",
  };
  axios.post(url, null, { params: query }).then(
    (response) => {
      AccessToken = response.data.access_token;
    },
    (error) => {
      console.log(error);
    }
  );
};
getToken();

const getID = (channelName) => {
  const url = process.env.GET_USER_ID;
  const headers = {
    Accept: "application/vnd.twitchtv.v5+json",
    "Client-ID": process.env.CLIENT_ID,
  };
  const params = { login: channelName };
  return axios.get(url, { params: params, headers: headers }).then(
    (response) => {
      if (response.data._total == 0) {
        throw new Error("No name found");
      }
      const id = response.data.users[0]._id;
      const name = response.data.users[0].display_name;
      const data = { id: id, name: name };
      return data;
    },
    (error) => {
      throw new Error("Bad twitch username");
    }
  );
};

const getFollowers = (id) => {
  const url = process.env.GET_FOLLOWERS;
  const headers = {
    Authorization: "Bearer " + AccessToken,
    "Client-ID": process.env.CLIENT_ID,
  };
  const params = { to_id: id };
  return axios.get(url, { params: params, headers: headers }).then(
    (response) => {
      return response.data.total;
    },
    (error) => {
      throw new Error("Problem with finding followers");
    }
  );
};

async function getChannel(req, res, next) {
  const { name } = req.params;
  try {
    const user = await getID(name);
    client.get(user.id, async (error, data) => {
      if (error) res.status(500).send(error.message);
      if (data !== null) {
        res.json({ name: user.name, followers: data });
      } else {
        try {
          console.log("Fetching Followers...");
          const followers = await getFollowers(user.id);
          client.setex(user.id, 300, followers);
          res.send({ name: user.name, followers: followers });
        } catch (error) {
          res.status(500).send(error);
        }
        next();
      }
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

app.get("/channel/:name", getChannel);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

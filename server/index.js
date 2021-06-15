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
      throw new Error("Access token not found");
      res.status(500);
      console.log(error.message);
    }
  );
};
getToken();

const fetchId = (username) => {
  let url = process.env.GET_USER_ID;
  const headers = {
    Accept: "application/vnd.twitchtv.v5+json",
    "Client-ID": process.env.CLIENT_ID,
  };
  const params = { login: username };
  return axios.get(url, { params: params, headers: headers });
};

const fetchFollowers = (id) => {
  const url = process.env.GET_FOLLOWERS;
  const headers = {
    Authorization: "Bearer " + AccessToken,
    "Client-ID": process.env.CLIENT_ID,
  };
  const params = { to_id: id };
  return axios.get(url, { params: params, headers: headers });
};

const getId = async (req, res, next) => {
  try {
    const { username } = req.params;
    const response = await fetchId(username);
    if (response.data._total > 0) {
      const id = response.data.users[0]._id;
      const name = response.data.users[0].display_name;
      req.user = { id: id, name: name };
      next();
    } else {
      res.status(404);
      next(Error("Twitch channel was not found. Please Try again"));
    }
  } catch (error) {
    res.status(error.response.status);
    next(Error("Please enter a valid name"));
  }
};

const cache = (req, res, next) => {
  const { user } = req;
  client.get(user.id, (error, data) => {
    if (error) {
      res.status(500);
      throw error;
    }
    if (data !== null) {
      res.json({ name: user.name, followers: data });
    } else {
      next();
    }
  });
};

const getFollowers = async (req, res, next) => {
  try {
    const { name } = req.params;
    const { user } = req;
    const response = await fetchFollowers(user.id);
    const data = response.data.total;
    client.setex(user.id, 300, data);
    res.json({ name: user.name, followers: data });
  } catch (error) {
    res.status(error.response.status);
    next(error);
  }
};

app.get("/channel/:username", getId, cache, getFollowers);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

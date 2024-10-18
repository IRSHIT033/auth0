const { auth } = require("express-openid-connect");
const express = require("express");

const app = express();
const { sendOrgInvitation } = require("./auth");
require("dotenv").config();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

app.get("/login", (req, res) => {
  res.oidc.login({
    authorizationParams: {
      organization: req.query.organization,
      invitation: req.query.invitation,
    },
  });
});

// req.isAuthenticated is provided from the auth router
app.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

app.get("/invite", async (req, res) => {
  try {
    await sendOrgInvitation("mukherjeeirshit50@gmail.com");
    res.send("Invitation sent");
  } catch (error) {
    console.log(error);
    res.status(500).send(`Error sending invitation, ${error}`);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

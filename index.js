const { auth } = require("express-openid-connect");
const express = require("express");

const app = express();
const { sendOrgInvitation } = require("./auth");
require("dotenv").config();
app.use(express.json());

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

// req.isAuthenticated is provided from the auth router
app.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

app.get("/accept-invitation", (req, res) => {
  console.log(req.query.organization);
  console.log(req.query.invitation);
  res.oidc.login({
    returnTo: "/",
    authorizationParams: {
      organization: req.query.organization,
      invitation: req.query.invitation,
    },
  });
});

app.post("/invite", async (req, res) => {
  try {
    await sendOrgInvitation(req.body.email);
    res.send(await sendOrgInvitation(req.body.email));
  } catch (error) {
    console.log(error);
    res.status(500).send(`Error sending invitation, ${error}`);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

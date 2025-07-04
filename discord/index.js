const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Replace with your actual credentials
const client_id = "1390792759606247455";
const client_secret = "ucsyEDrRZPjU2S1YuqkUWLW-vJll912B";
const redirect_uri = "https://3cc16990-a195-4810-937b-0f6544d71fd2-00-wji8jj2uqkuz.riker.replit.dev/callback";

// Start OAuth login
app.get("/login", (req, res) => {
  const authURL = `https://discord.com/api/oauth2/authorize?client_id=${client_id}&redirect_uri=${encodeURIComponent(
    redirect_uri
  )}&response_type=code&scope=identify guilds`;
  res.redirect(authURL);
});

// Handle callback
app.get("/callback", async (req, res) => {
  const code = req.query.code;

  const data = new URLSearchParams({
    client_id,
    client_secret,
    grant_type: "authorization_code",
    code,
    redirect_uri,
    scope: "identify guilds",
  });

  try {
    const tokenRes = await axios.post(
      "https://discord.com/api/oauth2/token",
      data.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const access_token = tokenRes.data.access_token;

    // Fetch user data
    const userRes = await axios.get("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const user = userRes.data;

    // Fetch servers count
    const guildsRes = await axios.get("https://discord.com/api/users/@me/guilds", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const serversCount = guildsRes.data.length;

    // Redirect with params
    res.redirect(`/?username=${encodeURIComponent(user.username)}&tag=${user.discriminator}&id=${user.id}&avatar=${user.avatar}&bio=${encodeURIComponent(user.bio || "No bio set")}&servers=${serversCount}`);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.send("OAuth login failed.");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

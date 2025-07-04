function App() {
  const root = document.getElementById("root");

  const params = new URLSearchParams(window.location.search);
  const username = params.get("username") || "Pekky";
  const tag = params.get("tag") || "1234";
  const id = params.get("id");
  const avatar = params.get("avatar");
  const bio = params.get("bio") || "No bio set";
  const serversCount = params.get("servers") || "Loading...";

  let accountCreationDate = "Unknown";
  if (id && /^[0-9]{17,20}$/.test(id)) {
    try {
      const timestamp = Number(BigInt(id) >> 22n) + 1420070400000;
      accountCreationDate = new Date(timestamp).toDateString();
    } catch (e) {
      console.error("Error parsing ID:", e);
    }
  }

  const data = {
    username: `${username}#${tag}`,
    avatarUrl: id && avatar
      ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`
      : "https://cdn.discordapp.com/embed/avatars/0.png",
    accountCreationDate,
    bio,
    serversCount,
  };

  root.innerHTML = `
    <div class="container">
      <h1>My Discord Info</h1>
      <img src="${data.avatarUrl}" alt="Avatar" />
      <p><strong>Account:</strong> ${data.username}</p>
      <p><strong>About Me:</strong> ${data.bio}</p>
      <p><strong>Account Created On:</strong> ${data.accountCreationDate}</p>
      <p><strong>Servers Joined:</strong> ${data.serversCount}</p>
      <button id="reconnectBtn">Connect Discord</button>
    </div>
  `;

  document.getElementById("reconnectBtn").addEventListener("click", () => {
    window.location.href = "/login";
  });
}

App();

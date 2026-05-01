const fs = require("fs");

const now = Math.floor(Date.now() / 1000);

function parseTime(str) {
  const num = parseInt(str);

  if (str.endsWith("m")) return num * 60;
  if (str.endsWith("h")) return num * 3600;
  if (str.endsWith("d")) return num * 86400;
  if (str.endsWith("w")) return num * 604800;

  return 0;
}

function formatTime(sec) {
  if (sec <= 0) return "0m";

  const m = Math.floor(sec / 60);
  const h = Math.floor(sec / 3600);

  if (h > 0) return `${h}h`;
  if (m > 0) return `${m}m`;

  return `${sec}s`;
}

let lines = fs.readFileSync("users.txt", "utf8").split("\n");

let updated = [];

for (let line of lines) {
  if (!line.includes("=")) continue;

  let [user, value] = line.split("=");

  user = user.trim();
  value = value.trim().split("//")[0].trim();

  if (value === "expired") {
    updated.push(`${user} = expired // 0m restantes`);
    continue;
  }

  let seconds = parseTime(value);

  // guardamos en comentario timestamp inicial
  let match = line.match(/#(\d+)/);
  let start;

  if (match) {
    start = parseInt(match[1]);
  } else {
    start = now;
  }

  let end = start + seconds;
  let remaining = end - now;

  if (remaining <= 0) {
    updated.push(`${user} = expired // 0m restantes`);
  } else {
    updated.push(`${user} = ${value} // ${formatTime(remaining)} restantes #${start}`);
  }
}

fs.writeFileSync("users.txt", updated.join("\n"));

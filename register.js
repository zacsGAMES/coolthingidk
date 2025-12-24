import fetch from "node-fetch";

const APP_ID = process.env.APP_ID;
const BOT_TOKEN = process.env.BOT_TOKEN;

const commandData = {
  name: "flool",
  description: "Send a message multiple times",
  options: [
    { name: "message", type: 3, required: true },
    { name: "count", type: 4, required: true },
    { name: "delay", type: 10, required: true }
  ]
};

fetch(`https://discord.com/api/v10/applications/${APP_ID}/commands`, {
  method: "POST",
  headers: {
    Authorization: `Bot ${BOT_TOKEN}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify(commandData)
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);

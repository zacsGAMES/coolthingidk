import express from "express";
import { verifyKeyMiddleware } from "discord-interactions";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// Verify Discord requests
app.post(
  "/interactions",
  verifyKeyMiddleware(process.env.DISCORD_PUBLIC_KEY),
  async (req, res) => {
    const interaction = req.body;

    // Discord Ping
    if (interaction.type === 1) {
      return res.send({ type: 1 });
    }

    // /flool command
    if (interaction.data?.name === "flool") {
      const opts = interaction.data.options;
      const message = opts.find(o => o.name === "message")?.value || "Hello!";
      const count = Math.min(opts.find(o => o.name === "count")?.value || 5, 50);
      const delay = Math.min(opts.find(o => o.name === "delay")?.value || 1, 5);

      // Respond immediately to avoid timeout
      res.send({
        type: 4,
        data: { content: `Command started 🚀 Sending ${count} messages`, flags: 64 }
      });

      // Send messages asynchronously
      for (let i = 0; i < count; i++) {
        await fetch(
          `https://discord.com/api/v10/channels/${interaction.channel_id}/messages`,
          {
            method: "POST",
            headers: {
              Authorization: `Bot ${process.env.BOT_TOKEN}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ content: message })
          }
        );
        await new Promise(r => setTimeout(r, delay * 1000));
      }
    }
  }
);

// Health check
app.get("/", (req, res) => res.send("Bot is running ✅"));

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

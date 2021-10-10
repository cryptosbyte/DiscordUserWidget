const { Client, Intents } = require("discord.js"),
  app = require("express")(),
  ImageResponse = require("./image"),
  exec = require("child_process").exec,
  fs = require("fs");

class MainClient {
  constructor() {
    // ********************
    require("dotenv").config();
    // ********************

    this.client = new Client({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_PRESENCES,
      ],
    });

    app.get("/", (request, response) => {
      response.json({
        clientPing: `${this.client.ws.ping}`,
        server: "https://discord.gg/TUAkRBWwMZ",
      });
    });

    app.get("/user_data/:id", async (request, response) => {
      if (request.params.id && parseInt(request.params.id)) {
        try {
          const member = await this.client.guilds.cache
            .get("896476755995541564")
            .members.fetch(request.params.id);

          await se({
            url: `${member.displayAvatarURL()}?size=48`,
            data: member.user.id,
            username: member.user.username,
            discriminator: `#${member.user.discriminator}`,
            presence: member.presence?.status || "offline",
          });

          var stream = fs.createReadStream(`./tmp/${request.params.id}.png`);

          stream.on("open", async () => {
            response.set("Content-Type", "image/png");
            stream.pipe(response);

            await exec("rm -rf tmp/*");
          });
        } catch {
          return response.json({
            success: false,
            message: "Invalid 'userid' or user did not join server!",
          });
        }
      } else
        response.json({
          success: false,
          message: "'userid' is not a parse-able integer!",
        });
    });

    this.client.on("ready", () =>
      console.log(`[${this.client.user.username}] I'm now initialised.`)
    );

    this.client.on("rateLimit", () =>
      console.log(`[${this.client.user.username}] I'm being RateLimited!`)
    );
  }

  init = () => {
    this.client.login(process.env.TOKEN);
    app.listen(process.env.PORT || 4000, () =>
      console.log("[Server] Dancing on Port %s", process.env.PORT || 4000)
    );
  };
}

new MainClient().init();

/*
return {
  username: member.user.username,
  discriminator: member.user.discriminator,
  avatarURL: `https://cdn.discordapp.com/avatars/${member.user.username}/${member.user.avatar}.png`,
  status: member.presence?.status || "offline",
  activities: member.presence?.activities || [],
};
*/

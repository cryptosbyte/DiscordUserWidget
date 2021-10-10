const sharp = require("sharp");
const axios = require("axios");

module.exports = async (data) => {
  try {
    await sharp(
      (
        await axios({
          url: data.url,
          responseType: "arraybuffer",
        })
      ).data
    )
      .resize(48, 48)
      .composite([
        {
          input: Buffer.from(
            '<svg><rect x="0" y="0" width="48" height="48" rx="12" ry="12"/></svg>'
          ),
          blend: "dest-in",
        },
      ])
      .png()
      .toFile(`./tmp/${data.data}-1.png`);

    await sharp("./imgs/bg.png")
      .composite([
        {
          input: `./tmp/${data.data}-1.png`,
          top: 15,
          left: 30,
        },
        {
          input: `./imgs/${data.presence}.png`,
          top: 50,
          left: 66,
        },
        {
          input: Buffer.from(`
          <svg width="390" height="60">
            <style>
            .title { fill: #fff; font-size: 30px; font-weight: bold; font-family: helvetica; }
            </style>
            <text x="40%" y="50%" text-anchor="" class="title">${data.username}</text>
          </svg>
          `),
          top: 10,
          left: -60,
        },
        {
          input: Buffer.from(`
          <svg width="394" height="60">
            <style>
            .title { fill: #fff; font-size: 25px; font-weight: bold; font-family: helvetica; }
            </style>
            <text x="82.5%" y="86%" text-anchor="" class="title">${data.discriminator}</text>
          </svg>
          `),
          top: 10,
          left: -60,
        },
      ])
      .toFormat("png")
      .toFile(`./tmp/${data.data}.png`);
  } catch (e) {
    console.error(e);
  }
};

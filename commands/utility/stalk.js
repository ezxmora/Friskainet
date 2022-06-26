const Puppeteer = require('puppeteer-extra');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { MessageAttachment } = require('discord.js');

module.exports = {
  name: 'stalk',
  description: 'Hace una captura de una web',
  category: 'utility',
  run: async (interaction) => {
    const { util } = interaction.client;
    const url = interaction.options.getString('url');
    const fullPage = interaction.options.getBoolean('full');

    if (util.isAnURL(url)) {
      await interaction.deferReply();
      const screenshotOptions = { fullPage };

      Puppeteer.use(StealthPlugin()).use(AdblockerPlugin({ blockTrackers: true }));

      await Puppeteer.launch({ headless: true, args: ['--no-sandbox'] }).then(async (browser) => {
        const page = await browser.newPage();
        await page.emulateMediaFeatures({ name: 'prefers-color-scheme', value: 'dark' });
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.waitForTimeout(1000);
        const screenshot = await page.screenshot(screenshotOptions);

        const attachment = new MessageAttachment(screenshot, 'SPOILER_website.png').setSpoiler(true);
        await interaction.editReply({ files: [attachment] });
        await browser.close();
      });
    }
    else {
      interaction.reply({ content: 'Eso no es una URL válida', ephemeral: true });
    }
  },
};

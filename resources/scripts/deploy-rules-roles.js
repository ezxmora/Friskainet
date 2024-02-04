process.title = 'Friskainet - Deploy rules & role manager script';

require('module-alias/register');
const { GatewayIntentBits, resolveColor } = require('discord.js');
const Friskainet = require('@bot/Friskainet');
const { token, channels: { serverInfoId } } = require('@config');
const { intro, rules, outro } = require('../rules.json');

const bot = new Friskainet({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

bot.login(token).then(async () => {
  const { database: { Rule } } = bot;
  Rule.destroy({ truncate: true, cascade: false })
    .then(async () => {
      // Setting up server-info channel embeds
      const channelInfo = await bot.channels.fetch(serverInfoId);
      const embedRulesIntro = {
        color: resolveColor('#232323'),
        title: intro.title,
        description: intro.description,
      };

      const embedRulesList = {
        color: resolveColor('#232323'),
        fields: [],
      };
      embedRulesList.fields = rules.map((rule) => {
        // Adding rules to the database
        Rule.create({ title: rule.title, content: rule.description })
          .then((result) => bot.logger.log(`La norma ${result.title} ha sido añadida correctamente`))
          .catch((error) => bot.logger.error(`Ha habido un error al añadir la norma ${error}`));

        return ({ name: `__${rule.title}__`, value: rule.description });
      });

      const embedRulesOutro = {
        color: resolveColor('#232323'),
        description: outro,
      };

      channelInfo.send({ embeds: [embedRulesIntro, embedRulesList, embedRulesOutro] });
    })
    .catch((error) => bot.logger.error(`Ha habido un error al borrar las normas ${error}`));
});


const { Client, Intents, Collection } = require('discord.js');

const bot = new Client({
  intents: Intents.ALL,
  messageCacheMaxSize: 500,
  messageCacheLifetime: 120,
  messageSweepInterval: 60,
});

bot.on('ready', () => {
  console.log('Ready');
});

function date() {
  const today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  const hh = today.getHours();
  const mi = today.getMinutes();
  const ss = today.getSeconds();
  const yyyy = today.getFullYear();

  if (dd < 10) {
    dd = `0${dd}`;
  }
  if (mm < 10) {
    mm = `0${mm}`;
  }

  return `${dd}/${mm}/${yyyy} a las ${hh}:${mi}:${ss}`;
}

bot.on('message', async (message) => {
  const invite = 'https://discord.gg/Xvuz5DJ';
  const normas = `   
    **__Canales específicos__**
    Procura mantener el contenido de los canales dentro de los mismos. Esto quiere decir que el anime por ejemplo va en su respectivo canal (<#595423565008863240>).

    **__Cuentas secundarias__**
    No se permite el uso de cuentas secundarias, no necesitas mas de una cuenta para estar aquí.

    **__AFK en los canales de voz__**
    Intenta moverte al canal de AFK (aunque el auto-afk está activado) en caso de que te tengas que quedar AFK por un tiempo prolongado.

    **__Bullying__**
    A todos nos gusta un flameito, eso es ley, pero si alguien te dice que te estas pasando, por favor, para.

    **__Nombres mencionables__**
    Intenta utilizar caracteres normales, Si no se te puede mencionar escribiendo \`@cualquier-nombre-que-te-hayas-puesto\` se te pedirá que te cambies el nombre.

	**__Cánticos__**
	Está muy bien que te guste cantar, de putísima madre, pero esto es el pueblo de Billy Elliot desde hace una temporada y en vez del baile prohibimos el canto porque por lo general no cantáis bien.

	**__ASMR__**
	Es poco probable que te hayas gastado un pastizal en un micrófono para hacer ASMR, además de que también es poco probable de que no sepas hacerlo, así que por favor, no hagas el ridículo intentándolo.

    **__Lo típico__**
    No hagas spam, no pases links raros, pide permiso para hacer publicidad, bla bla bla...`;

  if (message.content === 'reglas') {
    await message.channel.messages
      .fetch({ limit: 100 })
      .then((msg) => {
        message.channel
          .bulkDelete(100, true)
          .then((m) => {
            console.log(m.size, 'borrados');

            const welcome = {
              title: 'Bienvenid@ a La Squad de Mongolos',
              description: 'Somos un grupo de retrasados que se juntaron hace la tira y aquí estamos, haciendo el cafre por el conjunto descentralizado de redes de comunicación interconectada.',
              color: ((1 << 24) * Math.random()) | 0,
              footer: { text: `Si necesitas una invitación aquí tienes una ${invite}` },
            };
            message.channel.send({ embed: welcome });

            const intro = {
              color: ((1 << 24) * Math.random()) | 0,
              title: 'Normas del servidor',
              description: 'Estas son las normas por las que nos solemos regir en el servidor - estaría bien que todo el mundo las siguiera. Algunos canales pueden tener normas específicas - El desnocimiento de las mismas no te exime de su cumplimiento - Echales un ojo pls :(',
            };
            message.channel.send({ embed: intro });

            const rules = {
              color: ((1 << 24) * Math.random()) | 0,
              description: normas,
              footer: `Actualizado por última vez el ${date()}`,
            };
            message.channel.send({ embed: rules });

            const bye = {
              color: ((1 << 24) * Math.random()) | 0,
              description: 'Pues no hay mucho mas, pásatelo bien y eso, si tienes alguna duda puedes contactar con cualquier moderador o administrador <3',
            };
            message.channel.send({ embed: bye });
          })
          .catch(console.error);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

bot.login('MjM4Mzc3ODY3Mzc1OTM1NDg4.WAfEsA.BuYqpo_oujhazxTzInmO1aL8-ds');

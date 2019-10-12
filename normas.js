var Discord = require('discord.js');

const bot = new Discord.Client();

bot.on('ready', () => {
	console.log('Ready');
});

function date() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	var hh = today.getHours();
	var mi = today.getMinutes();
	var ss = today.getSeconds();
	var yyyy = today.getFullYear();

	if (dd < 10) {
		dd = '0' + dd;
	}
	if (mm < 10) {
		mm = '0' + mm;
	}

	return `${dd}/${mm}/${yyyy} a las ${hh}:${mi}:${ss}`;
}

bot.on('message', async message => {
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

    **__Lo típico__**
    No hagas spam, no pases links raros, pide permiso para hacer publicidad, bla bla bla...`;

	if (message.content === 'reglas') {
		await message.channel
			.fetchMessages({ limit: 100 })
			.then(msg => {
				message.channel
					.bulkDelete(100, true)
					.then(m => console.log(m.size, 'borrados'))
					.catch(console.error);
			})
			.catch(err => {
				console.log(err);
			});

		const channel = bot.channels.find('name', 'serverinfo');
		const intro = new Discord.RichEmbed()
			.setTitle('Bienvenid@ a La Squad de Mongolos')
			.setColor('#' + (((1 << 24) * Math.random()) | 0).toString(16))
			.setDescription(
				'Somos un grupo de retrasados que se juntaron hace la tira y aquí estamos, haciendo el cafre por el conjunto descentralizado de redes de comunicación interconectada.'
			)
			.setFooter(`Si necesitas una invitación aquí tienes una ${invite}`);

		const introRules = new Discord.RichEmbed()
			.setTitle('Normas del servidor')
			.setColor('#' + (((1 << 24) * Math.random()) | 0).toString(16))
			.setDescription(
				'Estas son las normas por las que nos solemos regir en el servidor - estaría bien que todo el mundo las siguiera. Algunos canales pueden tener normas específicas - El desnocimiento de las mismas no te exime de su cumplimiento - Echales un ojo pls :('
			);

		const rules = new Discord.RichEmbed()
			.setColor('#' + (((1 << 24) * Math.random()) | 0).toString(16))
			.setDescription(normas)
			.setFooter(`Actualizado por última vez el ${date()}`);

		const outro = new Discord.RichEmbed()
			.setColor('#' + (((1 << 24) * Math.random()) | 0).toString(16))
			.setDescription(
				'Pues no hay mucho mas, pasatelo bien y eso y si tienes alguna duda puedes contactar con cualquier moderador o administrador <3'
			);

		await channel.send(intro);
		await channel.send(introRules);
		await channel.send(rules);
		await channel.send(outro);
	}
});

bot.login('MjM4Mzc3ODY3Mzc1OTM1NDg4.DXmphA.ovk-KSKPi-wD5T5V_ntE6yQcKyc');

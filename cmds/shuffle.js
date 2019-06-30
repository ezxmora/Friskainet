/**
 * Distribuye de forma aleatoria los elementos de un array
 * @param {Array} array - El array que vamos a barajar
 * @returns String[]
 */
const shuffleArray = (array) => {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/**
 * Separa en sectores el array
 * @param {Array} array - El array que vamos a separar
 * @param {Integer} groups - Número de grupos en los que se va a dividir
 * @returns {Array}
 */
const chunkArray = (array, size) => {
    var results = [];

    while (array.length) {
        results.push(array.splice(0, size));
    }
    return results;
}

/**
 * Crea una tabla a partir de un array
 * @param {Array} array - El array con el que vamos a crear la tabla
 * @returns {String} 
 */
const createTable = (array) => {
    var table = "";
    for (let i = 0; i < array.length; i++) {
        table += `** Grupo ${i+1}: **`
        for (let k = 0; k < array[i].length; k++) {
            table += `${array[i][k]} `;
        }
        table += "\n";
    }

    return table;
}

exports.run = async(bot, message, args) => {
    const numGroups = args[0];
    if (isNaN(numGroups)) return message.reply('El primer parámetro tiene que ser un número');

    const intGroups = parseInt(numGroups);
    var usersArray = [];
    for (let i = 1; i < args.length; i++) {
        usersArray.push(args[i]);
    }

    if (intGroups > usersArray.length) return message.reply('La cantidad de grupos es mayor que la de personas');

    const finalArray = createTable(
        chunkArray(
            shuffleArray(usersArray), intGroups)
    );

    await message.channel.send(finalArray);
    bot.LogIt.cmd(`${message.author.tag} ha utilizado shuffle`);
}
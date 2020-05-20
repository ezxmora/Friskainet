# Friskainet

Friskainet is a Discord bot written in JavaScript with the main purpose of learning how to use NodeJS & MongoDB correctly

## Why that name?

To be honest the name came from a chat that a friend and I were having about an old bot he had from a name and I asked him if I could use that.

It also comes from Free [Skynet](<https://en.wikipedia.org/wiki/Skynet_(Terminator)>).

### Prerequisites

First of all you are going to need a MongoDB installation, it doesn't mind if you host it yourself at home, in a VPS, whatever. I use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) myself (No, I don't get a single Euro by this promotion). Also you are going to need [NodeJS](https://nodejs.org/) ~~Duh~~.

### Installing

After having all the prerequisites just download the repository and create a config file called **config.json** with this structure:

```JSON
{
    "token": "YOUR TOKEN",
    "prefix": "YOUR PREFIX",
    "database": "YOUR MONGODB URI",
    "roleAdmin": "ADMIN NAME ROLE",
    "betRatio": 0.75
}
```

> **_betRatio_** number can be whatever you want. The formula is: `bet * betRatio * wins`

After having everything set up you can also install [forever](https://www.npmjs.com/package/forever) and run the bot or modify `package.json` script sentences to your likings.

## TODO

-   More commands
-   Multilanguage support
-   CRUD Rules
-   Music? Maybe?
-   Gambling system

## Authors

-   **Erik Zamora** - _Everything_ - [Eriknaitor](https://github.com/ezxmora)

See also the list of [contributors](https://github.com/Eriknaitor/friskainet/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

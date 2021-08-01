![](https://i.imgur.com/XBnWtFG.png)
<p align="center">
  <img alt="License" src="https://img.shields.io/github/license/ezxmora/Friskainet?style=flat-square">
  <img alt="Language" src="https://img.shields.io/badge/Language-Node.js-red?style=flat-square&logo=node.js">
  <img alt="Discord" src="https://img.shields.io/discord/234313904317136906?style=flat-square">
  <a href="https://github.com/ezxmora/Friskainet/commits/main"><img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/ezxmora/Friskainet?style=flat-square"></a>
  <a href="https://open.vscode.dev/ezxmora/Friskainet"><img alt="Open in VS Code" src="https://open.vscode.dev/badges/open-in-vscode.svg"></a>
</p>


## Before doing anything
You are going to need ffmpeg, Node.js and an SQL database (Postgres, MySQL, MariaDB or Microsoft SQL Server) installed in your system (or in a Docker container).

## Local setup
1. Run `git clone https://github.com/ezxmora/Friskainet.git && cd Friskainet` to clone and access the repo
2. Run `npm install --production` for installing all dependencies, you might need to run __one__ of the following commands based in your choice:
   * `npm install --save pg pg-hstore` - Postgres
   * `npm install --save mysql2` - MySQL
   * `npm install --save mariadb` - MariaDB
   * `npm install --save tedious` - Microsoft SQL Server
3. Rename `.env.example` into `.env` and tweak the options to your likings
4. Access to your [DBMS](https://en.wikipedia.org/wiki/Database#Database_management_system) and create a new database with whatever name you gave it in `.env - (FRISKAINET_DATABASE_NAME)`
5. Run `npm run config` to setup the database and folders
6. Run `npm run start` or `node app`

## Extra
You can setup [pm2](https://www.npmjs.com/package/pm2), [forever](https://www.npmjs.com/package/forever) or whatever makes the bot stay alive forever for avoiding any downtime.

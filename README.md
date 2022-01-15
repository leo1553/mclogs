## Minecraft Logs Parser
`mclogs` is a Minecraft logs parser. It reads the log folder and submits the data to a SQL database using sequelize.

**Extracted tables:**
- Players: list of all players;
- PlayerJoins: player and time for player connects;
- PlayerLeaves: player and time for player disconnects;
- PlayerDeaths: player, killer, item and time for player deaths;
- PlayerKills: killer, victim and time for pvp kills;
- PlayerMessages: player, message and time for player messages;

#### Running
- Copy `env/sample.yml` to `env/local.yml` and fill the parameters.
- Run `npm install` to setup the environment.
- Run `npm run start` to execute.

#### Observations
- It was built and tested using paper server logs and SQL Server, maybe some changes will have to be made for it to work with other databases.
- It will not parse the latest.log file, since it is not possible to be sure of its date. If you want it to be read, rename it as `YYYY-MM-DD-n.log`.
- There are some sql available at `utils/sql` for pvp and play time data.
- The data is accumulative, it will only register a new log with timestamps greater than the latest log registered.

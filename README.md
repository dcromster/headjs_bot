# Bot for posting news from RSS to Telegram and Twitter account

## Configuration

Bot uses two json files:

- config.global.json
- config.[development|production].json

This files is simple json files.
config.[development|production].json - use if You wish to divided dev and prod configuration.

### config.global.json

- token - You're Telegram bot token
- lastTitle - last title, witch was posted
- chatID - ID of chat to post messages
- RSS - RSS feed URL
- twitter - setting for twitter access

### config.[development|production].json

- scanTime - period new records check. Default 60000 ms = 1 min

## TODO

- HumanJSON for config files [hjson](https://www.npmjs.com/package/hjson)
- More and best logging
- Tests

## History

- 1.1.0 161116 +Post to Twitter
- 1.0.0 Post to Telegram channel

## Contact

[dcromster@twitter](https://twitter.com/dcromster)

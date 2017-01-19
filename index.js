// v1.1.1 - 180117

const botr = require('telegram-api/build');
const Twitter = require('twitter');

const parser = require('rss-url-parser')
const fs = require('fs');

const request = require('request');
// Set the headers
const headers = {
	'User-Agent':       'Bot/1.0.0',
	'Content-Type':     'application/x-www-form-urlencoded'
}

console.log('Started...');

// Configuration
// NODE_ENV=test node ./app.js
const env = process.env.NODE_ENV || 'development' // or 'production'
			, configurationFilename = './config.' + env + '.json'
			, configuration = require(configurationFilename)
			, globalConfiguration = require('./config.global.json')
console.log('. Current:' + env);

configuration.global = globalConfiguration;

//------------------------------------------------------------------------------
const bot = new botr({"token" : configuration.global.token});

ScanNews(); // scan rss at start
bot.start();

if (!configuration.scanTime) {
	configuration.scanTime = 60000; // 1 minute
}
setInterval(ScanNews, configuration.scanTime);
var last_title = configuration.global.lastTitle;

//------------------------------------------------------------------------------
function ScanNews() { // Scaning RSS for new records
	parser(configuration.global.RSS).then((data) => {
		if (last_title !== data[0].title) {
			console.log('New record:' + data[0].title);
			var poststring = data[0].title + ' ' + data[0].link;
			if (data[0].description) {
				poststring += ' ' + data[0].description;
			}

			// Posting to twitter
			const client = new Twitter({
				consumer_key: configuration.global.twitter.consumer_key,
				consumer_secret: configuration.global.twitter.consumer_secret,
				access_token_key: configuration.global.twitter.access_token_key,
				access_token_secret: configuration.global.twitter.access_token_secret
			});

			client.post('statuses/update', {status: poststring}, function(error, tweet, response) {
				if (!error) {
					console.log(tweet);
				}
			});

			// Posting to Telegram channel
			/// Remove all html tags
			const poststring1 = poststring.replace(/<\/?[^>]+(>|$)/g, "");
			/// Configure the request
			const options = {
				url: 'https://api.telegram.org/bot' + configuration.global.token + '/sendMessage',
				method: 'GET',
				headers: headers,
				qs: {
					'chat_id': configuration.global.chatId,
					'text': poststring
				}
			};
			/// Start the request
			request(options, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					console.info('body:', body);
					last_title = data[0].title;
					saveConfig(last_title);
				} else {
					console.error(error);
				}
			})

		};
	})
};
//------------------------------------------------------------------------------
function saveConfig(last_title) { // Saving global config file with new 'last record'
	configuration.global.lastTitle = last_title;
	fs.writeFileSync('./config.global.json', JSON.stringify(configuration.global, null, '\t'));
}

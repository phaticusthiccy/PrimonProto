const sulla = require('sulla');

sulla.create().then((client) => start(client));

client.onMessage(async (message) => {
    console.log(message)
})

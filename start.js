const sulla = require('sulla');
sulla.create().then((client) => start(client));

const start = (client) => {
    client.onMessage(async (message) => {
        console.log(message)
    })
})

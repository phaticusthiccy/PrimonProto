var fs = require("fs")
class StringSession {
    constructor() {
    }

    deCrypt(string = undefined) {
        if ('SESSION' in process.env && string === undefined) {
            string = process.env.STRING_SESSION;
        } else if (string !== undefined) {
            if (fs.existsSync(string)) {
                string = fs.readFileSync(string, {encoding:'utf8', flag:'r'});
            }
        }
        return JSON.parse(Buffer.from(string, 'base64').toString('utf-8'));
    }

    createStringSession(dict) {
        return Buffer.from(JSON.stringify(dict)).toString('base64');
    }
}

var g = new StringSession()
var s = g.deCrypt("eyJjbGllbnRJRCI6ImYzVXJDb3ltTTFjdUlaaEZCMXc1NXc9PSIsInNlcnZlclRva2VuIjoiMUBvbG1EeXVxK0U2RFpFZXV3Z1hYN0tQSUdVeUJkYkE5bEZNV1c0dUQrYU9mbEozL0Z0VkZJNmljd1JtSHBRem9iRGlqdHJuWjdHRWlHZmc9PSIsImNsaWVudFRva2VuIjoiOFU0MGlYR0dINk9ncmN6L3VpNFhHU1RGczlIbG93T3hqeU1sVTNrNW9uQT0iLCJlbmNLZXkiOiJCYWFQcjBBVGhDVk1HRkJtUlpDR3dZdW1IV0pTQ0RhcTZueTBqNEptaFZ3PSIsIm1hY0tleSI6InNvY1orQS91MGpUajJESVJQdCs0QWx5Mm8wRytRZkJ0T2FPS2NES2ZMK3c9In0=")
console.log(s)
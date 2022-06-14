// Primon Proto 
// Headless WebSocket, type-safe Whatsapp Bot
// 
// Primon, lisanced under GNU GENERAL PUBLIC LICENSE. May cause some warranity problems, within Priomon.
// Multi-Device Lightweight ES5 Module (can usable with mjs)
//
// Phaticusthiccy - 2022

let messages = []
function deleteMessageST(messageID) {
    delete messages[messageID]
}
function saveMessageST(messageID, txt) {
    messages[messageID] = txt
}
function getMessageST(messageID) {
    return messages[messageID]

}
function clearMessagesST() {
    messages = []
}
setInterval(clearMessagesST, 120000)

module.exports = {
    deleteMessageST: deleteMessageST,
    saveMessageST: saveMessageST,
    getMessageST: getMessageST
}
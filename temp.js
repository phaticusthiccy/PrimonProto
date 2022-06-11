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
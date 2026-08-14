
const checkCmd = async (cmd, req) => {
    const command = cmd.trim().split(' ')
    if (command[0] == 'whoami') {
        const currentUser = getUser(req)
        return currentUser
    } else if (command[0] == 'pwd') {
        const currentDirectory = await getDirectory()
        return currentDirectory
    } else if (command[0] == 'echo') {
        const echoCommand = command.join(' ').slice(5)
        return echoCommand
    } else if (command[0] == 'ksi') {
        return "https://docs.google.com/document/d/10fmVAQpOZw_OeUNW1bn5H4xk7r7onBa_YgTp5xuBwdc/edit?tab=t.0";
    } else if (command[0] == 'duck') {
        return "https://encryptid-level0.onrender.com"
    }
    else {
        return `Bash: command "${command[0]}" not found.`
    }
}

function getUser(req) {
    return req.name
}

async function getDirectory() {

}

module.exports = {checkCmd}
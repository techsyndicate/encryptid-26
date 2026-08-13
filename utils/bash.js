
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
    } else if (command[0] == 'pronovarexnishugal') {
        return 'SHISTECH WINNER LESGOOO'
    } else if (command[0] == 'cookies') {
        return 'TSTST TTSTT STTST STTST TTSSS TTSTT TTSSS STTSS TSSTT STTST TTTTS TTSTT TTSST TSTTT TSSTT.'
    } else if (command[0] == 'themomentoftruth') {
        return "He did mock the mayor of auckland city in his song."
    } else if (command[0] == 'whoishe') {
        return "CtHQ6oKsLjw"
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
function challengePoints(challenge) {
    const initial = Number(challenge.points) || 0
    if (challenge.type !== "ctf") return initial
    let solveCount = Math.max(0, Number(challenge.solves) || 0)
    if (solveCount !== 0) solveCount -= 1
    // decay + 1 solves are needed for the value to decay from the initial maximum to the minimum
    const value = ((50 - initial) / (15 ** 2)) * (solveCount ** 2) + initial
    return Math.max(50, Math.ceil(value))
}

function computePoints(user, challengeMap) {
    let points = 0
    for (const challengeRef of user.solves) {
        const challenge = challengeMap.get(challengeRef)
        if (challenge) points += challengePoints(challenge)
    }
    return points
}

module.exports = {
    challengePoints,
    computePoints
}
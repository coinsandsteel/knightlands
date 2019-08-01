export default {
    progressThresholds: [{
            value: 0.35,
            type: "red"
        },
        {
            value: 0.75,
            type: "yellow"
        },
        {
            value: 1,
            type: "green"
        }
    ],
    stageNames: ["normal", "hard", "rutheless", "torment"],
    enemyImage(enemyId) {
        return `/images/enemies/${enemyId}.png`;
    }
}
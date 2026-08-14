module.exports = {
    testEnvironment: "node",

    transform: {
        "^.+\\.(t|j)sx?$": [
            "@swc/jest",
            {
                jsc: {
                    parser: {
                        syntax: "typescript",
                        tsx: true
                    }
                },
                module: {
                    type: "es6"
                }
            }
        ]
    },

    extensionsToTreatAsEsm: [".ts", ".tsx"]
};
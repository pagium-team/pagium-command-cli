'use strict'

var getPackage = function (name, version) {
    return {
        "name": name,
        "version": version,
        "dependencies": {
            "express": "3.4.8",
            "request": "2.34.0"
        }
    }
}

module.exports = {
    getPackage: getPackage
}
const fs = require('fs');

const jsonReader = async filePath => {
    try {
        const jsonString = await fs.promises.readFile(filePath, "utf8");
        const data = JSON.parse(jsonString);
        // console.log(data);
        return data;

    } catch (err) {
        console.log("Error reading or parsing JSON file:", err);
    }
}

module.exports = jsonReader;
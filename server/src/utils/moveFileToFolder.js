const fs = require("fs-extra");

exports.moveFile = (oldUrl, newUrl, folderName, documentName) => {
    const dir = `${newUrl}${folderName}`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    } else {
        fs.emptyDirSync(dir);
    }

    fs.rename(`${oldUrl}${documentName}`, `${newUrl}${folderName}/${documentName}`, function (err) {
        if (err) console.log(`Error: ${err}`);
    });
};

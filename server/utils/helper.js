function decodeBase64JsonAndSaveAsBuffer(b64jsonString) {
    let binData = Buffer.from(b64jsonString, 'base64');
    return binData;
}

module.exports = {
    decodeBase64JsonAndSaveAsBuffer
}
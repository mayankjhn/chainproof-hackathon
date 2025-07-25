export const computeFileHash = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return '0x' + hashHex;
};

export const verifyFileIntegrity = async (file, expectedHash) => {
    const actualHash = await computeFileHash(file);
    return actualHash === expectedHash;
};

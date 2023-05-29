export const boxConfig = {
  "boxAppSettings": {
    "clientID": process.env.boxClientID,
    "clientSecret": process.env.boxClientSecret,
    "appAuth": {
      "publicKeyID": process.env.boxPublicKeyID,
      "privateKey": process.env.boxPrivateKey?.replace(/\\n/gi, '\n'),
      "passphrase": process.env.boxPassphrase
    }
  },
  "enterpriseID": process.env.boxEnterprixeID
}

export const boxFolderConfig={
  defaultBoxFolderId:'169168943764',
}
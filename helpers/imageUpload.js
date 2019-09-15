const sharp = require('sharp');
const fetch = require('node-fetch');
const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  projectId: 'pratopratico-ebbc3',
  keyFilename: 'pratopratico.json',
});

const bucket = storage.bucket('gs://pratopratico-ebbc3.appspot.com/');

module.exports = {
  uploadImageGetURL: file => new Promise(async (resolve, reject) => {
    if (!file) {
      reject(new Error('No image file'));
    }
    const { originalname: name } = file;

    const image = await sharp(file.buffer)
      .resize(480, 360)
      .png()
      .toBuffer();

    const newFileName = `${name}_${Date.now()}`;

    const fileUpload = bucket.file(newFileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: 'image/png',
      },
    });

    blobStream.on('error', () => {
      reject(new Error('Erro! Por favor tente novamente.'));
    });

    blobStream.on('finish', async () => {
      let url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUpload.name}`;

      const result = await fetch(url);
      const data = await result.json();

      url = `${url}?alt=media&token=${data.downloadTokens}`;
      resolve(url);
    });

    blobStream.end(image);
  }),
};

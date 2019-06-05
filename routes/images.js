const express = require('express');
const router = express.Router();
const { Storage } = require('@google-cloud/storage');
const Multer = require('multer');
const fetch = require("node-fetch");

const storage = new Storage({
    projectId: "pratopratico-ebbc3",
    keyFilename: "pratopratico.json"
});

const bucket = storage.bucket("gs://pratopratico-ebbc3.appspot.com/");

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
});

/*  
!   /images
*/

/*  
*  Upload da imagem para o firebase
*/

/**
 * Adding new file to the storage
 */
router.post('/upload', multer.single('file'), (req, res) => {
    let file = req.file;

    if (file) {
        uploadImageToStorage(file).then((url) => {
            res.status(200).send({ url });
        }).catch((error) => {
            console.error(error);
        });
    }
});


/**
 * Upload the image file to Google Storage
 * @param {File} file object that will be uploaded to Google Storage
 */
const uploadImageToStorage = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject('No image file');
        }
        let newFileName = `${file.originalname}_${Date.now()}`;

        let fileUpload = bucket.file(newFileName);

        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: 'image/jpeg'
            }
        });

        blobStream.on('error', (error) => {
            reject('Something is wrong! Unable to upload at the moment.');
        });

        blobStream.on('finish', async () => {

            let url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUpload.name}`;

            let result = await fetch(url)
            let data = await result.json();

            url = url + '?alt=media&token=' + data.downloadTokens
            resolve(url);
        });

        blobStream.end(file.buffer);
    });
}



module.exports = router;
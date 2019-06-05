const fetch = require("node-fetch");
const { Storage } = require('@google-cloud/storage');
const Multer = require('multer');
const atob = require("atob");
const Blob = require('node-blob');

const storage = new Storage({
    projectId: "pratopratico-ebbc3",
    keyFilename: "pratopratico.json"
});

const bucket = storage.bucket("gs://pratopratico-ebbc3.appspot.com/");
const dificuldadeEnum = require('../enums/dificuldade');
const unidadeEnum = require('../enums/unidade');

module.exports = {
    validaDificuldade: (dificuldade) => {
        //Checa se a dificuldade está correta, pois são aceitos valores pré-definidos (enum)
        if (Object.values(dificuldadeEnum).indexOf(dificuldade) == -1) {
            return false
        } else {
            return true
        }
    },
    validaIngredientes: (ingredientes) => {
        let validou = true;
        ingredientes.forEach(ingrediente => {
            //Checa se a unidade de medida está correta , pois são aceitos valores pré-definidos (enum)
            if (Object.values(unidadeEnum).indexOf(ingrediente.unidadeMedida) == -1) {
                validou = false;
            }
        })
        return validou;
    },
    uploadImageGetUrl: (file, nome, usuario) => {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject('No image file');
            }
            let newFileName = `${nome}-${usuario}_${Date.now()}`;
            console.log(newFileName);

            let fileUpload = bucket.file(newFileName);

            const blobStream = fileUpload.createWriteStream({
                metadata: {
                    contentType: 'image/jpeg'
                }
            });

            blobStream.on('error', (error) => {
                reject('Erro! Por favor tente novamente.');
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
    },
    getBase64: (file) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            return reader.result;
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    },
    base64ImageToBlob: (str) => {
        // extract content type and base64 payload from original string
        var pos = str.indexOf(';base64,');
        var type = str.substring(5, pos);
        var b64 = str.substr(pos + 8);

        // decode base64
        var imageContent = atob(b64);

        // create an ArrayBuffer and a view (as unsigned 8-bit)
        var buffer = new ArrayBuffer(imageContent.length);
        var view = new Uint8Array(buffer);

        // fill the view, using the decoded base64
        for (var n = 0; n < imageContent.length; n++) {
            view[n] = imageContent.charCodeAt(n);
        }

        // convert ArrayBuffer to Blob
        var blobImage = new Blob([buffer], { type: type });

        return blobImage;
    },
    multer: Multer({
        storage: Multer.memoryStorage(),
        limits: {
            fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
        }
    })
}
const express = require('express');

const router = express.Router();
const helper = require('../helpers');

// const Multer = require('multer');

// const multer = Multer({
//     storage: Multer.memoryStorage(),
//     limits: {
//         fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
//     }
// });

/*
!   /images
*/

/*
*  Upload da imagem para o firebase
*/

/**
 * Adding new file to the storage
 */
router.post('/upload', helper.multer.single('file'), (req, res) => {
  const { file } = req;

  if (file) {
    helper.uploadImageGetUrl(file).then((url) => {
      res.status(200).send({ url });
    }).catch((error) => {
      console.error(error);
    });
  }
});


module.exports = router;

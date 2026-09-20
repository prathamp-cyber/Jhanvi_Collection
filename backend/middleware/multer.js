import multer from 'multer'
import os from 'os'
import path from 'path'
import crypto from 'crypto'

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, os.tmpdir());
    },
    filename: function (req, file, callback) {
        const ext = path.extname(file.originalname);
        const randomName = crypto.randomUUID() + ext;
        callback(null, randomName);
    }
});

const fileFilter = (req, file, callback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error('Only JPEG, PNG, and WEBP image files are allowed'));
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 4
    },
    fileFilter
});

export default upload;
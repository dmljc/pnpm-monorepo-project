import * as multer from "multer";
import * as fs from 'fs';
import * as path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        try {
            fs.mkdirSync(path.join(process.cwd(), 'uploads'));
        } catch (e) { }

        cb(null, path.join(process.cwd(), 'uploads'))
    },
    filename: function (req, file, cb) {
        console.log('file===', file)
        const uniqueSuffix = Date.now() + '-' + file.originalname
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});

export { storage };

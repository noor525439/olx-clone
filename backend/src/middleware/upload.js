const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) ? ext : '.jpg';
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
  },
});

function fileFilter(_req, file, cb) {
  const ok = ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype);
  cb(ok ? null : new Error('Only jpg/png/webp images allowed'), ok);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 8 },
});

// For avatar: keep in memory so we can send buffer to Cloudinary
const memoryStorage = multer.memoryStorage();
const uploadAvatar = multer({
  storage: memoryStorage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
}).single('avatar');

module.exports = { upload, uploadAvatar };


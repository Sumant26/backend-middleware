import multer from "multer";
import path from "path";
import { mkdirSync } from "fs";

/**
 * File upload middleware powered by multer.
 *
 * Usage (per-route, NOT global):
 *
 *   import { uploadSingle, uploadMultiple, uploadFields } from "../middlewares/upload.middleware.js";
 *
 *   router.post("/avatar",  uploadSingle("avatar"),           controller);
 *   router.post("/gallery", uploadMultiple("photos", 5),      controller);
 *   router.post("/post",    uploadFields([{ name: "cover", maxCount: 1 }, { name: "attachments", maxCount: 5 }]), controller);
 *
 * Uploaded files are stored in /uploads/<fieldname>/ and accessible via req.file / req.files.
 */

// ─── Configuration ──────────────────────────────────────────────────────────

const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "application/pdf",
    "text/plain",
    "text/csv",
];

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE_MB || "5", 10) * 1024 * 1024; // default 5 MB
const UPLOAD_DIR   = process.env.UPLOAD_DIR || "uploads";

// ─── Storage engine ─────────────────────────────────────────────────────────

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(UPLOAD_DIR, file.fieldname);
        mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext       = path.extname(file.originalname).toLowerCase();
        const baseName  = path.basename(file.originalname, ext).replace(/\s+/g, "-");
        const unique    = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
        cb(null, `${baseName}-${unique}${ext}`);
    },
});

// ─── File filter ─────────────────────────────────────────────────────────────

const fileFilter = (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                `Unsupported file type "${file.mimetype}". Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`
            ),
            false
        );
    }
};

// ─── Multer instance ─────────────────────────────────────────────────────────

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE },
});

// ─── Exported helpers ────────────────────────────────────────────────────────

/** Single file upload  →  req.file */
const uploadSingle = (fieldName = "file") => upload.single(fieldName);

/** Multiple files (same field)  →  req.files (array) */
const uploadMultiple = (fieldName = "files", maxCount = 10) =>
    upload.array(fieldName, maxCount);

/** Mixed fields  →  req.files (object keyed by fieldname) */
const uploadFields = (fields = []) => upload.fields(fields);

export { uploadSingle, uploadMultiple, uploadFields };

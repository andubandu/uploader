const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const cloudinary = require("./cloudinary")

const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // pass the v2 cloudinary object
  params: {
    folder: "uploads",
    resource_type: "auto" // supports images, videos, documents
  }
})

const upload = multer({ storage })

module.exports = upload

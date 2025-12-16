const express = require("express")
const path = require("path")
const upload = require("./upload")
require("dotenv").config()
const mongoose = require("mongoose")
const File = require("./models/File")

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err))
const app = express()

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))

app.get("/", (req, res) => {
  res.render("index", { url: null })
})

app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded")

  const ext = req.file.originalname.split(".").pop().toLowerCase()

  let type = "document"
  if (["jpg","jpeg","png","gif"].includes(ext)) type = "image"
  else if (["mp4","mov","webm"].includes(ext)) type = "video"
  else if (["mp3","wav","ogg"].includes(ext)) type = "audio"

  const file = await File.create({
    name: req.file.filename,
    url: req.file.path,
    type
  })

  res.redirect(`/file?id=${file._id}`)
})
app.get("/file", async (req, res) => {
  const id = req.query.id
  if (!id) return res.status(400).send("Missing file id")

  const file = await File.findById(id)
  if (!file) return res.status(404).send("File not found")

  res.render("file", {
    url: file.url,
    filename: file.name
  })
})

app.listen(3000, () => console.log(`Server running on http://localhost:3000`))

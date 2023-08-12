require("dotenv").config();
const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

// CORS
var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// For the form in order for it not to crash/fail
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// Serve the React app
app.use(express.static(path.join(__dirname, "my-app", "build")));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "my-app", "build", "index.html"));
});

app.post("/submit", async (req, res) => {
  try {
    const formData = req.body;

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SECRET_USERNAME,
        pass: process.env.SECRET_KEY,
      },
    });

    let info = await transporter.sendMail({
      from: process.env.SECRET_USERNAME,
      to: process.env.SECRET_USERNAME2,
      subject: "Form Submission",
      html: `
        <h1>פרטי לקוח</h1>
        <p>Full name: ${formData.fullName} </p>
        <p>Phone number: ${formData.phone}</p>
        <p>Goal: ${formData.purpose}</p>
      `,
    });

    console.log(info.messageId);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending email");
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

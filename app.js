require("dotenv").config();
const express = require("express");
const streamRoutes = require("./routes/streamRoutes");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use("/stream", streamRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

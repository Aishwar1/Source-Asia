const express = require("express");

const requestRoutes = require("./routes/requestRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(express.json());

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
        return res.status(400).json({
            message: "Invalid JSON"
        });
    }

    next();
});

app.use("/", requestRoutes);
app.use("/", productRoutes);

app.get("/", (req, res) => {
    res.send("Source Asia Backend Assignment Running");
});

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
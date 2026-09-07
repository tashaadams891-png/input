const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.use("/admin", express.static("admin"));

// Submit information
app.post("/submit", (req, res) => {

const { name, email, phone, address, airport, message } = req.body;
console.log("NEW SUBMISSION");
console.log("Name:", name);
console.log("Email:", email);
console.log("Phone:", phone);
console.log("Address:", address);
console.log("Nearest Airport:", airport);


    let submissions = [];

    // Read existing submissions
    if (fs.existsSync("submissions.json")) {
        const file = fs.readFileSync("submissions.json", "utf8");

        if (file) {
            submissions = JSON.parse(file);
        }
    }

    // Add new submission
submissions.push({
    name,
    email,
    phone,
    address,
    airport,
    date: new Date().toLocaleString()
});

    // Save it
    fs.writeFileSync(
        "submissions.json",
        JSON.stringify(submissions, null, 2)
    );

    res.send("Information received successfully!");
});

// Send submissions to admin page
app.get("/submissions", (req, res) => {

    if (!fs.existsSync("submissions.json")) {
        return res.json([]);
    }

    const data = fs.readFileSync("submissions.json", "utf8");

    res.json(data ? JSON.parse(data) : []);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
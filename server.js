const express = require("express");
console.log("I AM RUNNING THIS SERVER.JS FILE");
console.log(__filename);
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", express.static(path.join(__dirname, "admin")));

const submissionsFile = path.join(__dirname, "submissions.json");

// Submit information
app.post("/submit", (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            address,
            airport
        } = req.body;

        console.log("NEW SUBMISSION");
        console.log("Name:", name);
        console.log("Email:", email);
        console.log("Phone:", phone);
        console.log("Address:", address);
        console.log("Nearest Airport:", airport);

        let submissions = [];

        // Read existing submissions
        if (fs.existsSync(submissionsFile)) {
            const file = fs.readFileSync(submissionsFile, "utf8").trim();

            if (file) {
                try {
                    submissions = JSON.parse(file);

                    if (!Array.isArray(submissions)) {
                        submissions = [];
                    }
                } catch (error) {
                    console.log("submissions.json was invalid. Starting fresh.");
                    submissions = [];
                }
            }
        }

        // Add new submission
        submissions.push({
            name: name || "",
            email: email || "",
            phone: phone || "",
            address: address || "",
            airport: airport || "",
            date: new Date().toLocaleString()
        });

        // Save submissions
        fs.writeFileSync(
            submissionsFile,
            JSON.stringify(submissions, null, 2),
            "utf8"
        );

        console.log("Submission saved successfully.");


res.redirect("/success.html");
    } catch (error) {
        console.error("SUBMISSION ERROR:", error);

        res.status(500).send("There was an error saving your information.");
    }
});


// Send submissions to admin page
app.get("/submissions", (req, res) => {
    try {
        if (!fs.existsSync(submissionsFile)) {
            return res.json([]);
        }

        const data = fs.readFileSync(submissionsFile, "utf8").trim();

        if (!data) {
            return res.json([]);
        }

        const submissions = JSON.parse(data);

        res.json(Array.isArray(submissions) ? submissions : []);

    } catch (error) {
        console.error("ERROR LOADING SUBMISSIONS:", error);
        res.status(500).json({
            error: "Could not load submissions"
        });
    }
});


// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});

app.post("/submit", async (req, res) => {

    const { name, email, message } = req.body;

    await submissions.insertOne({
        name: name,
        email: email,
        message: message,
        date: new Date()
    });

    res.send("Information submitted successfully");
});

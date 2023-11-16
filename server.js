const express = require("express");
const app = express();
const pool = require("./db");
const bcrypt = require("bcrypt")
const PORT = process.env.PORT;

app.use(express.json());
const {jwtGenMentor,jwtGenMentee} = require("./jwtGen")

app.get("/test",(req,res)=>{
  res.send("hello from docker")
})

app.post("/register", async (req, res) => {
  const {
    username,
    email,
    password,
    role,
    fullName,
    education,
    course,
    passingYear,
    dob,
    mobileNo,
    anyExperience,
  } = req.body;
  try {
    const user = await pool.query(
      "SELECT id FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );
    if (user.rowCount > 0) {
      res.status(409).json({ message: "User already exists." });
      return;
    }


    const saltRounds = 10;
const salt = await bcrypt.genSalt(saltRounds);
const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3,$4) RETURNING id",
      [username, email, hashedPassword, role]
    );
    const userId = newUser.rows[0].id;
    if (role === "mentor") {

      const token = jwtGenMentor(userId)
       await pool.query(
        "INSERT INTO mentors (user_id, full_name, education, dob, mobile_no, email, any_experience) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [userId, fullName, education, dob, mobileNo, email, anyExperience]
      );
      res
      .status(201)
      .json({ message: "Mentor registered successfully.", id: userId,token });
    } else if (role === "mentee") {
      const token = jwtGenMentor(userId)
      await pool.query(
        "INSERT INTO mentees (user_id, full_name, course, passing_year, dob, mobile_no, email, any_experience) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        [
          userId,
          fullName,
          course,
          passingYear,
          dob,
          mobileNo,
          email,
          anyExperience,
        ]
      );
      res
      .status(201)
      .json({ message: "Mentee registered successfully.", id: userId,token });
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).send("An error occurred while registering.");
  }
});

app.post("/login", async (req, res) => {
 
  const { email, password } = req.headers;

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Invalid Credential");
    }
    console.log(user.rows[0].password);
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.status(401).json("Invalid Credential");
    }
    const userId = user.rows[0].id;

    // need to put condition to gen tokens
    const jwtToken = jwtGenMentee(userId);
    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log("server started");
});

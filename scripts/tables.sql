CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('mentor', 'mentee'))
);



CREATE TABLE mentees (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  full_name VARCHAR(255),
  --education VARCHAR(255),
  course VARCHAR(255),
  passing_year VARCHAR(4),
  dob DATE,
  mobile_no VARCHAR(20),
  email VARCHAR(255),
  any_experience TEXT
);


CREATE TABLE mentors (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  full_name VARCHAR(255),
  education VARCHAR(255),
  dob DATE,
  mobile_no VARCHAR(20),
  email VARCHAR(255),
  any_experience TEXT
);

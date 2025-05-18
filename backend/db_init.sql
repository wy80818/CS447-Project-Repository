ALTER USER 'root'@'localhost' IDENTIFIED BY '0000';
FLUSH PRIVILEGES;

CREATE DATABASE IF NOT EXISTS therapist_scheduler_db;
USE therapist_scheduler_db;

CREATE TABLE IF NOT EXISTS administrator (
  adm_id INT PRIMARY KEY AUTO_INCREMENT,
  adm_name VARCHAR(50) NOT NULL,
  adm_user VARCHAR(50) NOT NULL,
  adm_email VARCHAR(50),
  verified BOOLEAN DEFAULT FALSE,
  verify_token VARCHAR(256),
  adm_pass VARCHAR(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS therapist (
  ther_id INT PRIMARY KEY AUTO_INCREMENT,
  adm_id INT,
  ther_name VARCHAR(50) NOT NULL,
  ther_age INT NOT NULL,
  ther_bday DATE NOT NULL,
  ther_user VARCHAR(50) NOT NULL,
  ther_pass VARCHAR(256) NOT NULL,
  ther_email VARCHAR(50) NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  verify_token VARCHAR(256),
  FOREIGN KEY (adm_id) REFERENCES administrator(adm_id)
);

CREATE TABLE IF NOT EXISTS adult_patient (
  apat_id INT PRIMARY KEY AUTO_INCREMENT,
  ther_id INT,
  apat_name VARCHAR(50) NOT NULL,
  apat_age INT NOT NULL,
  apat_bday DATE NOT NULL,
  apat_user VARCHAR(50) NOT NULL,
  apat_pass VARCHAR(256) NOT NULL,
  apat_addr VARCHAR(100) NOT NULL,
  apat_insur VARCHAR(50) NOT NULL,
  apat_primcare VARCHAR(50) NOT NULL,
  apat_email VARCHAR(50) NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  verify_token VARCHAR(256),
  FOREIGN KEY (ther_id) REFERENCES therapist(ther_id)
);

CREATE TABLE IF NOT EXISTS under_patient (
  upat_id INT PRIMARY KEY AUTO_INCREMENT,
  ther_id INT,
  upat_name VARCHAR(50) NOT NULL,
  upat_age INT NOT NULL,
  upat_bday DATE NOT NULL,
  upat_user VARCHAR(50) NOT NULL,
  upat_pass VARCHAR(256) NOT NULL,
  upat_addr VARCHAR(100) NOT NULL,
  upat_insur VARCHAR(50) NOT NULL,
  upat_primcare VARCHAR(50) NOT NULL,
  upat_email VARCHAR(50) NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  verify_token VARCHAR(256),
  FOREIGN KEY (ther_id) REFERENCES therapist(ther_id)
);

CREATE TABLE IF NOT EXISTS a_to_u_pat_relation (
  atupr_id INT PRIMARY KEY AUTO_INCREMENT,
  apat_id INT,
  upat_id INT,
  FOREIGN KEY (apat_id) REFERENCES adult_patient(apat_id),
  FOREIGN KEY (upat_id) REFERENCES under_patient(upat_id)
);

CREATE TABLE IF NOT EXISTS adult_appt (
  aappt_id INT PRIMARY KEY AUTO_INCREMENT,
  ther_id INT,
  apat_id INT,
  aappt_type VARCHAR(50) NOT NULL,
  aappt_date DATE NOT NULL,
  aappt_duration INT NOT NULL,
  aappt_addr VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'requested',
  FOREIGN KEY (ther_id) REFERENCES therapist(ther_id),
  FOREIGN KEY (apat_id) REFERENCES adult_patient(apat_id)
);

CREATE TABLE IF NOT EXISTS under_appt (
  uappt_id INT PRIMARY KEY AUTO_INCREMENT,
  ther_id INT,
  upat_id INT,
  uappt_type VARCHAR(50) NOT NULL,
  uappt_date DATE NOT NULL,
  uappt_duration INT NOT NULL,
  uappt_addr VARCHAR(100) NOT NULL,
  FOREIGN KEY (ther_id) REFERENCES therapist(ther_id),
  FOREIGN KEY (upat_id) REFERENCES under_patient(upat_id)
);

CREATE TABLE IF NOT EXISTS availability (
  id INT PRIMARY KEY AUTO_INCREMENT,
  therapist_id INT,
  date DATE,
  location VARCHAR(100),
  time_slot VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending',
  FOREIGN KEY (therapist_id) REFERENCES therapist(ther_id)
);

CREATE TABLE IF NOT EXISTS therapist_rating (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ther_id INT,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ther_id) REFERENCES therapist(ther_id) ON DELETE CASCADE
);

INSERT INTO administrator (adm_name, adm_user, adm_pass)
VALUES ("LOL", "admin", "9af15b336e6a9619928537df30b2e6a2376569fcf9d7e773eccede65606529a0");
INSERT INTO therapist (adm_id, ther_name, ther_age, ther_bday, ther_user, ther_pass, ther_email)
VALUES (1, "John Doe", 30, "1993-01-01", "johndoe", "9af15b336e6a9619928537df30b2e6a2376569fcf9d7e773eccede65606529a0", "johndoe@example.com");
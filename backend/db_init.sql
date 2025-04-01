CREATE DATABASE therapist_scheduler_db;
USE therapist_scheduler_db;
CREATE TABLE adult_patient  (
	apat_id int PRIMARY KEY AUTO_INCREMENT,
    apat_name varchar(50) NOT NULL,
    apat_age int NOT NULL,
    apat_bday int NOT NULL,
    apat_user varchar(50) NOT NULL,
    apat_pass varchar(200) NOT NULL,
    apat_addr varchar(100) NOT NULL,
    apat_insur varchar(50) NOT NULL,
    apat_primcare varchar(50) NOT NULL,
    apat_email varchar(50) NOT NULL
);
CREATE TABLE under_patient  (
	upat_id int PRIMARY KEY AUTO_INCREMENT,
    upat_name varchar(50) NOT NULL,
    upat_age int NOT NULL,
    upat_bday int NOT NULL,
    upat_user varchar(50) NOT NULL,
    upat_pass varchar(200) NOT NULL,
    upat_addr varchar(100) NOT NULL,
    upat_insur varchar(50) NOT NULL,
    upat_primcare varchar(50) NOT NULL,
    upat_email varchar(50) NOT NULL
);
CREATE TABLE therapist  (
	ther_id int PRIMARY KEY AUTO_INCREMENT,
    adm_id int,
    ther_name varchar(50) NOT NULL,
    ther_age int NOT NULL,
    ther_bday int NOT NULL,
    ther_user varchar(50) NOT NULL,
    ther_pass varchar(100) NOT NULL,
    ther_email varchar(50) NOT NULL,
    FOREIGN KEY (adm_id) REFERENCES adminstrator(adm_id)
);
CREATE TABLE administrator  (
	adm_id int PRIMARY KEY AUTO_INCREMENT,
    adm_name varchar(50) NOT NULL,
    adm_user varchar(50) NOT NULL,
    adm_pass varchar(50) NOT NULL
);
CREATE TABLE a_to_u_pat_relation  (
	atupr_id int PRIMARY KEY AUTO_INCREMENT,
    apat_id int,
    upat_id int,
    FOREIGN KEY (apat_id) REFERENCES adult_patient(apat_id),
    FOREIGN KEY (upat_id) REFERENCES under_patient(upat_id)
);
CREATE TABLE adult_appt  (
	aappt_id int PRIMARY KEY AUTO_INCREMENT,
    ther_id int,
    apat_id int,
    aappt_type varchar(50) NOT NULL,
    aappt_time int NOT NULL,
    aappt_duration int NOT NULL,
    aappt_addr varchar(100) NOT NULL,
    FOREIGN KEY (ther_id) REFERENCES therapist(ther_id),
    FOREIGN KEY (apat_id) REFERENCES adult_patient(apat_id)
);
CREATE TABLE under_appt  (
	uappt_id int PRIMARY KEY AUTO_INCREMENT,
    ther_id int,
    upat_id int,
    uappt_type varchar(50) NOT NULL,
    uappt_time int NOT NULL,
    uappt_duration int NOT NULL,
    uappt_addr varchar(100) NOT NULL,
    FOREIGN KEY (ther_id) REFERENCES therapist(ther_id),
    FOREIGN KEY (upat_id) REFERENCES under_patient(upat_id)
);
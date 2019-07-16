DROP DATABASE IF EXISTS automationgo;
CREATE DATABASE automationgo;
USE automationgo;

CREATE TABLE ip (
  ID tinyint(2) NOT NULL UNIQUE,
  IP varchar(20) NOT NULL,
  name varchar(15) NOT NULL,
  PRIMARY KEY (ID)
);

INSERT INTO ip
  (ID, IP, name)
VALUES
  (1, "0", "Adastral"), (2, "1", "Glasgow");

CREATE TABLE devices (
  ID INT AUTO_INCREMENT UNIQUE NOT NULL,
  name varchar(100) NOT NULL,
  model_name varchar(100) NOT NULL,
  port INT NOT NULL UNIQUE,
  os varchar(45) NOT NULL,
  os_version varchar(100) NOT NULL,
  connection tinyint(2) NOT NULL,
  ip_id tinyint(2) NOT NULL,
  PRIMARY KEY(ID),
  FOREIGN KEY(ip_id) REFERENCES ip(ID)
);

CREATE TABLE sims (
  imein_number INT NOT NULL UNIQUE,
  sim_serial_number INT NOT NULL UNIQUE,
  device varchar(100) NOT NULL,
  model varchar(100) NOT NULL,
  product varchar(100) NOT NULL,
  PRIMARY KEY (sim_serial_number)
);

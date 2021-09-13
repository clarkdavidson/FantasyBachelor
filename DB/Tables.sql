drop database if exists FantasyBachelor;
create database FantasyBachelor;
use FantasyBachelor;

create table Contestants (
   id int auto_increment PRIMARY KEY,
   firstName VARCHAR(40) not NULL,
   lastName VARCHAR(40) not NULL,
   picture VARCHAR(40) not NULL,
   score int,
   UNIQUE KEY(id)
);

create table Teams (
   id int auto_increment PRIMARY KEY,
   teamName VARCHAR(40) not NULL
);

create table Picks (
   contestantId int,
   teamId int,
   FOREIGN KEY (contestantId) REFERENCES Contestants(id),
   FOREIGN KEY (teamId) REFERENCES Teams(id),
   UNIQUE(contestantId, teamId)
);


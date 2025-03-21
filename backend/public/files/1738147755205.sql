-- CREATE TABLE authors(
-- authorId INT AUTO_INCREMENT ,
-- authorName varchar(50),
-- DOB varchar(50),
-- nationality VARCHAR(50),
-- PRIMARY KEY (authorId)); 

CREATE TABLE publishers(
pubisherId INT ,
publisherName VARCHAR(100),
address varchar(100),
PRIMARY KEY (publisherId);

CREATE TABLE books(
bookId  INT ,
title VARCHAR(100),
authorId INT,
publisherId INT,
publishedYear VARCHAR(50),
isbnNo INT UNIQUE,
price INT,
PRIMARY KEY (bookId),dbclass
FOREIGN KEY (publisherId) REFERENCES publishers(publisherId),
FOREIGN KEY (authorId) REFERENCES authors(authorId));
-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 13, 2019 at 06:20 PM
-- Server version: 10.1.37-MariaDB
-- PHP Version: 7.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `acclimate`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounttype`
--

CREATE TABLE `accounttype` (
  `type` char(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `accounttype`
--

INSERT INTO `accounttype` (`type`) VALUES
('Admin'),
('Mentee'),
('Mentor'),
('Therapist');

-- --------------------------------------------------------

--
-- Table structure for table `chatlog`
--

CREATE TABLE `chatlog` (
  `chatID` smallint(6) NOT NULL,
  `log` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `chatlog`
--

INSERT INTO `chatlog` (`chatID`, `log`) VALUES
(1, 'Hey whats up: Not much You?:,yo,yo,brap brap brap,heeeeeeeeeeeeey');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `cCode` varchar(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`cCode`) VALUES
('AFU'),
('AHPD'),
('BSPQ'),
('CAIS'),
('CAM'),
('CASE'),
('CPSS'),
('DS'),
('ECE'),
('GCDA'),
('GCTC'),
('ICE'),
('ME'),
('MEPM'),
('MEQ'),
('MHRM'),
('MINT'),
('PSYE');

-- --------------------------------------------------------

--
-- Table structure for table `interests`
--

CREATE TABLE `interests` (
  `id` int(11) NOT NULL,
  `interest` char(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `interests`
--

INSERT INTO `interests` (`id`, `interest`) VALUES
(0, 'Anime'),
(1, 'Archery'),
(2, 'Art'),
(3, 'Fashion'),
(4, 'Fishing'),
(5, 'Football'),
(6, 'Gaming'),
(7, 'Graphic Design'),
(8, 'Horse Riding'),
(9, 'Jigsaw Puzzles'),
(10, 'Knitting'),
(11, 'Listening to music'),
(12, 'Martial Arts'),
(13, 'MMA'),
(14, 'Model Building'),
(15, 'Paintball'),
(16, 'Photography'),
(17, 'Programming'),
(18, 'Puzzles'),
(19, 'Reading'),
(20, 'Record Collecting'),
(21, 'Role Playing'),
(22, 'Rugby'),
(23, 'Running'),
(24, 'Singing'),
(25, 'Traveling'),
(26, 'WWE'),
(35, 'Roman');

-- --------------------------------------------------------

--
-- Table structure for table `meetings`
--

CREATE TABLE `meetings` (
  `id` smallint(20) NOT NULL,
  `pairing` smallint(6) NOT NULL,
  `date` tinytext NOT NULL,
  `time` varchar(8) NOT NULL,
  `description` tinytext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `meetings`
--

INSERT INTO `meetings` (`id`, `pairing`, `date`, `time`, `description`) VALUES
(20, 3, '2019-03-03', '23:34', 'asdf');

-- --------------------------------------------------------

--
-- Table structure for table `pairings`
--

CREATE TABLE `pairings` (
  `id` smallint(6) NOT NULL,
  `mentorID` int(8) NOT NULL,
  `menteeID` int(8) NOT NULL,
  `chatlog` smallint(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `pairings`
--

INSERT INTO `pairings` (`id`, `mentorID`, `menteeID`, `chatlog`) VALUES
(4, 15634237, 14894286, NULL),
(5, 18362222, 16368729, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `userinterests`
--

CREATE TABLE `userinterests` (
  `userid` int(8) NOT NULL,
  `interestid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `userinterests`
--

INSERT INTO `userinterests` (`userid`, `interestid`) VALUES
(14368179, 12),
(14368179, 19),
(14368179, 24),
(14894286, 6),
(14894286, 11),
(14894286, 20),
(15108149, 4),
(15108149, 6),
(15108149, 16),
(15634237, 8),
(15634237, 11),
(15634237, 20),
(16368729, 16),
(16368729, 17),
(16368729, 19),
(16953477, 12),
(16953477, 19),
(16953477, 24),
(17108152, 6),
(17108152, 11),
(17108152, 23),
(18362222, 3),
(18362222, 7),
(18362222, 17),
(18636578, 4),
(18636578, 6),
(18636578, 16);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(8) NOT NULL,
  `fname` tinytext NOT NULL,
  `lname` tinytext NOT NULL,
  `email` tinytext NOT NULL,
  `password` varchar(500) NOT NULL,
  `accounttype` char(20) NOT NULL,
  `photo` blob,
  `gender` tinytext,
  `ccode` varchar(4) NOT NULL,
  `year` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fname`, `lname`, `email`, `password`, `accounttype`, `photo`, `gender`, `ccode`, `year`) VALUES
(14368179, 'Alice', 'Young', 'alice@mail.com', '2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b', 'Mentor', NULL, 'Female', 'MINT', 3),
(14894286, 'Niall', 'Ford', 'fordy@mail.com', '2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b', 'Mentee', NULL, 'Male', 'DS', 1),
(15108149, 'John', 'Bulger', 'john@mail.com', '2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b', 'Mentor', NULL, 'Male', 'CASE', 2),
(15634237, 'Megan', 'Caroll', 'meg@mail.com', '2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b', 'Mentor', NULL, 'Female', 'PSYE', 4),
(16368729, 'Connor', 'Duncan', 'conman@mail.com', '2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b', 'Mentee', NULL, 'Male', 'PSYE', 1),
(16953477, 'Rob', 'Stark', 'rob@mail.com', '2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b', 'Mentee', NULL, 'Male', 'CASE', 1),
(17108152, 'Jamie', 'Hyland', 'Jamiehyland01@gmail.com', 'cc3dc71fc2307609347f3d181d143b60bd33e8922044c0dff601859b5bfeb7ff', 'Admin', NULL, 'Male', 'CASE', 0),
(18362222, 'Rebekah', 'McAllistar ', 'rebekah@mail.com', '2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b', 'Mentor', NULL, 'Female', 'DS', 2),
(18636578, 'Jenna', 'Boyle', 'jenna@mail.com', '2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b', 'Mentee', NULL, 'Female', 'CASE', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounttype`
--
ALTER TABLE `accounttype`
  ADD PRIMARY KEY (`type`);

--
-- Indexes for table `chatlog`
--
ALTER TABLE `chatlog`
  ADD PRIMARY KEY (`chatID`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`cCode`);

--
-- Indexes for table `interests`
--
ALTER TABLE `interests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `meetings`
--
ALTER TABLE `meetings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pairing` (`pairing`);

--
-- Indexes for table `pairings`
--
ALTER TABLE `pairings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mentorID` (`mentorID`,`menteeID`),
  ADD KEY `chatlog` (`chatlog`),
  ADD KEY `menteeID` (`menteeID`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `userinterests`
--
ALTER TABLE `userinterests`
  ADD PRIMARY KEY (`userid`,`interestid`),
  ADD KEY `userid` (`userid`,`interestid`),
  ADD KEY `interestid` (`interestid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `accounttype` (`accounttype`),
  ADD KEY `ccode` (`ccode`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chatlog`
--
ALTER TABLE `chatlog`
  MODIFY `chatID` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `meetings`
--
ALTER TABLE `meetings`
  MODIFY `id` smallint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `pairings`
--
ALTER TABLE `pairings`
  MODIFY `id` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18636579;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `meetings`
--
ALTER TABLE `meetings`
  ADD CONSTRAINT `meetings_ibfk_1` FOREIGN KEY (`pairing`) REFERENCES `pairings` (`id`);

--
-- Constraints for table `pairings`
--
ALTER TABLE `pairings`
  ADD CONSTRAINT `pairings_ibfk_3` FOREIGN KEY (`chatlog`) REFERENCES `chatlog` (`chatID`),
  ADD CONSTRAINT `pairings_ibfk_4` FOREIGN KEY (`menteeID`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `pairings_ibfk_5` FOREIGN KEY (`mentorID`) REFERENCES `users` (`id`);

--
-- Constraints for table `userinterests`
--
ALTER TABLE `userinterests`
  ADD CONSTRAINT `userinterests_ibfk_2` FOREIGN KEY (`interestid`) REFERENCES `interests` (`id`),
  ADD CONSTRAINT `userinterests_ibfk_3` FOREIGN KEY (`userid`) REFERENCES `users` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`accounttype`) REFERENCES `accounttype` (`type`),
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`ccode`) REFERENCES `courses` (`cCode`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

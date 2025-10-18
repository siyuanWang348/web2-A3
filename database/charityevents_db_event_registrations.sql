-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: localhost    Database: charityevents_db
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `event_registrations`
--

DROP TABLE IF EXISTS `event_registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_registrations` (
  `registration_id` INT NOT NULL AUTO_INCREMENT,
  `event_id` INT NOT NULL,
  `user_name` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_email` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_phone` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `tickets` INT NOT NULL DEFAULT 1,
  `notes` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `registered_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`registration_id`),
  UNIQUE KEY `unique_event_user` (`event_id`, `user_email`),
  CONSTRAINT `fk_event_registrations_event` FOREIGN KEY (`event_id`) REFERENCES `charity_events` (`event_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_registrations`
--

LOCK TABLES `event_registrations` WRITE;
/*!40000 ALTER TABLE `event_registrations` DISABLE KEYS */;
INSERT INTO `event_registrations` (event_id, user_name, user_email, user_phone, tickets, notes, registered_at) VALUES (1, 'Emma Thompson', 'emma.thompson@gmail.com', '+61 412 345 678', 2, 'Joining with my friend Lucy for the 5km run.', '2025-10-15 09:34:22'), (1, 'Liam Nguyen', 'liam.nguyen@outlook.com', '+61 430 998 122', 1, 'First time joining a charity marathon!', '2025-10-16 11:20:45'), (2, 'Sophie Tan', 'sophie.tan@yahoo.com', '+61 420 665 901', 3, 'Volunteering with my company team.', '2025-10-13 15:18:10'), (2, 'Michael Brown', 'michael.brown@gmail.com', '+61 403 222 119', 1, 'Looking forward to helping at the food stall.', '2025-10-14 10:55:39'), (3, 'Hiroshi Sato', 'hiroshi.sato@example.jp', '+81 80-1234-5678', 1, 'I love spending time with rescued animals.', '2025-10-10 13:12:00'), (3, 'Yuki Nakamura', 'yuki.nakamura@gmail.com', '+81 70-4567-8910', 2, 'Bringing my daughter along.', '2025-10-11 09:44:33'), (4, 'Rachel Lim', 'rachel.lim@singnet.sg', '+65 9102 3344', 1, 'Hope to make the beach a cleaner place!', '2025-10-12 08:20:15'), (4, 'Aaron Ong', 'aaron.ong@gmail.com', '+65 9234 8765', 2, 'Joining with my brother.', '2025-10-13 14:37:20'), (5, 'Chloe Wong', 'chloe.wong@yahoo.com', '+852 9123 4567', 1, 'I donate blood regularly.', '2025-10-11 16:12:58'), (6, 'Kenji Mori', 'kenji.mori@outlook.jp', '+81 90-9876-5432', 1, 'Visiting the nursing home as part of my volunteer club.', '2025-10-09 17:10:42');
/*!40000 ALTER TABLE `event_registrations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-04  0:59:05

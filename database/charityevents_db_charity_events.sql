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
-- Table structure for table `charity_events`
--

DROP TABLE IF EXISTS `charity_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `charity_events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `event_date` datetime NOT NULL,
  `location` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ticket_price` decimal(10,2) DEFAULT '0.00',
  `is_active` tinyint DEFAULT '1',
  `charity_goal` decimal(15,2) NOT NULL,
  `current_progress` decimal(15,2) DEFAULT '0.00',
  `org_id` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  PRIMARY KEY (`event_id`),
  KEY `org_id` (`org_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `charity_events_ibfk_1` FOREIGN KEY (`org_id`) REFERENCES `charity_organizations` (`org_id`),
  CONSTRAINT `charity_events_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `event_categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `charity_events`
--

LOCK TABLES `charity_events` WRITE;
/*!40000 ALTER TABLE `charity_events` DISABLE KEYS */;
INSERT INTO `charity_events` VALUES (1,'Rural Education Charity Run','5km family-friendly run with all entry fees funding library corners in rural schools. Finishers get custom medals.','2025-11-16 08:30:00','City Central Park Main Track',50.00,1,120000.00,75000.00,1,1),(2,'Life Guardian Charity Gala','Includes charity auction (artworks, medical check-up packages) and speeches by first-aid experts. Funds go to rural first-aid station equipment.','2025-10-25 19:00:00','International Hotel Ballroom',288.00,1,250000.00,160000.00,2,2),(3,'Eco-Restoration Workshop','Environmental experts teach vegetation replanting and soil improvement. Volunteers will practice in urban wilderness parks after training.','2025-11-08 09:30:00','Eco-Tech Park Training Room',0.00,1,60000.00,38000.00,3,3),(4,'Rural Education Exhibition','200+ photos and 5 short films showcasing rural education challenges. On-site sign-up for \"one-on-one student sponsorship\".','2025-10-31 10:00:00','City Culture Exhibition Hall Hall 1',0.00,1,45000.00,22000.00,1,4),(5,'First-Aid Charity Mini Run','3km casual run. $10 donated per participant for community first-aid kit supplies. Free first-aid manuals provided on-site.','2025-12-08 09:00:00','Riverside Fitness Trail',30.00,1,80000.00,52000.00,2,1),(6,'Green Future Charity Night','Auction of eco-art (recycled material sculptures) and eco-travel packages. Funds support endangered bird habitat protection.','2025-12-20 18:30:00','Forest Resort Lake View Hall',198.00,1,180000.00,105000.00,3,2),(7,'Rural Teachers Multimedia Training','Covers PPT design and online teaching tools to enhance classroom interaction. Free training materials provided.','2025-11-23 10:00:00','City Teacher Development Center 3F',0.00,1,70000.00,45000.00,1,3),(8,'Community First-Aid Day','Live demos of CPR and wound dressing. Free blood pressure checks and first-aid guide leaflets distributed.','2025-11-10 14:00:00','Sunny Community Square',0.00,1,50000.00,32000.00,2,4);
/*!40000 ALTER TABLE `charity_events` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-04  0:59:04

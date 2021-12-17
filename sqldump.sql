-- MySQL dump 10.14  Distrib 5.5.68-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: culinari_db
-- ------------------------------------------------------
-- Server version	5.5.68-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `culinari_comment`
--

DROP TABLE IF EXISTS `culinari_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `culinari_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `recipe_id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `text` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `recipe_id` (`recipe_id`),
  KEY `author_id` (`author_id`),
  CONSTRAINT `culinari_comment_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `culinari_recipe` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `culinari_comment_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `culinari_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `culinari_comment`
--

LOCK TABLES `culinari_comment` WRITE;
/*!40000 ALTER TABLE `culinari_comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `culinari_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `culinari_commentLike`
--

DROP TABLE IF EXISTS `culinari_commentLike`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `culinari_commentLike` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `comment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `comment_id` (`comment_id`),
  CONSTRAINT `culinari_commentLike_ibfk_1` FOREIGN KEY (`comment_id`) REFERENCES `culinari_comment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `culinari_commentLike`
--

LOCK TABLES `culinari_commentLike` WRITE;
/*!40000 ALTER TABLE `culinari_commentLike` DISABLE KEYS */;
/*!40000 ALTER TABLE `culinari_commentLike` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `culinari_ingredient`
--

DROP TABLE IF EXISTS `culinari_ingredient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `culinari_ingredient` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `culinari_ingredient`
--

LOCK TABLES `culinari_ingredient` WRITE;
/*!40000 ALTER TABLE `culinari_ingredient` DISABLE KEYS */;
INSERT INTO `culinari_ingredient` VALUES (91,'test','2021-12-17 08:21:15','2021-12-17 08:21:15');
/*!40000 ALTER TABLE `culinari_ingredient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `culinari_like`
--

DROP TABLE IF EXISTS `culinari_like`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `culinari_like` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `recipe_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userRecipeIndex` (`recipe_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `culinari_like_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `culinari_recipe` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `culinari_like_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `culinari_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `culinari_like`
--

LOCK TABLES `culinari_like` WRITE;
/*!40000 ALTER TABLE `culinari_like` DISABLE KEYS */;
/*!40000 ALTER TABLE `culinari_like` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `culinari_picture`
--

DROP TABLE IF EXISTS `culinari_picture`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `culinari_picture` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `recipe_id` int(11) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `order` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `recipe_id` (`recipe_id`),
  CONSTRAINT `culinari_picture_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `culinari_recipe` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `culinari_picture`
--

LOCK TABLES `culinari_picture` WRITE;
/*!40000 ALTER TABLE `culinari_picture` DISABLE KEYS */;
/*!40000 ALTER TABLE `culinari_picture` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `culinari_recipe`
--

DROP TABLE IF EXISTS `culinari_recipe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `culinari_recipe` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `desc` varchar(255) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `forked_from` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `owner_id` (`owner_id`),
  KEY `forked_from` (`forked_from`),
  CONSTRAINT `culinari_recipe_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `culinari_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `culinari_recipe_ibfk_2` FOREIGN KEY (`forked_from`) REFERENCES `culinari_recipe` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `culinari_recipe`
--

LOCK TABLES `culinari_recipe` WRITE;
/*!40000 ALTER TABLE `culinari_recipe` DISABLE KEYS */;
/*!40000 ALTER TABLE `culinari_recipe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `culinari_recipeIngredient`
--

DROP TABLE IF EXISTS `culinari_recipeIngredient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `culinari_recipeIngredient` (
  `amount` float NOT NULL,
  `unit` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `culinariRecipeId` int(11) NOT NULL DEFAULT '0',
  `culinariIngredientId` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`culinariRecipeId`,`culinariIngredientId`),
  KEY `culinariIngredientId` (`culinariIngredientId`),
  CONSTRAINT `culinari_recipeIngredient_ibfk_1` FOREIGN KEY (`culinariRecipeId`) REFERENCES `culinari_recipe` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `culinari_recipeIngredient_ibfk_2` FOREIGN KEY (`culinariIngredientId`) REFERENCES `culinari_ingredient` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `culinari_recipeIngredient`
--

LOCK TABLES `culinari_recipeIngredient` WRITE;
/*!40000 ALTER TABLE `culinari_recipeIngredient` DISABLE KEYS */;
/*!40000 ALTER TABLE `culinari_recipeIngredient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `culinari_step`
--

DROP TABLE IF EXISTS `culinari_step`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `culinari_step` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order` int(11) NOT NULL,
  `unit` varchar(255) DEFAULT NULL,
  `recipe_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `recipe_id` (`recipe_id`),
  CONSTRAINT `culinari_step_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `culinari_recipe` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `culinari_step`
--

LOCK TABLES `culinari_step` WRITE;
/*!40000 ALTER TABLE `culinari_step` DISABLE KEYS */;
/*!40000 ALTER TABLE `culinari_step` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `culinari_user`
--

DROP TABLE IF EXISTS `culinari_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `culinari_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `culinari_user`
--

LOCK TABLES `culinari_user` WRITE;
/*!40000 ALTER TABLE `culinari_user` DISABLE KEYS */;
INSERT INTO `culinari_user` VALUES (1,'Admin','$2a$10$BR3WA8q2d1ru7P7sHgL.6uCrP2mlXsqkpRRKamG2q2YV4ljbqM8ca','culinariadmin@mail.fi',1,0,NULL,'2021-12-17 08:16:26','2021-12-17 08:16:26'),(2,'Mindy Reichel Sr.','$2a$10$x6zgXhXJ9IjXJqqf0Sf9w.pyOU1kSZVMwVNDK9yK60JIzBgQg82Pm','Willie39@hotmail.com',0,0,NULL,'2021-12-17 08:16:26','2021-12-17 08:16:26'),(3,'Tony Larkin','$2a$10$efQpVhqDFnZ4UfLBh2PjzOSZLX2B7MpYviqmAFpF.MSW3XNRm0V7W','Aileen.Altenwerth25@hotmail.com',0,0,NULL,'2021-12-17 08:16:26','2021-12-17 08:16:26'),(4,'Paula Weissnat','$2a$10$iOLMMCMLxC3r5S8lpFFZ9u8x.2p8Ae14ssbVD0JKClOWPwy/vBagO','Geraldine40@hotmail.com',0,0,NULL,'2021-12-17 08:16:26','2021-12-17 08:16:26'),(5,'Mrs. Clay Gleason','$2a$10$K45X3LBmnTrY2lCOljRg..SWQq0z6nPHWGYcM4wyt/6ZZOaKbAtcS','Amy.Littel40@hotmail.com',0,0,NULL,'2021-12-17 08:16:26','2021-12-17 08:16:26'),(6,'Stacey Bahringer','$2a$10$h2zuAOLIuEgs1Cup/Em3COn5dXN1AxK4mdHPm9yIHYG3.wCRV5Nz.','Vern.Smith@hotmail.com',0,0,NULL,'2021-12-17 08:16:27','2021-12-17 08:16:27'),(7,'Flora Erdman','$2a$10$3yx.eW0n8h8NUqj61P7WT.KrxjeFZDDNPDkIhFqdpfI7H.jkVr972','Jammie.Watsica@hotmail.com',0,0,NULL,'2021-12-17 08:16:27','2021-12-17 08:16:27'),(8,'Gerald Flatley V','$2a$10$zzPrbuI6I8pCJrew8ETRaeGxyCyIh5klSSZf6z2pojGA609x3oszq','Maximillia.Wunsch@gmail.com',0,0,NULL,'2021-12-17 08:16:27','2021-12-17 08:16:27'),(9,'Dr. Leslie Rosenbaum','$2a$10$AaKuOSF3XEtNWdzGPOk2DO3PKarKYjZxkzD0z.qiDhvtd9AyLJ6PS','Kaley_Oberbrunner@hotmail.com',0,0,NULL,'2021-12-17 08:16:27','2021-12-17 08:16:27'),(10,'Miss Perry Sporer','$2a$10$UmoHZgxpc9MLm4e41TIAnO7FFuq1dHpuqBjo7y9YkcKNZLzgt9jna','Willard.Smith@gmail.com',0,0,NULL,'2021-12-17 08:16:27','2021-12-17 08:16:27'),(11,'Pauline Tromp','$2a$10$l89u84f6GeKr3gKvpXKXsuVLlwcnhOCY0KUHhjKT85nqZrFTt3JWK','Leopoldo.Kuvalis@gmail.com',0,0,NULL,'2021-12-17 08:16:28','2021-12-17 08:16:28'),(12,'Miika','$2a$10$LnOLTzgN6UYvBxk6.DsXtu2a9cA.2bSNGiLXntAkTp.YzqZzm2PM.','miika@maikki.com',0,0,'1639729922747-514021942.jpg','2021-12-17 08:20:20','2021-12-17 08:32:02');
/*!40000 ALTER TABLE `culinari_user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-12-17 10:59:39

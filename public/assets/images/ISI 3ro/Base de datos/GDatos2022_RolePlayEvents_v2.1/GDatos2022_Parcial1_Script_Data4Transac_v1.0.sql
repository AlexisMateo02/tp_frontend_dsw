-- MySQL dump 10.13  Distrib 8.0.29, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: role_play_events
-- ------------------------------------------------------
-- Server version	8.0.25-15

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
-- Dumping data for table `actividad`
--

LOCK TABLES `actividad` WRITE;
/*!40000 ALTER TABLE `actividad` DISABLE KEYS */;
INSERT INTO `actividad` VALUES (404040,111,'The struggle for Trost','Equipo de maniobras tridimensionales'),(414141,222,'Raid on Liberio','Equipo de maniobras tridimensionales'),(414141,333,'Almuerzo','Cuchillo, tenedor y plato');
/*!40000 ALTER TABLE `actividad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `asistente`
--

LOCK TABLES `asistente` WRITE;
/*!40000 ALTER TABLE `asistente` DISABLE KEYS */;
INSERT INTO `asistente` VALUES (95959595,'Shinichi','Kudo','+959-59595959');
/*!40000 ALTER TABLE `asistente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `asistente_contrato`
--

LOCK TABLES `asistente_contrato` WRITE;
/*!40000 ALTER TABLE `asistente_contrato` DISABLE KEYS */;
INSERT INTO `asistente_contrato` VALUES (95959595,5555,99999999999,'2022-09-12 11:30:00'),(95959595,5757,99999999999,'2022-09-19 13:30:00');
/*!40000 ALTER TABLE `asistente_contrato` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES (99999999999,'SG-1','sgc@usaf.com','+999-999999999','Cheyene Mountain 1997','Empresa de turismo');
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `contrata`
--

LOCK TABLES `contrata` WRITE;
/*!40000 ALTER TABLE `contrata` DISABLE KEYS */;
INSERT INTO `contrata` VALUES (5555,99999999999,'2022-09-12 11:30:00',1996.000,5,323232),(5757,99999999999,'2022-09-19 13:30:00',2010.000,15,333333);
/*!40000 ALTER TABLE `contrata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `costo`
--

LOCK TABLES `costo` WRITE;
/*!40000 ALTER TABLE `costo` DISABLE KEYS */;
/*!40000 ALTER TABLE `costo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `descuento`
--

LOCK TABLES `descuento` WRITE;
/*!40000 ALTER TABLE `descuento` DISABLE KEYS */;
/*!40000 ALTER TABLE `descuento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `empleado`
--

LOCK TABLES `empleado` WRITE;
/*!40000 ALTER TABLE `empleado` DISABLE KEYS */;
INSERT INTO `empleado` VALUES (86868686868,'Gon','Freeks','+868-686868686','hunter','guia'),(87878787878,'Inosuke','Hashibira','+878-787878787','kouhai','guia'),(88888888888,'Erwin','Smith','+888-888888888','comander','encargado'),(89898989898,'Bertolt','Hoover','+898-898989898','traitor','encargado');
/*!40000 ALTER TABLE `empleado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `escala`
--

LOCK TABLES `escala` WRITE;
/*!40000 ALTER TABLE `escala` DISABLE KEYS */;
INSERT INTO `escala` VALUES (5555,'2022-10-28 09:00:00','2022-10-28 14:30:00',404040,111,88888888888),(5555,'2022-10-28 15:00:00','2022-10-28 16:00:00',414141,333,88888888888),(5757,'2022-10-29 09:30:00','2022-10-29 14:00:00',414141,222,88888888888),(5858,'2023-01-04 13:00:00','2023-01-04 18:30:00',404040,111,89898989898);
/*!40000 ALTER TABLE `escala` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `idioma`
--

LOCK TABLES `idioma` WRITE;
/*!40000 ALTER TABLE `idioma` DISABLE KEYS */;
INSERT INTO `idioma` VALUES (303030,'Ingles'),(313131,'Frances'),(323232,'Japones'),(333333,'Aleman');
/*!40000 ALTER TABLE `idioma` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `idioma_guia`
--

LOCK TABLES `idioma_guia` WRITE;
/*!40000 ALTER TABLE `idioma_guia` DISABLE KEYS */;
/*!40000 ALTER TABLE `idioma_guia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `locacion`
--

LOCK TABLES `locacion` WRITE;
/*!40000 ALTER TABLE `locacion` DISABLE KEYS */;
INSERT INTO `locacion` VALUES (404040,'Trost','SNK',POINT(31.764444, -106.499444),'West Yandell Drive 1013'),(414141,'Liberio','SNK',POINT(41.8975, 12.498611),'Piazza di Santa Maria Maggiore');
/*!40000 ALTER TABLE `locacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `salario_hora`
--

LOCK TABLES `salario_hora` WRITE;
/*!40000 ALTER TABLE `salario_hora` DISABLE KEYS */;
/*!40000 ALTER TABLE `salario_hora` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `tour`
--

LOCK TABLES `tour` WRITE;
/*!40000 ALTER TABLE `tour` DISABLE KEYS */;
INSERT INTO `tour` VALUES (5555,'2022-10-27 10:00:00','2022-10-30 19:00:00','Tropical Land Park',1996.000,'Coaster','SNK',87878787878),(5656,'2022-11-03 11:00:00','2022-11-07 15:00:00','Whale Island',1998.000,'Kaijinmaru','Hunter X',86868686868),(5757,'2022-11-07 10:30:00','2022-11-13 17:30:00','Resembool',2001.000,'Mustang','SNK',87878787878),(5858,'2023-01-03 11:20:00','2022-01-07 12:00:00','Harvard',2008.000,'Lincoln','SNK',86868686868);
/*!40000 ALTER TABLE `tour` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-10-02 12:16:53

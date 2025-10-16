-- MySQL dump 10.13  Distrib 8.4.5-5, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: inmobiliaria_calciferhowl
-- ------------------------------------------------------
-- Server version	8.4.5-5

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*!50717 SELECT COUNT(*) INTO @rocksdb_has_p_s_session_variables FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'performance_schema' AND TABLE_NAME = 'session_variables' */;
/*!50717 SET @rocksdb_get_is_supported = IF (@rocksdb_has_p_s_session_variables, 'SELECT COUNT(*) INTO @rocksdb_is_supported FROM performance_schema.session_variables WHERE VARIABLE_NAME=\'rocksdb_bulk_load\'', 'SELECT 0') */;
/*!50717 PREPARE s FROM @rocksdb_get_is_supported */;
/*!50717 EXECUTE s */;
/*!50717 DEALLOCATE PREPARE s */;
/*!50717 SET @rocksdb_enable_bulk_load = IF (@rocksdb_is_supported, 'SET SESSION rocksdb_bulk_load = 1', 'SET @rocksdb_dummy_bulk_load = 0') */;
/*!50717 PREPARE s FROM @rocksdb_enable_bulk_load */;
/*!50717 EXECUTE s */;
/*!50717 DEALLOCATE PREPARE s */;

--
-- Current Database: `inmobiliaria_calciferhowl`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `inmobiliaria_calciferhowl` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `inmobiliaria_calciferhowl`;

--
-- Table structure for table `agente_asignado`
--

DROP TABLE IF EXISTS `agente_asignado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agente_asignado` (
  `id_agente` int unsigned NOT NULL,
  `id_propiedad` int unsigned NOT NULL,
  `fecha_hora_desde` datetime NOT NULL,
  `fecha_hora_hasta` datetime DEFAULT NULL,
  PRIMARY KEY (`id_agente`,`id_propiedad`,`fecha_hora_desde`),
  KEY `fk_agente_asignado_propiedad_idx` (`id_propiedad`),
  CONSTRAINT `fk_agente_asignado_persona` FOREIGN KEY (`id_agente`) REFERENCES `persona` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_agente_asignado_propiedad` FOREIGN KEY (`id_propiedad`) REFERENCES `propiedad` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agente_asignado`
--

LOCK TABLES `agente_asignado` WRITE;
/*!40000 ALTER TABLE `agente_asignado` DISABLE KEYS */;
INSERT INTO `agente_asignado` VALUES (11007,12001,'2023-02-10 10:00:00',NULL),(11007,12008,'2024-02-20 12:00:00',NULL),(11008,12001,'2024-03-15 11:00:00','2024-09-20 15:00:00'),(11008,12009,'2023-12-01 11:00:00',NULL),(11009,12002,'2023-05-01 12:00:00',NULL),(11009,12010,'2024-05-10 10:00:00',NULL),(11010,12003,'2023-07-20 14:00:00',NULL),(11010,12011,'2023-10-15 14:00:00',NULL),(11011,12004,'2024-01-10 10:00:00',NULL),(11011,12012,'2024-06-01 13:00:00',NULL),(11012,12005,'2024-04-05 16:00:00',NULL),(11012,12013,'2024-07-20 15:00:00',NULL),(11013,12006,'2023-09-01 13:00:00','2024-01-15 17:00:00'),(11014,12006,'2024-03-01 10:00:00',NULL),(11015,12007,'2023-11-10 15:00:00',NULL),(11016,12001,'2025-01-10 10:00:00',NULL),(11016,12008,'2025-06-01 14:00:00',NULL),(11017,12002,'2024-10-01 12:00:00',NULL),(11017,12009,'2025-07-01 15:00:00',NULL),(11018,12003,'2024-11-20 14:00:00',NULL),(11018,12010,'2025-07-05 16:00:00',NULL),(11019,12004,'2025-02-10 10:00:00',NULL),(11020,12005,'2025-03-15 11:00:00',NULL),(11031,12006,'2025-04-01 12:00:00',NULL),(11032,12007,'2025-05-01 13:00:00',NULL);
/*!40000 ALTER TABLE `agente_asignado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `caracteristica`
--

DROP TABLE IF EXISTS `caracteristica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `caracteristica` (
  `id` int unsigned NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `tipo` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `caracteristica`
--

LOCK TABLES `caracteristica` WRITE;
/*!40000 ALTER TABLE `caracteristica` DISABLE KEYS */;
INSERT INTO `caracteristica` VALUES (14001,'pileta','Si-No'),(14002,'jardín','Si-No'),(14003,'apto crédito','Si-No'),(14004,'vista','string'),(14005,'movilidad propia','Si-No'),(14006,'superficie construida','superficie'),(14007,'superficie total','superficie'),(14008,'estado de conservación','string'),(14009,'campo de fuerza','Si-No'),(14010,'puerta mágica','Si-No'),(14011,'estacionamiento para naves','Si-No'),(14012,'mazmorra','Si-No'),(14013,'sala de hologramas','Si-No'),(14014,'wifi intergaláctico','Si-No'),(14015,'ascensor gravitacional','Si-No'),(14016,'nombre','string');
/*!40000 ALTER TABLE `caracteristica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `caracteristica_propiedad`
--

DROP TABLE IF EXISTS `caracteristica_propiedad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `caracteristica_propiedad` (
  `id_caracteristica` int unsigned NOT NULL,
  `id_propiedad` int unsigned NOT NULL,
  `contenido` varchar(255) NOT NULL,
  PRIMARY KEY (`id_caracteristica`,`id_propiedad`),
  KEY `fk_caracteristica_propiedad_propiedad_idx` (`id_propiedad`),
  CONSTRAINT `fk_caracteristica_propiedad_caracteristica` FOREIGN KEY (`id_caracteristica`) REFERENCES `caracteristica` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_caracteristica_propiedad_propiedad` FOREIGN KEY (`id_propiedad`) REFERENCES `propiedad` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `caracteristica_propiedad`
--

LOCK TABLES `caracteristica_propiedad` WRITE;
/*!40000 ALTER TABLE `caracteristica_propiedad` DISABLE KEYS */;
INSERT INTO `caracteristica_propiedad` VALUES (14001,12001,'si'),(14001,12002,'no'),(14001,12003,'si'),(14001,12004,'no'),(14001,12005,'si'),(14001,12006,'no'),(14001,12007,'si'),(14001,12008,'no'),(14001,12009,'si'),(14001,12010,'no'),(14001,12011,'si'),(14001,12012,'si'),(14001,12013,'no'),(14001,12014,'no'),(14001,12015,'si'),(14002,12001,'si'),(14002,12003,'si'),(14002,12004,'si'),(14002,12005,'no'),(14002,12007,'si'),(14002,12008,'si'),(14002,12009,'si'),(14002,12011,'no'),(14002,12012,'si'),(14002,12013,'si'),(14002,12014,'si'),(14002,12015,'si'),(14004,12001,'vista al espacio profundo'),(14004,12002,'vista a Marte'),(14004,12003,'vista al jardín'),(14004,12004,'vista a Tokio'),(14004,12005,'vista a la ciudad'),(14004,12006,'vista a la colonia'),(14004,12007,'vista a Zeon'),(14004,12008,'vista al espacio neutral'),(14004,12009,'vista a las estrellas'),(14004,12010,'vista a la galaxia'),(14004,12011,'vista al lago'),(14004,12012,'vista al desierto'),(14004,12013,'vista al bosque'),(14004,12014,'vista a la Tierra'),(14004,12015,'vista a la ciudad'),(14005,12001,'si'),(14005,12002,'si'),(14006,12001,'250'),(14006,12002,'180'),(14006,12003,'400'),(14006,12004,'80'),(14006,12005,'60'),(14006,12006,'200'),(14006,12007,'150'),(14006,12008,'350'),(14006,12009,'500'),(14006,12010,'120'),(14006,12011,'180'),(14006,12012,'90'),(14006,12013,'50'),(14006,12014,'300'),(14006,12015,'400'),(14007,12001,'500'),(14007,12002,'300'),(14007,12003,'800'),(14007,12004,'120'),(14007,12005,'90'),(14007,12006,'400'),(14007,12007,'250'),(14007,12008,'600'),(14007,12009,'900'),(14007,12010,'200'),(14007,12011,'300'),(14007,12012,'120'),(14007,12013,'70'),(14007,12014,'500'),(14007,12015,'700'),(14008,12003,'excelente'),(14008,12004,'bueno'),(14008,12005,'excelente'),(14009,12003,'no'),(14010,12001,'si'),(14011,12002,'si'),(14011,12006,'si'),(14013,12002,'si'),(14014,12001,'si'),(14016,12001,'Castillo Errante'),(14016,12002,'Bebop'),(14016,12003,'Villa Cagliostro'),(14016,12004,'Beika Tower'),(14016,12005,'Niihama Loft'),(14016,12006,'Colonia Side 7'),(14016,12007,'Colonia Side 3'),(14016,12008,'Babylon 5'),(14016,12009,'Alderaan Palace'),(14016,12010,'Halcon Milenario'),(14016,12011,'Avalon'),(14016,12012,'Arrakis Duna'),(14016,12013,'Casa del Bosque'),(14016,12014,'Estación Nadesico'),(14016,12015,'Salón de la Justicia');
/*!40000 ALTER TABLE `caracteristica_propiedad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `garantia`
--

DROP TABLE IF EXISTS `garantia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `garantia` (
  `id_tipo_garantia` int unsigned NOT NULL,
  `id_garante` int unsigned NOT NULL,
  `id_solicitud` int unsigned NOT NULL,
  `fecha_alta` date NOT NULL,
  `fecha_baja` date DEFAULT NULL,
  `estado` varchar(20) NOT NULL,
  PRIMARY KEY (`id_solicitud`,`id_garante`),
  KEY `fk_garantia_tipo_garantia_idx` (`id_tipo_garantia`),
  KEY `fk_garantia_persona_idx` (`id_garante`),
  CONSTRAINT `fk_garantia_garante` FOREIGN KEY (`id_garante`) REFERENCES `persona` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_garantia_solicitud_contrato` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitud_contrato` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_garantia_tipo_garantia` FOREIGN KEY (`id_tipo_garantia`) REFERENCES `tipo_garantia` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `garantia`
--

LOCK TABLES `garantia` WRITE;
/*!40000 ALTER TABLE `garantia` DISABLE KEYS */;
INSERT INTO `garantia` VALUES (15002,11005,22001,'2023-03-05',NULL,'aprobada'),(15001,11006,22001,'2023-03-06',NULL,'aprobada'),(15001,11007,22001,'2023-03-07',NULL,'aprobada'),(15002,11008,22002,'2023-03-12',NULL,'rechazada'),(15001,11009,22002,'2023-03-13',NULL,'rechazada'),(15001,11010,22002,'2023-03-14',NULL,'rechazada'),(15002,11011,22003,'2023-06-05',NULL,'aprobada'),(15001,11012,22003,'2023-06-06',NULL,'aprobada'),(15001,11013,22003,'2023-06-07',NULL,'aprobada'),(15001,11006,22004,'2023-08-07',NULL,'rechazada'),(15002,11014,22004,'2023-08-05',NULL,'rechazada'),(15001,11015,22004,'2023-08-06',NULL,'aprobada'),(15001,11004,22005,'2024-10-08',NULL,'aprobada'),(15001,11005,22005,'2024-02-07',NULL,'aprobada'),(15001,11007,22005,'2024-02-06','2024-10-02','aprobada'),(15002,11009,22005,'2024-02-05',NULL,'aprobada'),(15002,11005,22012,'2024-12-01',NULL,'aprobada'),(15002,11006,22012,'2024-06-15','2024-11-20','aprobada'),(15001,11007,22012,'2024-06-16',NULL,'aprobada'),(15001,11008,22012,'2024-06-17',NULL,'aprobada'),(15002,11009,22013,'2023-11-20',NULL,'rechazada'),(15001,11010,22013,'2023-11-21',NULL,'rechazada'),(15001,11011,22013,'2023-11-22',NULL,'rechazada'),(15002,11012,22014,'2024-06-10',NULL,'aprobada'),(15001,11013,22014,'2024-06-11',NULL,'aprobada'),(15001,11006,22015,'2024-08-03',NULL,'aprobada'),(15001,11008,22015,'2024-08-02',NULL,'aprobada'),(15002,11015,22015,'2024-08-01',NULL,'aprobada'),(15001,11014,23024,'2024-06-12',NULL,'rechazada');
/*!40000 ALTER TABLE `garantia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `habitacion`
--

DROP TABLE IF EXISTS `habitacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `habitacion` (
  `id_propiedad` int unsigned NOT NULL,
  `id_tipo_habitacion` int unsigned NOT NULL,
  `cantidad` int NOT NULL,
  `tamanio` int DEFAULT NULL,
  PRIMARY KEY (`id_propiedad`,`id_tipo_habitacion`),
  KEY `fk_habitacion_tipo_habitacion` (`id_tipo_habitacion`),
  CONSTRAINT `fk_habitacion_propiedad` FOREIGN KEY (`id_propiedad`) REFERENCES `propiedad` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_habitacion_tipo_habitacion` FOREIGN KEY (`id_tipo_habitacion`) REFERENCES `tipo_habitacion` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `habitacion`
--

LOCK TABLES `habitacion` WRITE;
/*!40000 ALTER TABLE `habitacion` DISABLE KEYS */;
INSERT INTO `habitacion` VALUES (12001,13001,3,18),(12001,13002,1,12),(12001,13003,2,25),(12001,13008,1,40),(12001,13010,1,15),(12002,13006,4,10),(12002,13011,1,20),(12002,13012,1,30),(12002,13013,1,18),(12003,13001,6,20),(12003,13002,2,15),(12003,13003,3,30),(12003,13004,4,10),(12003,13009,1,25),(12004,13001,2,12),(12004,13002,1,8),(12004,13003,1,15),(12004,13004,1,6),(12005,13001,2,14),(12005,13002,1,10),(12005,13003,1,18),(12005,13004,1,7),(12006,13001,4,20),(12006,13002,2,12),(12006,13011,1,30),(12006,13012,1,35),(12007,13001,3,16),(12007,13002,1,10),(12007,13003,1,15),(12007,13004,1,8),(12008,13001,5,22),(12008,13002,2,14),(12008,13003,2,20),(12008,13012,1,40),(12009,13001,6,25),(12009,13002,2,15),(12009,13003,2,30),(12009,13008,1,50),(12010,13006,3,12),(12010,13011,1,18),(12010,13012,1,25),(12010,13013,1,15),(12011,13001,4,20),(12011,13002,1,12),(12011,13003,2,18),(12011,13009,1,22),(12012,13001,2,14),(12012,13002,1,10),(12012,13003,1,15),(12012,13004,1,7),(12013,13001,1,10),(12013,13002,1,8),(12013,13003,1,12),(12013,13007,1,6),(12014,13001,3,16),(12014,13002,1,10),(12014,13003,1,15),(12014,13012,1,20),(12015,13001,5,22),(12015,13002,2,14),(12015,13003,2,20),(12015,13014,1,30);
/*!40000 ALTER TABLE `habitacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pago`
--

DROP TABLE IF EXISTS `pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pago` (
  `id_solicitud` int unsigned NOT NULL,
  `fecha_hora_pago` datetime NOT NULL,
  `importe` decimal(12,3) NOT NULL,
  `concepto` varchar(50) NOT NULL,
  PRIMARY KEY (`id_solicitud`,`fecha_hora_pago`),
  CONSTRAINT `fk_pago_solicitud_contrato` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitud_contrato` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pago`
--

LOCK TABLES `pago` WRITE;
/*!40000 ALTER TABLE `pago` DISABLE KEYS */;
INSERT INTO `pago` VALUES (22001,'2023-03-05 09:00:00',124000.000,'seña'),(22001,'2023-03-25 11:00:00',334800.000,'comision'),(22001,'2023-03-25 12:00:00',155000.000,'deposito'),(22001,'2023-03-25 13:00:00',124000.000,'sellado'),(22001,'2023-04-08 10:00:00',155000.000,'pago alquiler'),(22001,'2023-05-09 15:00:00',155000.000,'pago alquiler'),(22001,'2023-06-10 11:28:00',155000.000,'pago alquiler'),(22001,'2023-07-08 14:41:00',155000.000,'pago alquiler'),(22001,'2023-08-13 13:23:00',230455.500,'pago alquiler'),(22001,'2023-09-14 12:12:00',230455.500,'pago alquiler'),(22001,'2023-10-13 12:17:00',230455.500,'pago alquiler'),(22001,'2023-11-03 15:44:00',209505.000,'pago alquiler'),(22001,'2023-12-12 15:50:00',313363.600,'pago alquiler'),(22001,'2024-01-08 11:20:00',284876.000,'pago alquiler'),(22001,'2024-02-12 09:46:00',313363.600,'pago alquiler'),(22001,'2024-03-02 11:32:00',284876.000,'pago alquiler'),(22001,'2024-04-06 11:34:00',600630.000,'pago alquiler'),(22001,'2024-05-07 12:40:00',600630.000,'pago alquiler'),(22001,'2024-06-11 10:39:00',660693.000,'pago alquiler'),(22001,'2024-07-13 16:14:00',660693.000,'pago alquiler'),(22001,'2024-08-07 17:11:00',728159.000,'pago alquiler'),(22001,'2024-09-05 15:44:00',728159.000,'pago alquiler'),(22001,'2024-10-13 09:17:00',800974.900,'pago alquiler'),(22001,'2024-11-09 16:45:00',728159.000,'pago alquiler'),(22001,'2024-12-08 12:08:00',879.327,'pago alquiler'),(22001,'2025-01-05 13:50:00',879.327,'pago alquiler'),(22001,'2025-02-11 09:27:00',967.260,'pago alquiler'),(22001,'2025-03-13 12:53:00',967.260,'pago alquiler'),(22001,'2025-04-06 16:22:00',936369.000,'pago alquiler'),(22001,'2025-05-02 09:08:00',936369.000,'pago alquiler'),(22001,'2025-06-12 17:12:00',1030005.900,'pago alquiler'),(22001,'2025-07-04 10:35:00',936369.000,'pago alquiler'),(22003,'2023-06-05 10:00:00',100000.000,'seña'),(22003,'2023-06-25 11:00:00',270000.000,'comision'),(22003,'2023-06-25 12:00:00',125000.000,'deposito'),(22003,'2023-06-25 13:00:00',100000.000,'sellado'),(22003,'2023-07-08 10:00:00',125000.000,'pago alquiler'),(22003,'2023-08-09 15:00:00',125000.000,'pago alquiler'),(22003,'2023-09-10 16:59:00',125000.000,'pago alquiler'),(22003,'2023-10-08 15:11:00',125000.000,'pago alquiler'),(22003,'2023-11-05 10:05:00',167033.000,'pago alquiler'),(22003,'2023-12-12 14:56:00',183736.300,'pago alquiler'),(22003,'2024-01-13 13:00:00',183736.300,'pago alquiler'),(22003,'2024-02-09 13:35:00',167033.000,'pago alquiler'),(22003,'2024-03-13 14:47:00',276812.800,'pago alquiler'),(22003,'2024-04-11 13:49:00',276812.800,'pago alquiler'),(22003,'2024-05-09 12:38:00',251648.000,'pago alquiler'),(22003,'2024-06-04 16:44:00',251648.000,'pago alquiler'),(22003,'2024-07-08 13:57:00',430495.000,'pago alquiler'),(22003,'2024-08-03 10:27:00',430495.000,'pago alquiler'),(22003,'2024-09-05 09:54:00',430495.000,'pago alquiler'),(22003,'2024-10-09 12:59:00',430495.000,'pago alquiler'),(22003,'2024-11-08 15:49:00',534160.000,'pago alquiler'),(22003,'2024-12-05 09:20:00',534160.000,'pago alquiler'),(22003,'2025-01-07 16:58:00',534160.000,'pago alquiler'),(22003,'2025-02-04 13:17:00',534160.000,'pago alquiler'),(22003,'2025-03-05 14:54:00',627473.000,'pago alquiler'),(22003,'2025-04-08 12:36:00',627473.000,'pago alquiler'),(22003,'2025-05-09 15:13:00',627473.000,'pago alquiler'),(22003,'2025-06-11 13:40:00',690220.300,'pago alquiler'),(22003,'2025-07-07 14:52:00',715110.000,'pago alquiler'),(22004,'2023-08-06 10:01:00',1700000.000,'seña'),(22005,'2024-02-05 11:51:12',76000.000,'seña'),(22005,'2024-02-25 12:10:40',205200.000,'comision'),(22005,'2024-02-25 12:11:03',95000.000,'deposito'),(22005,'2024-02-25 12:13:17',76000.000,'sellado'),(22005,'2024-02-25 12:15:18',99000.000,'pago alquiler'),(22005,'2024-03-02 10:40:00',90000.000,'pago alquiler'),(22005,'2024-04-10 13:37:00',90000.000,'pago alquiler'),(22005,'2024-05-11 09:39:00',99000.000,'pago alquiler'),(22005,'2024-06-03 13:15:00',128206.000,'pago alquiler'),(22005,'2024-07-14 11:30:00',141026.600,'pago alquiler'),(22005,'2024-08-09 09:16:00',128206.000,'pago alquiler'),(22005,'2024-09-07 09:34:00',128206.000,'pago alquiler'),(22005,'2024-10-08 10:11:00',150412.000,'pago alquiler'),(22005,'2024-11-03 11:09:00',150412.000,'pago alquiler'),(22005,'2024-12-12 12:01:00',165453.200,'pago alquiler'),(22005,'2025-01-04 11:05:00',150412.000,'pago alquiler'),(22005,'2025-02-11 11:09:00',182627.500,'pago alquiler'),(22005,'2025-03-03 09:39:00',166025.000,'pago alquiler'),(22005,'2025-04-13 11:08:00',182627.500,'pago alquiler'),(22005,'2025-05-08 16:28:00',166025.000,'pago alquiler'),(22005,'2025-06-03 13:00:00',183955.000,'pago alquiler'),(22005,'2025-07-13 09:49:00',202350.500,'pago alquiler'),(22006,'2024-05-05 13:23:15',100000.000,'seña'),(22012,'2024-06-15 10:00:00',110000.000,'seña'),(22012,'2024-07-05 11:00:00',291600.000,'comision'),(22012,'2024-07-05 12:00:00',135000.000,'deposito'),(22012,'2024-07-05 13:00:00',108000.000,'sellado'),(22012,'2024-07-10 10:00:00',135000.000,'pago alquiler'),(22012,'2024-08-12 15:00:00',148500.000,'pago alquiler'),(22012,'2024-09-05 12:05:00',135000.000,'pago alquiler'),(22012,'2024-10-05 11:29:00',151417.000,'pago alquiler'),(22012,'2024-11-08 13:57:00',151417.000,'pago alquiler'),(22012,'2024-12-06 17:45:00',151417.000,'pago alquiler'),(22012,'2025-01-08 11:31:00',163537.000,'pago alquiler'),(22012,'2025-02-14 16:54:00',179890.700,'pago alquiler'),(22012,'2025-03-09 10:34:00',163537.000,'pago alquiler'),(22012,'2025-04-12 16:19:00',195225.800,'pago alquiler'),(22012,'2025-05-11 11:19:00',195225.800,'pago alquiler'),(22012,'2025-06-02 14:09:00',177478.000,'pago alquiler'),(22012,'2025-07-13 16:56:00',207573.300,'pago alquiler'),(22014,'2024-06-10 10:55:12',93000.000,'seña'),(22015,'2024-08-01 11:31:12',101000.000,'seña');
/*!40000 ALTER TABLE `pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persona`
--

DROP TABLE IF EXISTS `persona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `persona` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `tipo_doc` varchar(45) NOT NULL,
  `nro_doc` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `domicilio` varchar(255) NOT NULL,
  `telefono` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `cuil` varchar(14) DEFAULT NULL,
  `matricula` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21029 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persona`
--

LOCK TABLES `persona` WRITE;
/*!40000 ALTER TABLE `persona` DISABLE KEYS */;
INSERT INTO `persona` VALUES (11001,'dni','12345678','Howl','Pendragon','Castillo Errante, Espacio Móvil','1122334455','howl@castilloerrante.com',NULL,NULL),(11002,'dni','23456789','Sophie','Hatter','Castillo Errante, Espacio Móvil','1122334456','sophie@castilloerrante.com',NULL,NULL),(11003,'dni','34567890','Spike','Spiegel','Bebop, Órbita de Marte','1133445566','spike@bebop.com',NULL,NULL),(11004,'ssn','45678901','Faye','Valentine','Bebop, Órbita de Marte','1133445567','faye@bebop.com',NULL,NULL),(11005,'dni','56789012','Lupin','III','Villa Cagliostro, Italia','1144556677','lupin@lupin.com',NULL,NULL),(11006,'dni','67890123','Conan','Edogawa','Beika, Tokio','1144556678','conan@detective.com',NULL,NULL),(11007,'dni','78901234','Motoko','Kusanagi','Niihama, Japón','1155667788','motoko@seccion9.com','20012345678','01234'),(11008,'ssn','89012345','Amuro','Ray','Colonia Side 7, Espacio','1155667789','amuro@gundam.com','20234567890','90123'),(11009,'ssn','90123456','Char','Aznable','Colonia Side 3, Espacio','1166778899','char@gundam.com','20345678901','89012'),(11010,'ssn','91234567','John','Sheridan','Babylon 5, Espacio Neutral','1166778890','sheridan@babylon5.com','20456789012','78901'),(11011,'rid','92345678','Leia','Organa','Alderaan, Galaxia Muy Lejana','1177889900','leia@rebeldes.com','20567890123','67890'),(11012,'rid','93456789','Han','Solo','Corellia, Galaxia Muy Lejana','1177889901','han@halconmilenario.com','20678901234','56789'),(11013,'dni','94567890','Arturo','Pendragon','Avalon, Reino Mágico','1188990011','arturo@avalon.com','20789012345','45678'),(11014,'dni','95678901','Jessica','Atreides','Arrakis, Duna','1188990012','jessica@dune.com','20890123456','34567'),(11015,'dni','96789012','Paul','Atreides','Arrakis, Duna','1199001122','paul@dune.com','20901234567','23456'),(11016,'irec','97890123','Reinhard','von Lohengramm','Fezzan, Galaxia','1200112233','reinhard@imperio.com','20123456789','12345'),(11017,'irec','98890123','Yang','Wen-li','Heinessen, Galaxia','1200112234','yang@alianza.com','20987654321','54321'),(11018,'my number','99890123','Shinji','Ikari','Tokio-3, Japón','1200112235','shinji@nerv.com','20111222333','67890'),(11019,'my number','90890123','Misato','Katsuragi','Tokio-3, Japón','1200112236','misato@nerv.com','20999888777','98765'),(11020,'irec','91890123','Lain','Iwakura','Wired, Internet','1200112237','lain@wired.com','20123412345','11223'),(11021,'ssn','92890123','Deckard','Rick','Los Ángeles, Tierra','1200112238','deckard@blade.com',NULL,NULL),(11022,'my number','93890123','Gendo','Ikari','Tokio-3, Japón','1200112239','gendo@nerv.com',NULL,NULL),(11023,'sin','94890123','Asuka','Langley','Tokio-3, Japón','1200112240','asuka@nerv.com',NULL,NULL),(11024,'my number','95890123','Shirley','Fenette','Ashford, Area 11','1200112241','shirley@ashford.com',NULL,NULL),(11025,'my number','96890123','Lelouch','Lamperouge','Ashford, Area 11','1200112242','lelouch@geass.com',NULL,NULL),(11026,'my number','97890124','C.C.','Pizza','Ashford, Area 11','1200112243','cc@geass.com',NULL,NULL),(11027,'my number','98890124','Light','Yagami','Tokio, Japón','1200112244','light@kira.com',NULL,NULL),(11028,'nin','99890124','Near','River','Wammy\'s House, Inglaterra','1200112245','near@wammys.com',NULL,NULL),(11029,'my number','90890124','Misa','Amane','Tokio, Japón','1200112246','misa@kira.com',NULL,NULL),(11030,'sid','91890124','Deniz','Skinner','İstanbul, Türkiye','1200112247','ds@hapna.jp',NULL,NULL),(11031,'ii','92890124','Kazuma','Satou','Axel, Fantasía','1200112248','kazuma@konosuba.com','20123456780','13579'),(11032,'ii','93890124','Aqua','Goddess','Axel, Fantasía','1200112249','aqua@konosuba.com','20987654320','97531'),(21013,'dni','30123456','Edward','Elric','Resembool, Amestris','1130000013','edward@alchemy.am',NULL,NULL),(21014,'dni','30123457','Alphonse','Elric','Resembool, Amestris','1130000014','alphonse@alchemy.am',NULL,NULL),(21015,'dni','30123458','Kusanagi','Batou','Niihama, Japón','1130000015','batou@seccion9.jp',NULL,NULL),(21016,'dni','30123459','Rem','Kiryuu','Roswaal Mansion, Lugnica','1130000016','rem@rezero.jp',NULL,NULL),(21017,'dni','30123460','Emilia','Justina','Santuario, Lugnica','1130000017','emilia@rezero.jp',NULL,NULL),(21018,'dni','30123461','Subaru','Natsuki','Ciudad de Lugunica, Lugnica','1130000018','subaru@rezero.jp',NULL,NULL),(21019,'dni','30123462','Lain','Iwakura','Wired, Internet','1130000019','lain@wired.jp',NULL,NULL),(21020,'dni','30123463','Gally','Ido','Scrapyard, Marte','1130000020','gally@battleangel.jp',NULL,NULL),(21021,'dni','30123464','Amelia','Wil Tesla Seyruun','Seyruun, Slayersverse','1130000021','amelia@slayers.jp',NULL,NULL),(21022,'dni','30123465','Lina','Inverse','Seyruun, Slayersverse','1130000022','lina@slayers.jp',NULL,NULL),(21023,'dni','30123466','Simon','the Digger','Jiiha Village, Tierra','1130000023','simon@gurren.jp',NULL,NULL),(21024,'dni','30123467','Kamina','Leader','Jiiha Village, Tierra','1130000024','kamina@gurren.jp',NULL,NULL),(21025,'dni','30123468','Yoko','Littner','Littner, Tierra','1130000025','yoko@gurren.jp',NULL,NULL),(21026,'dni','30123469','Holo','la Sabia','Pasloe, Yoitsu','1130000026','holo@spiceandwolf.jp',NULL,NULL),(21027,'dni','30123470','Lawrence','Craft','Pasloe, Yoitsu','1130000027','lawrence@spiceandwolf.jp',NULL,NULL),(21028,'dni','30123471','Guts','Kuro Kenshin','Chiba, Japon','1130000028','guts@miura.jp',NULL,NULL);
/*!40000 ALTER TABLE `persona` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `propiedad`
--

DROP TABLE IF EXISTS `propiedad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `propiedad` (
  `id` int unsigned NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `ubicacion_gps` point DEFAULT NULL,
  `anio_const` int NOT NULL,
  `tipo` varchar(255) NOT NULL,
  `zona` varchar(255) NOT NULL,
  `situacion` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `propiedad`
--

LOCK TABLES `propiedad` WRITE;
/*!40000 ALTER TABLE `propiedad` DISABLE KEYS */;
INSERT INTO `propiedad` VALUES (12001,'Castillo Errante, Dimensión Mágica',0x000000000101000000304CA60A464D41C0A913D044D8304DC0,2004,'castillo','Espacio Móvil','alquilada'),(12002,'Hangar 7, Órbita de Marte',0x0000000001010000005227A089B0713240E4141DC9E5475340,2071,'nave espacial','Órbita de Marte','alquilada'),(12003,'Via Cagliostro 1, Italia',0x000000000101000000166A4DF38EF3444003780B2428FE2840,1979,'mansión','Italia','señada'),(12004,'Torre Beika, Shinjuku, Tokio',0x000000000101000000C74B378941D8414095D4096822766140,1994,'departamento','Tokio','alquilada'),(12005,'Niihama Loft, Niihama, Japón',0x000000000101000000FFB27BF2B0884540A1D634EF38AB6140,2029,'departamento','Japón','señada'),(12006,'Sector 7, Colonia Side 7',0x00000000010100000000000000000000000000000000000000,79,'estación espacial','Espacio','en oferta'),(12007,'Sector 3, Colonia Side 3',0x0000000001010000002D431CEBE2361A3F2D431CEBE2361A3F,79,'estación espacial','Espacio','en oferta'),(12008,'Dársena 5, Babylon 5',0x000000000101000000C5FEB27BF2B028408126C286A75B5040,2257,'estación espacial','Espacio Neutral','en oferta'),(12009,'Palacio Real, Alderaan',0x000000000101000000000000000080464000000000004057C0,-19,'castillo','Galaxia Muy Lejana','en oferta'),(12010,'Hangar 94, Mos Eisley',0x000000000101000000431CEBE2361A424012A5BDC117486140,-19,'nave espacial','Galaxia Muy Lejana','alquilada'),(12011,'Isla de Avalon, Lago Encantado',0x000000000101000000C5FEB27BF2C04940EBE2361AC05BC0BF,500,'mansión','Reino Mágico','en oferta'),(12012,'Arrakis, Duna Profunda',0x0000000001010000008638D6C56D343940DFE00B93A9A24B40,10191,'casa','Duna','señada'),(12013,'Sendero 42, Bosque Encantado',0x000000000101000000CCEEC9C3423543C0BBB88D06F0CE4FC0,1988,'cabaña','Bosque Encantado','señada'),(12014,'Dársena 1, Estación Nadesico',0x000000000101000000F38E53742497BF3FCF66D5E76A2BE23F,2196,'estación espacial','Órbita de la Tierra','en oferta'),(12015,'Avenida Héroes 1000, Ciudad Gótica',0x0000000001010000005E4BC8073D5B4440AAF1D24D628052C0,1939,'mansión','Ciudad Gótica','a verificar');
/*!40000 ALTER TABLE `propiedad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `propietario_propiedad`
--

DROP TABLE IF EXISTS `propietario_propiedad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `propietario_propiedad` (
  `id_propietario` int unsigned NOT NULL,
  `id_propiedad` int unsigned NOT NULL,
  PRIMARY KEY (`id_propietario`,`id_propiedad`),
  KEY `fk_propietario_propiedad_propiedad_idx` (`id_propiedad`),
  CONSTRAINT `fk_propietario_propiedad_propiedad` FOREIGN KEY (`id_propiedad`) REFERENCES `propiedad` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_propietario_propiedad_propietario` FOREIGN KEY (`id_propietario`) REFERENCES `persona` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `propietario_propiedad`
--

LOCK TABLES `propietario_propiedad` WRITE;
/*!40000 ALTER TABLE `propietario_propiedad` DISABLE KEYS */;
INSERT INTO `propietario_propiedad` VALUES (11001,12001),(11002,12001),(11003,12002),(11005,12003),(11030,12003),(11006,12004),(11029,12004),(11007,12005),(11028,12005),(11008,12006),(11027,12006),(11009,12007),(11026,12007),(11010,12008),(11025,12008),(11011,12009),(11024,12009),(11012,12010),(11023,12010),(11013,12011),(11022,12011),(11014,12012),(11015,12012),(11021,12012),(11002,12013),(11020,12013),(11005,12014),(11016,12014),(11017,12014),(11007,12015),(11018,12015),(11019,12015);
/*!40000 ALTER TABLE `propietario_propiedad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitud_contrato`
--

DROP TABLE IF EXISTS `solicitud_contrato`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitud_contrato` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `fecha_solicitud` date NOT NULL,
  `importe_mensual` decimal(12,3) NOT NULL,
  `path_archivo_contrato` varchar(255) DEFAULT NULL,
  `estado` varchar(20) NOT NULL,
  `nro_contrato` int DEFAULT NULL,
  `fecha_contrato` date DEFAULT NULL,
  `id_agente` int unsigned NOT NULL,
  `id_propiedad` int unsigned NOT NULL,
  `fecha_hora_desde` datetime NOT NULL,
  `id_cliente` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_solicitud_contrato_agente_asignado_idx` (`id_agente`,`id_propiedad`,`fecha_hora_desde`),
  KEY `fk_solicitud_contrato_persona_idx` (`id_cliente`),
  CONSTRAINT `fk_solicitud_contrato_agente_asignado` FOREIGN KEY (`id_agente`, `id_propiedad`, `fecha_hora_desde`) REFERENCES `agente_asignado` (`id_agente`, `id_propiedad`, `fecha_hora_desde`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_solicitud_contrato_persona` FOREIGN KEY (`id_cliente`) REFERENCES `persona` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22016 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitud_contrato`
--

LOCK TABLES `solicitud_contrato` WRITE;
/*!40000 ALTER TABLE `solicitud_contrato` DISABLE KEYS */;
INSERT INTO `solicitud_contrato` VALUES (22001,'2023-03-05',155000.000,'contratos/12001/11003/2023-03-05','en alquiler',765432,'2023-03-25',11007,12001,'2023-02-10 10:00:00',11003),(22002,'2023-03-12',155000.000,'contratos/12001/11004/2023-03-12','rechazada',NULL,NULL,11007,12001,'2023-02-10 10:00:00',11004),(22003,'2023-06-05',125000.000,'contratos/12002/11006/2023-06-05','en alquiler',876543,'2023-06-25',11009,12002,'2023-05-01 12:00:00',11006),(22004,'2023-08-05',210000.000,'contratos/12003/11007/2023-08-05','rechazada',NULL,NULL,11010,12003,'2023-07-20 14:00:00',11007),(22005,'2024-02-05',95000.000,'contratos/12004/11008/2024-02-05','en alquiler',1234567,'2024-02-25',11011,12004,'2024-01-10 10:00:00',11008),(22006,'2024-05-05',115000.000,'contratos/12005/11009/2024-05-05','en proceso',NULL,NULL,11012,12005,'2024-04-05 16:00:00',11009),(22007,'2023-10-05',175000.000,'contratos/12006/11010/2023-10-05','rechazada',NULL,NULL,11013,12006,'2023-09-01 13:00:00',11010),(22008,'2024-04-05',180000.000,'contratos/12006/11011/2024-04-05','rechazada',NULL,NULL,11014,12006,'2024-03-01 10:00:00',11011),(22009,'2023-12-05',135000.000,'contratos/12007/11012/2023-12-05','rechazada',NULL,NULL,11015,12007,'2023-11-10 15:00:00',11012),(22010,'2024-03-05',130000.000,'contratos/12008/11013/2024-03-05','en proceso',NULL,NULL,11007,12008,'2024-02-20 12:00:00',11013),(22011,'2024-01-10',120000.000,'contratos/12009/11014/2024-01-10','rechazada',NULL,NULL,11008,12009,'2023-12-01 11:00:00',11014),(22012,'2024-06-15',135000.000,'contratos/12010/11015/2024-06-15','en alquiler',4567890,'2024-07-05',11009,12010,'2024-05-10 10:00:00',11015),(22013,'2023-11-20',110000.000,'contratos/12011/11003/2023-11-20','en proceso',NULL,NULL,11010,12011,'2023-10-15 14:00:00',11003),(22014,'2024-06-10',115000.000,'contratos/12012/11004/2024-06-10','en proceso',NULL,NULL,11011,12012,'2024-06-01 13:00:00',11004),(22015,'2024-08-01',95000.000,'contratos/12013/11005/2024-08-01','en proceso',NULL,NULL,11012,12013,'2024-07-20 15:00:00',11005);
/*!40000 ALTER TABLE `solicitud_contrato` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_garantia`
--

DROP TABLE IF EXISTS `tipo_garantia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_garantia` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15003 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_garantia`
--

LOCK TABLES `tipo_garantia` WRITE;
/*!40000 ALTER TABLE `tipo_garantia` DISABLE KEYS */;
INSERT INTO `tipo_garantia` VALUES (15001,'sueldo'),(15002,'propietaria');
/*!40000 ALTER TABLE `tipo_garantia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_habitacion`
--

DROP TABLE IF EXISTS `tipo_habitacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_habitacion` (
  `id` int unsigned NOT NULL,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_habitacion`
--

LOCK TABLES `tipo_habitacion` WRITE;
/*!40000 ALTER TABLE `tipo_habitacion` DISABLE KEYS */;
INSERT INTO `tipo_habitacion` VALUES (13001,'dormitorio'),(13002,'cocina'),(13003,'living'),(13004,'baño'),(13005,'garage'),(13006,'camarote'),(13007,'mazmorra'),(13008,'salón de baile'),(13009,'biblioteca'),(13010,'jardín de invierno'),(13011,'sala de máquinas'),(13012,'puente de mando'),(13013,'sala de hologramas'),(13014,'sala de entrenamiento'),(13015,'sala de tortas');
/*!40000 ALTER TABLE `tipo_habitacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `valor_propiedad`
--

DROP TABLE IF EXISTS `valor_propiedad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `valor_propiedad` (
  `id_propiedad` int unsigned NOT NULL AUTO_INCREMENT,
  `fecha_hora_desde` datetime NOT NULL,
  `valor` decimal(10,3) NOT NULL,
  PRIMARY KEY (`id_propiedad`,`fecha_hora_desde`),
  CONSTRAINT `fk_valor_propiedad_propiedad` FOREIGN KEY (`id_propiedad`) REFERENCES `propiedad` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12011 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `valor_propiedad`
--

LOCK TABLES `valor_propiedad` WRITE;
/*!40000 ALTER TABLE `valor_propiedad` DISABLE KEYS */;
INSERT INTO `valor_propiedad` VALUES (12001,'2023-02-15 13:04:00',150000.000),(12001,'2023-04-01 17:32:00',155000.000),(12001,'2023-06-01 12:27:00',160000.000),(12001,'2025-01-15 09:39:00',534160.000),(12001,'2025-02-12 10:42:00',246000.000),(12001,'2025-03-15 10:35:00',936369.000),(12001,'2025-04-21 09:11:00',936369.000),(12001,'2025-05-25 08:03:00',397000.000),(12001,'2025-06-26 09:11:00',936369.000),(12001,'2025-07-31 08:27:00',759000.000),(12001,'2025-09-03 07:43:00',904000.000),(12001,'2025-10-03 07:08:00',1161000.000),(12001,'2025-11-08 07:52:00',1292000.000),(12001,'2025-12-08 08:55:00',1927000.000),(12001,'2026-01-11 07:37:00',2215000.000),(12002,'2023-05-05 10:55:00',155000.000),(12002,'2023-07-01 16:38:00',125000.000),(12002,'2024-10-10 14:26:00',800974.900),(12002,'2024-11-09 15:24:00',728159.000),(12002,'2024-12-07 14:12:00',166000.000),(12002,'2025-01-11 14:34:00',534160.000),(12002,'2025-02-15 13:44:00',318000.000),(12002,'2025-03-20 13:48:00',936369.000),(12002,'2025-04-25 15:11:00',936369.000),(12002,'2025-05-23 15:08:00',590000.000),(12002,'2025-06-26 16:13:00',936369.000),(12002,'2025-07-22 15:56:00',1050000.000),(12002,'2025-08-22 14:58:00',1481000.000),(12002,'2025-09-22 14:56:00',1814000.000),(12002,'2025-10-27 15:11:00',2071000.000),(12002,'2025-11-26 15:54:00',2854000.000),(12002,'2025-12-26 16:27:00',3354000.000),(12002,'2026-01-31 17:43:00',4868000.000),(12003,'2023-07-25 13:16:00',1700000.000),(12003,'2023-09-01 14:00:00',210000.000),(12003,'2024-11-25 12:11:00',534160.000),(12003,'2024-12-24 10:53:00',279000.000),(12003,'2025-01-27 11:21:00',534160.000),(12003,'2025-02-28 12:43:00',385000.000),(12003,'2025-03-31 12:35:00',936369.000),(12003,'2025-04-30 13:27:00',936369.000),(12003,'2025-05-28 13:14:00',782000.000),(12003,'2025-06-30 12:32:00',1031000.000),(12003,'2025-08-02 12:09:00',1500000.000),(12003,'2025-09-01 11:51:00',2231000.000),(12003,'2025-09-28 12:05:00',2971000.000),(12003,'2025-11-01 12:16:00',3836000.000),(12003,'2025-11-30 11:22:00',4558000.000),(12003,'2026-01-04 12:29:00',6296000.000),(12004,'2024-01-15 09:56:00',90000.000),(12004,'2024-03-01 13:07:00',95000.000),(12004,'2025-02-15 17:49:00',166025.000),(12004,'2025-03-18 17:38:00',936369.000),(12004,'2025-04-16 17:31:00',936369.000),(12004,'2025-05-18 17:14:00',210000.000),(12004,'2025-06-21 16:24:00',936369.000),(12004,'2025-07-26 14:56:00',286000.000),(12004,'2025-08-25 16:09:00',382000.000),(12004,'2025-09-27 15:28:00',491000.000),(12004,'2025-10-25 14:12:00',717000.000),(12004,'2025-11-28 13:02:00',910000.000),(12004,'2025-12-29 14:10:00',1320000.000),(12004,'2026-02-03 13:49:00',1563000.000),(12005,'2024-04-10 13:42:00',276812.800),(12005,'2024-06-01 15:05:00',128206.000),(12005,'2025-03-20 16:20:00',936369.000),(12005,'2025-04-22 15:41:00',936369.000),(12005,'2025-05-27 16:23:00',191000.000),(12005,'2025-06-29 14:57:00',936369.000),(12005,'2025-08-01 14:23:00',290000.000),(12005,'2025-08-31 14:54:00',376000.000),(12005,'2025-09-28 14:43:00',485000.000),(12005,'2025-10-29 13:28:00',713000.000),(12005,'2025-11-28 13:56:00',916000.000),(12005,'2026-01-01 14:19:00',1306000.000),(12006,'2023-09-10 09:23:00',175000.000),(12006,'2024-03-10 15:57:00',276812.800),(12006,'2025-04-10 15:37:00',195225.800),(12006,'2025-05-14 16:23:00',241000.000),(12006,'2025-06-13 15:36:00',936369.000),(12006,'2025-07-10 16:40:00',429000.000),(12006,'2025-08-08 17:41:00',561000.000),(12006,'2025-09-08 18:18:00',663000.000),(12006,'2025-10-05 19:20:00',746000.000),(12006,'2025-11-05 18:21:00',1025000.000),(12006,'2025-12-04 17:46:00',1334000.000),(12006,'2026-01-02 17:39:00',1874000.000),(12007,'2023-11-15 12:10:00',183736.300),(12007,'2024-02-01 14:02:00',135000.000),(12007,'2025-05-10 15:41:00',195225.800),(12007,'2025-06-14 16:33:00',936369.000),(12007,'2025-07-16 15:32:00',213000.000),(12007,'2025-08-14 17:00:00',272000.000),(12007,'2025-09-11 17:55:00',388000.000),(12007,'2025-10-16 16:26:00',465000.000),(12007,'2025-11-20 16:59:00',530000.000),(12007,'2025-12-25 17:00:00',748000.000),(12007,'2026-01-27 17:09:00',1095000.000),(12008,'2025-06-10 09:17:00',690220.300),(12008,'2025-07-09 10:20:00',202350.500),(12008,'2025-08-13 10:51:00',226000.000),(12008,'2025-09-11 11:59:00',308000.000),(12008,'2025-10-14 13:14:00',407000.000),(12008,'2025-11-12 12:53:00',488000.000),(12008,'2025-12-12 14:05:00',572000.000),(12008,'2026-01-12 14:23:00',819000.000),(12009,'2025-07-10 17:22:00',202350.500),(12009,'2025-08-10 18:22:00',208000.000),(12009,'2025-09-09 17:35:00',257000.000),(12009,'2025-10-12 17:12:00',370000.000),(12009,'2025-11-08 17:04:00',439000.000),(12009,'2025-12-05 17:31:00',486000.000),(12009,'2026-01-03 17:28:00',691000.000),(12010,'2025-07-15 14:01:00',150000.000),(12010,'2025-08-14 14:28:00',185000.000),(12010,'2025-09-20 15:30:00',226000.000),(12010,'2025-10-17 14:14:00',250000.000),(12010,'2025-11-20 15:20:00',297000.000),(12010,'2025-12-17 15:44:00',417000.000),(12010,'2026-01-19 15:29:00',523000.000);
/*!40000 ALTER TABLE `valor_propiedad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visita`
--

DROP TABLE IF EXISTS `visita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visita` (
  `id_cliente` int unsigned NOT NULL,
  `id_agente` int unsigned NOT NULL,
  `id_propiedad` int unsigned NOT NULL,
  `fecha_hora_desde` datetime NOT NULL,
  `fecha_hora_visita` datetime NOT NULL,
  PRIMARY KEY (`id_cliente`,`fecha_hora_visita`),
  KEY `fk_visita_agente_asignado_idx` (`id_agente`,`id_propiedad`,`fecha_hora_desde`),
  CONSTRAINT `fk_visita_agente_asignado` FOREIGN KEY (`id_agente`, `id_propiedad`, `fecha_hora_desde`) REFERENCES `agente_asignado` (`id_agente`, `id_propiedad`, `fecha_hora_desde`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_visita_persona` FOREIGN KEY (`id_cliente`) REFERENCES `persona` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visita`
--

LOCK TABLES `visita` WRITE;
/*!40000 ALTER TABLE `visita` DISABLE KEYS */;
INSERT INTO `visita` VALUES (11003,11007,12001,'2023-02-10 10:00:00','2023-03-01 11:00:00'),(11004,11007,12001,'2023-02-10 10:00:00','2023-03-10 12:00:00'),(11013,11007,12008,'2024-02-20 12:00:00','2024-03-01 13:00:00'),(11014,11008,12009,'2023-12-01 11:00:00','2023-12-10 17:00:00'),(11006,11009,12002,'2023-05-01 12:00:00','2023-06-01 13:00:00'),(11015,11009,12010,'2024-05-10 10:00:00','2024-06-10 12:00:00'),(11007,11010,12003,'2023-07-20 14:00:00','2023-08-01 15:00:00'),(11008,11011,12004,'2024-01-10 10:00:00','2024-02-01 10:00:00'),(11009,11012,12005,'2024-04-05 16:00:00','2024-05-01 17:00:00'),(11010,11013,12006,'2023-09-01 13:00:00','2023-10-01 16:00:00'),(11011,11014,12006,'2024-03-01 10:00:00','2024-04-01 14:00:00'),(11012,11015,12007,'2023-11-10 15:00:00','2023-12-01 18:00:00'),(21013,11016,12014,'2025-06-15 15:00:00','2025-06-16 12:00:00'),(21014,11017,12014,'2025-07-01 15:00:00','2025-07-02 13:00:00'),(21015,11018,12015,'2025-07-05 16:00:00','2025-07-06 14:00:00'),(21016,11019,12015,'2025-07-05 16:00:00','2025-07-07 15:00:00'),(21017,11020,12013,'2024-07-20 15:00:00','2024-07-21 11:00:00'),(21018,11021,12006,'2025-04-01 12:00:00','2025-04-02 16:00:00'),(21019,11022,12007,'2025-05-01 13:00:00','2025-05-02 17:00:00'),(21020,11023,12008,'2025-06-01 14:00:00','2025-06-02 14:00:00'),(21021,11024,12009,'2025-07-01 15:00:00','2025-07-02 18:00:00'),(21022,11025,12010,'2025-07-05 16:00:00','2025-07-06 13:00:00'),(21023,11026,12011,'2023-10-15 14:00:00','2023-10-16 17:00:00'),(21024,11027,12012,'2024-06-01 13:00:00','2024-06-02 12:00:00'),(21025,11028,12013,'2024-07-20 15:00:00','2024-07-22 14:00:00'),(21026,11029,12014,'2025-06-15 15:00:00','2025-06-17 15:00:00'),(21027,11030,12015,'2025-07-05 16:00:00','2025-07-08 16:00:00');
/*!40000 ALTER TABLE `visita` ENABLE KEYS */;
UNLOCK TABLES;
/*!50112 SET @disable_bulk_load = IF (@is_rocksdb_supported, 'SET SESSION rocksdb_bulk_load = @old_rocksdb_bulk_load', 'SET @dummy_rocksdb_bulk_load = 0') */;
/*!50112 PREPARE s FROM @disable_bulk_load */;
/*!50112 EXECUTE s */;
/*!50112 DEALLOCATE PREPARE s */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-27  8:29:55

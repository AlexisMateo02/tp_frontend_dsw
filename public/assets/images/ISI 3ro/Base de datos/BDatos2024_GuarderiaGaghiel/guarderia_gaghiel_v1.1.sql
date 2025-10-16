DROP DATABASE IF EXISTS `guarderia_gaghiel`;

CREATE DATABASE  IF NOT EXISTS `guarderia_gaghiel` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `guarderia_gaghiel`;
-- MySQL dump 10.13  Distrib 8.0.39-30, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: guarderia_gaghiel
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
-- Table structure for table `actividad`
--

DROP TABLE IF EXISTS `actividad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actividad` (
  `numero` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo_tipo_embarcacion` int unsigned NOT NULL,
  PRIMARY KEY (`numero`),
  KEY `fk_actividad_tipo_embarcacion_idx` (`codigo_tipo_embarcacion`),
  CONSTRAINT `fk_actividad_tipo_embarcacion` FOREIGN KEY (`codigo_tipo_embarcacion`) REFERENCES `tipo_embarcacion` (`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actividad`
--

LOCK TABLES `actividad` WRITE;
/*!40000 ALTER TABLE `actividad` DISABLE KEYS */;
INSERT INTO `actividad` VALUES (1,'Piratería Básica','Aprende las técnicas fundamentales de la piratería en un kayak. Entiendo todo… excepto la peluca.',4),(2,'Aventuras de Piratas','Surca los mares como un verdadero pirata en tu velero. Solo una vez me gustaría encontrar un cofre de tesoro que no tenga una maldición. ¡Solo una vez!',1),(3,'Rescate en Mary Geoise','Recrea las más épica batalla de todos los tiempos en tu velero. ¡Te salvaré auque me cueste la vida!',1),(4,'Persecución a alta velocidad','Aprende a realizar una persecución de alta velocidad con tu lancha. Hay que luchar… para huir.',2),(5,'3D Maneuvering','Practica movimientos tridimensionales en una tabla kit y convierte en un miembro de los scouts. Sin bajas, no te atrevas a morir.',6),(6,'Titan Hunt','Usa tu tabla kite para evadir y cazar titanes imaginarios. Lucha. Lucha. Lucha. ¡Lucha! ¡¡¡Lucha!!!',6),(7,'Jedi Surf','Domina las olas como un verdadero Jedi en tu tabla de wind surf. Que la fuerza te acompañe.',5),(8,'Vuelo con Dragones','Siente la emoción de volar con dragones mientras navegas en tu tabla de kite. Se necesita más que el fuego para derribarme',6),(9,'Carrera de Podracers','Participa en una emocionante carrera de lanchas al estilo pods. Concéntrate en el momento. Siente, no pienses, usa tu instinto.',2),(10,'Supervivencia 101','Aprende técnicas para sobrevivir con tu kayak en caso de volteo, caida o filtraciones. El problema no es el problema, el problema es tu actitud sobre el problema. ¿Lo entiendes?',4),(11,'Escapada Rápida','Realiza una escapada rápida en tabla de wind surf al estilo de un fugitivo espacial. No conviene hacer enfadar a un Wookiee.',5),(12,'Exporando las profundidades','Sumérgete en aventuras subacuáticas explorando extraños abismos con tu submarino. Todos vemos lo que queremos ver, hay que mirar con mejores ojos.',3),(13,'Desafío de la Tribu del Agua','Enfréntate a desafíos acuáticos inspirados en la Tribu del Agua en un kayak. Oel Ngati Kameie.',4),(14,'Rescate en la Tormenta','Realiza misiones de rescate en condiciones de tormenta a bordo de un velero mientras sobrevives a los ataques de un tiburón. Vas a necesitar un barco más grande',2),(15,'Last Stand','Aprende técnicas de batalla en una batalla espacial a bordo de una nave no convencional. ¡No nos rendiremos a los Centraedis!',8),(16,'Carrera de Asteroides','Navega a través de un campo de asteroides mientras huyes de las naves imperiales. ¡Es la nave que hizo la carrera de Kessel en menos de doce parsecs!',8),(17,'Caza del Kraken','Aprende técnicas para atrapa al legendario Kraken en una misión submarina.',3);
/*!40000 ALTER TABLE `actividad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cama`
--

DROP TABLE IF EXISTS `cama`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cama` (
  `codigo_sector` int unsigned NOT NULL,
  `numero` int unsigned NOT NULL,
  `estado` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`codigo_sector`,`numero`),
  CONSTRAINT `fk_camas_sector` FOREIGN KEY (`codigo_sector`) REFERENCES `sector` (`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cama`
--

LOCK TABLES `cama` WRITE;
/*!40000 ALTER TABLE `cama` DISABLE KEYS */;
INSERT INTO `cama` VALUES (1,1,'Disponible'),(1,2,'Mantenimiento'),(1,3,'Disponible'),(1,4,'Disponible'),(1,5,'Disponible'),(2,1,'Mantenimiento'),(2,2,'Disponible'),(2,3,'Disponible'),(2,4,'Mantenimiento'),(2,5,'Disponible'),(2,6,'Disponible'),(2,7,'Disponible'),(2,8,'Disponible'),(3,1,'Disponible'),(3,2,'Mantenimiento'),(4,1,'Mantenimiento'),(4,2,'Disponible'),(4,3,'Mantenimiento'),(4,4,'Disponible'),(4,5,'Disponible'),(4,6,'Disponible'),(4,7,'Disponible'),(4,8,'Disponible'),(5,1,'Disponible'),(5,2,'Mantenimiento'),(5,3,'Disponible'),(5,4,'Disponible'),(5,5,'Disponible'),(5,6,'Disponible'),(5,7,'Disponible');
/*!40000 ALTER TABLE `cama` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `curso`
--

DROP TABLE IF EXISTS `curso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `curso` (
  `numero` int unsigned NOT NULL AUTO_INCREMENT,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `cupo` int unsigned NOT NULL,
  `legajo_instructor` int unsigned NOT NULL,
  `numero_actividad` int unsigned NOT NULL,
  PRIMARY KEY (`numero`),
  KEY `fk_curso_instructor_actividad_idx` (`legajo_instructor`,`numero_actividad`),
  CONSTRAINT `fk_curso_instructor_actividad` FOREIGN KEY (`legajo_instructor`, `numero_actividad`) REFERENCES `instructor_actividad` (`legajo_instructor`, `numero_actividad`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curso`
--

LOCK TABLES `curso` WRITE;
/*!40000 ALTER TABLE `curso` DISABLE KEYS */;
INSERT INTO `curso` VALUES (1,'2023-11-03 00:00:00','2024-01-18 00:00:00',5,6,5),(2,'2023-11-22 00:00:00','2024-01-12 00:00:00',10,2,6),(3,'2023-11-19 00:00:00','2023-12-21 00:00:00',5,12,9),(4,'2023-11-13 00:00:00','2023-12-30 00:00:00',5,13,11),(5,'2023-11-11 00:00:00','2023-12-31 00:00:00',5,15,16),(8,'2024-01-15 00:00:00','2024-02-24 00:00:00',5,4,5),(9,'2024-03-26 00:00:00','2024-06-18 00:00:00',5,7,6),(10,'2024-03-29 00:00:00','2024-07-04 00:00:00',5,19,7),(11,'2024-04-05 00:00:00','2024-06-05 00:00:00',5,19,9),(12,'2024-04-02 00:00:00','2024-06-19 00:00:00',10,12,11),(13,'2024-04-03 00:00:00','2024-06-10 00:00:00',5,19,11),(14,'2024-04-05 00:00:00','2024-05-25 00:00:00',10,10,15),(15,'2024-03-26 00:00:00','2024-05-20 00:00:00',10,11,15),(16,'2024-04-01 00:00:00','2024-05-09 00:00:00',5,15,16),(24,'2024-07-16 00:00:00','2024-10-01 00:00:00',5,1,5),(25,'2024-08-27 00:00:00','2024-10-15 00:00:00',5,9,2),(26,'2024-08-29 00:00:00','2024-11-03 00:00:00',5,6,5),(27,'2024-09-02 00:00:00','2024-12-01 00:00:00',5,12,8),(28,'2024-09-02 00:00:00','2024-10-13 00:00:00',5,12,12),(29,'2024-09-13 00:00:00','2024-11-20 00:00:00',5,12,15),(32,'2024-10-24 00:00:00','2025-01-19 00:00:00',5,6,5),(33,'2024-11-04 00:00:00','2024-12-05 00:00:00',10,13,11),(34,'2024-10-28 00:00:00','2024-12-20 00:00:00',5,17,13),(35,'2024-10-23 00:00:00','2024-12-24 00:00:00',10,14,14),(36,'2024-10-29 00:00:00','2024-12-24 00:00:00',5,12,15);
/*!40000 ALTER TABLE `curso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dictado_curso`
--

DROP TABLE IF EXISTS `dictado_curso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dictado_curso` (
  `numero_curso` int unsigned NOT NULL,
  `dia_semana` int unsigned NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  PRIMARY KEY (`numero_curso`,`dia_semana`),
  CONSTRAINT `fk_dictado_curso_curso` FOREIGN KEY (`numero_curso`) REFERENCES `curso` (`numero`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dictado_curso`
--

LOCK TABLES `dictado_curso` WRITE;
/*!40000 ALTER TABLE `dictado_curso` DISABLE KEYS */;
INSERT INTO `dictado_curso` VALUES (1,4,'18:00:00','21:00:00'),(2,2,'13:00:00','17:00:00'),(2,3,'13:00:00','15:00:00'),(2,4,'18:00:00','22:00:00'),(3,1,'16:00:00','19:30:00'),(3,5,'13:00:00','16:00:00'),(4,4,'14:00:00','16:00:00'),(4,5,'11:00:00','14:00:00'),(5,3,'17:00:00','19:00:00'),(5,6,'11:00:00','15:00:00'),(8,1,'17:00:00','20:00:00'),(9,2,'13:00:00','15:00:00'),(10,2,'14:00:00','19:00:00'),(10,3,'12:00:00','14:00:00'),(11,2,'13:00:00','17:30:00'),(11,5,'12:00:00','15:30:00'),(11,6,'15:00:00','18:30:00'),(12,5,'14:00:00','16:30:00'),(12,6,'11:00:00','13:30:00'),(13,3,'14:00:00','19:00:00'),(13,5,'17:00:00','19:30:00'),(14,1,'13:00:00','16:00:00'),(15,4,'12:00:00','16:00:00'),(15,5,'10:00:00','13:00:00'),(15,6,'12:00:00','15:00:00'),(16,3,'11:00:00','14:30:00'),(16,4,'11:00:00','15:00:00'),(16,5,'16:00:00','19:00:00'),(24,4,'13:00:00','16:00:00'),(24,6,'11:00:00','14:00:00'),(25,4,'12:00:00','16:00:00'),(26,0,'15:00:00','18:00:00'),(26,5,'15:00:00','17:00:00'),(26,6,'14:00:00','18:00:00'),(27,2,'11:00:00','13:00:00'),(28,1,'16:00:00','20:30:00'),(28,5,'11:00:00','14:00:00'),(29,3,'14:00:00','17:00:00'),(29,5,'18:00:00','21:00:00'),(32,0,'13:00:00','17:00:00'),(32,6,'11:00:00','13:30:00'),(32,7,'16:00:00','19:00:00'),(33,1,'15:00:00','19:00:00'),(33,6,'15:00:00','17:00:00'),(34,1,'18:00:00','21:00:00'),(34,7,'12:00:00','15:30:00'),(35,2,'18:00:00','20:00:00'),(35,4,'17:00:00','20:00:00'),(35,5,'12:00:00','15:30:00'),(35,6,'13:00:00','17:30:00'),(36,2,'13:00:00','16:00:00'),(36,3,'13:00:00','17:00:00');
/*!40000 ALTER TABLE `dictado_curso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `embarcacion`
--

DROP TABLE IF EXISTS `embarcacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `embarcacion` (
  `hin` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `codigo_tipo_embarcacion` int unsigned NOT NULL,
  `numero_socio` int unsigned NOT NULL,
  PRIMARY KEY (`hin`),
  KEY `fk_embarcacion_tipo_idx` (`codigo_tipo_embarcacion`),
  KEY `fk_embarcacion_socio_idx` (`numero_socio`),
  CONSTRAINT `fk_embarcacion_socio` FOREIGN KEY (`numero_socio`) REFERENCES `socio` (`numero`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_embarcacion_tipo` FOREIGN KEY (`codigo_tipo_embarcacion`) REFERENCES `tipo_embarcacion` (`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `embarcacion`
--

LOCK TABLES `embarcacion` WRITE;
/*!40000 ALTER TABLE `embarcacion` DISABLE KEYS */;
INSERT INTO `embarcacion` VALUES ('CAN001','RX-0 Unicorn','Canoa resistente con gran capacidad de carga.',7,32),('CAN002','MSN-06S Sinanju','Canoa blindada con alta resistencia.',7,31),('CAN003','MS-06F Zaku II','Canoa ágil con diseño aerodinámico.',7,31),('CAN004','MS-05 Zaku I','Canoa avanzada con gran maniobrabilidad.',7,35),('CAN005','MSN-02 Zeong','Canoa ligera y rápida con diseño moderno.',7,31),('CAN006','RX-78NT-1 Alex','Canoa con alta capacidad de respuesta y maniobrabilidad.',7,37),('ESP001','Bebop','Nave con forma de pez espada y gran capacidad de carga.',8,8),('ESP002','Swordfish II','Caza ágil con diseño aerodinámico.',8,8),('ESP003','Red Tail','Nave maniobrable con gran potencia de fuego.',8,10),('ESP004','Aloha Oe','Nave colorida con compartimentos para captura de alienígenas.',8,8),('ESP005','Arcadia','Nave de combate con diseño antiguo y robusto.',8,12),('ESP006','Death Shadow','Nave imponente con armamento pesado.',8,13),('ESP007','Andromeda','Nave avanzada con potentes cañones de energía.',8,14),('ESP008','Brünhild','Nave insignia rápida y fuertemente blindada.',8,15),('ESP009','Hyperion','Nave de exploración con gran capacidad de almacenamiento.',8,16),('ESP010','Nadesico','Nave de guerra con alta capacidad de maniobra y ataque.',8,17),('ESP011','Yamato','Acorazado legendario con un poderoso cañón de onda.',8,18),('ESP012','SDF-1 Macross','Nave transformable con capacidad de combate y transporte.',8,19),('ESP013','Macross Quarter','Nave compacta y poderosa con capacidad de transformación.',8,19),('ESP014','Enterprise','Nave de exploración intergaláctica con avanzada tecnología.',8,21),('ESP015','Galaxy Express 999','Tren con capacidad para viajar a través de galaxias.',8,22),('KAY001','VF-1 Valkyrie','Kayak ágil con diseño aerodinámico.',4,19),('KAY002','VF-25 Messiah','Kayak avanzado con gran maniobrabilidad.',4,24),('KAY003','YF-19','Kayak robusto con alta capacidad de respuesta.',4,15),('KIT001','RX-93 Nu','Tabla de kite con diseño robusto y estable.',6,29),('KIT002','MS-18E Kampfer','Tabla de kite ágil con capacidad de altas velocidades.',6,30),('KIT003','MS-07B Gouf','Tabla de kite ligera con gran maniobrabilidad.',6,31),('LAN001','Miss Love Duck','Barco con adornos de corazón y un pato gigante en la proa.',2,3),('LAN002','Big Top','Barco circo con una carpa de circo y cañones para espectáculos.',2,4),('SUB001','Polar Tang','Submarino ágil y rápido con forma de pez globo.',3,6),('VEL001','Going Merry','Barco mediano con una cabeza de carnero en la proa.',1,1),('VEL002','Thousand Sunny','Barco grande con una cabeza de león en la proa.',1,1),('VEL003','Red Force','Velero robusto y rápido con velas rojas.',1,5),('VEL004','Victoria Punk','Velero robusto con armamento pesado.',1,7),('WSF001','VF-11 Thunderbolt','Tabla de wind surf ligera y rápida.',5,24),('WSF002','VF-0 Phoenix','Tabla de wind surf resistente con gran estabilidad.',5,27),('WSF003','VF-4 Lightning III','Tabla de wind surf avanzada con alta maniobrabilidad.',5,24);
/*!40000 ALTER TABLE `embarcacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `embarcacion_cama`
--

DROP TABLE IF EXISTS `embarcacion_cama`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `embarcacion_cama` (
  `hin` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo_sector` int unsigned NOT NULL,
  `numero_cama` int unsigned NOT NULL,
  `fecha_hora_contrato` datetime NOT NULL,
  `fecha_hora_baja_contrato` datetime DEFAULT NULL,
  PRIMARY KEY (`hin`,`fecha_hora_contrato`),
  KEY `fk_embarcacion_cama_cama_idx` (`codigo_sector`,`numero_cama`),
  CONSTRAINT `fk_embarcacion_cama_cama` FOREIGN KEY (`codigo_sector`, `numero_cama`) REFERENCES `cama` (`codigo_sector`, `numero`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_embarcacion_cama_embarcacion` FOREIGN KEY (`hin`) REFERENCES `embarcacion` (`hin`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `embarcacion_cama`
--

LOCK TABLES `embarcacion_cama` WRITE;
/*!40000 ALTER TABLE `embarcacion_cama` DISABLE KEYS */;
INSERT INTO `embarcacion_cama` VALUES ('CAN002',5,1,'2023-04-11 18:22:05','2023-06-11 18:22:05'),('CAN002',1,1,'2023-06-11 18:22:05',NULL),('CAN004',3,1,'2023-06-05 10:10:50','2023-08-20 10:10:50'),('CAN004',3,1,'2023-08-20 10:10:50','2023-10-30 10:10:50'),('CAN004',1,3,'2023-10-30 10:10:50',NULL),('CAN005',1,1,'2023-02-02 08:22:36','2023-04-14 08:22:36'),('CAN005',1,3,'2023-04-14 08:22:36',NULL),('CAN006',3,1,'2023-02-28 11:33:47',NULL),('ESP003',2,3,'2023-02-18 09:50:03','2023-04-09 09:50:03'),('ESP003',2,5,'2023-04-09 09:50:03',NULL),('ESP006',1,4,'2023-01-25 21:22:09','2023-04-08 21:22:09'),('ESP006',2,6,'2023-04-08 21:22:09','2024-07-16 13:58:49'),('ESP007',2,5,'2023-04-27 23:13:56','2023-07-08 23:13:56'),('ESP007',2,2,'2023-07-08 23:13:56','2023-09-29 23:13:56'),('ESP007',2,3,'2023-09-29 23:13:56',NULL),('ESP008',1,5,'2023-03-11 19:03:58','2023-06-25 19:03:58'),('ESP008',2,6,'2023-06-25 19:03:58','2023-08-17 19:03:58'),('ESP008',2,5,'2023-08-17 19:03:58',NULL),('ESP010',2,3,'2023-11-27 13:10:55','2024-01-20 13:10:55'),('ESP010',2,2,'2024-01-20 13:10:55','2024-03-12 13:10:55'),('ESP010',2,3,'2024-03-12 13:10:55','2024-07-28 13:58:51'),('ESP011',2,8,'2023-01-26 10:50:04','2023-04-02 10:50:04'),('ESP011',2,2,'2023-04-02 10:50:04','2023-06-22 10:50:04'),('ESP011',2,2,'2023-06-22 10:50:04',NULL),('ESP013',2,5,'2023-01-21 16:22:39','2023-03-12 16:22:39'),('ESP013',5,5,'2023-03-12 16:22:39','2023-05-19 16:22:39'),('ESP013',2,7,'2023-05-19 16:22:39',NULL),('KAY001',3,1,'2023-03-15 16:12:29','2023-05-20 16:12:29'),('KAY001',5,5,'2023-05-20 16:12:29','2023-07-23 16:12:29'),('KAY001',1,1,'2023-07-23 16:12:29',NULL),('KAY003',5,6,'2023-05-25 11:44:37','2023-07-14 11:44:37'),('KAY003',5,1,'2023-07-14 11:44:37','2023-10-07 11:44:37'),('KAY003',5,6,'2023-10-07 11:44:37',NULL),('LAN001',4,6,'2023-04-05 09:22:12','2023-06-15 09:22:12'),('LAN001',4,2,'2023-06-15 09:22:12',NULL),('LAN002',4,5,'2023-01-12 15:02:17','2023-04-20 15:02:17'),('LAN002',4,7,'2023-04-20 15:02:17','2023-08-07 15:02:17'),('LAN002',4,2,'2023-08-07 15:02:17','2024-07-22 13:58:49'),('SUB001',4,5,'2023-10-22 22:53:45',NULL),('VEL001',4,8,'2023-04-25 18:15:44','2023-06-11 18:15:44'),('VEL001',4,5,'2023-06-11 18:15:44',NULL),('VEL002',4,2,'2023-01-04 09:01:35',NULL),('VEL003',5,7,'2023-05-27 22:52:36','2023-08-03 22:52:36'),('VEL003',4,4,'2023-08-03 22:52:36','2024-07-25 13:58:49'),('VEL004',4,4,'2023-04-11 20:24:41','2023-06-01 20:24:41'),('VEL004',4,5,'2023-06-01 20:24:41','2023-07-24 20:24:41'),('VEL004',4,2,'2023-07-24 20:24:41','2024-07-30 13:58:48'),('WSF001',5,3,'2023-10-16 23:01:21','2023-11-27 23:01:21'),('WSF001',3,1,'2023-11-27 23:01:21','2024-01-26 23:01:21'),('WSF001',3,1,'2024-01-26 23:01:21','2024-07-11 13:58:48'),('WSF002',1,1,'2023-06-28 12:01:03','2023-08-15 12:01:03'),('WSF002',1,3,'2023-08-15 12:01:03','2023-09-26 12:01:03'),('WSF002',1,3,'2023-09-26 12:01:03',NULL),('WSF003',5,4,'2023-05-09 18:23:57','2023-07-01 18:23:57'),('WSF003',5,4,'2023-07-01 18:23:57','2023-09-19 18:23:57'),('WSF003',1,1,'2023-09-19 18:23:57',NULL);
/*!40000 ALTER TABLE `embarcacion_cama` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inscripcion`
--

DROP TABLE IF EXISTS `inscripcion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inscripcion` (
  `numero_curso` int unsigned NOT NULL,
  `numero_socio` int unsigned NOT NULL,
  `fecha_hora_inscripcion` datetime NOT NULL,
  PRIMARY KEY (`numero_curso`,`numero_socio`),
  KEY `fk_inscripcion_socio_idx` (`numero_socio`),
  CONSTRAINT `fk_inscripcion_curso` FOREIGN KEY (`numero_curso`) REFERENCES `curso` (`numero`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_inscripcion_socio` FOREIGN KEY (`numero_socio`) REFERENCES `socio` (`numero`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inscripcion`
--

LOCK TABLES `inscripcion` WRITE;
/*!40000 ALTER TABLE `inscripcion` DISABLE KEYS */;
INSERT INTO `inscripcion` VALUES (2,8,'2023-11-09 00:00:00'),(2,16,'2023-11-16 00:00:00'),(2,18,'2023-11-11 00:00:00'),(2,22,'2023-11-02 00:00:00'),(2,27,'2023-11-16 00:00:00'),(2,28,'2023-11-08 00:00:00'),(2,30,'2023-10-31 00:00:00'),(2,31,'2023-11-18 00:00:00'),(2,32,'2023-11-17 00:00:00'),(2,39,'2023-11-11 00:00:00'),(4,4,'2023-11-02 00:00:00'),(4,12,'2023-11-09 00:00:00'),(4,21,'2023-11-10 00:00:00'),(4,25,'2023-11-01 00:00:00'),(4,31,'2023-11-09 00:00:00'),(4,35,'2023-11-07 00:00:00'),(8,4,'2023-12-28 00:00:00'),(8,15,'2024-01-02 00:00:00'),(8,33,'2024-01-04 00:00:00'),(8,38,'2023-12-25 00:00:00'),(9,6,'2024-03-05 00:00:00'),(9,17,'2024-03-13 00:00:00'),(9,24,'2024-03-23 00:00:00'),(10,6,'2024-03-16 00:00:00'),(10,27,'2024-03-22 00:00:00'),(10,28,'2024-03-16 00:00:00'),(10,38,'2024-03-12 00:00:00'),(11,8,'2024-03-17 00:00:00'),(11,12,'2024-03-28 00:00:00'),(11,23,'2024-03-16 00:00:00'),(11,32,'2024-04-01 00:00:00'),(12,6,'2024-03-12 00:00:00'),(12,7,'2024-03-26 00:00:00'),(12,17,'2024-03-19 00:00:00'),(12,19,'2024-03-10 00:00:00'),(12,24,'2024-03-26 00:00:00'),(12,26,'2024-03-12 00:00:00'),(12,27,'2024-03-13 00:00:00'),(12,30,'2024-03-10 00:00:00'),(12,33,'2024-03-18 00:00:00'),(14,4,'2024-03-22 00:00:00'),(14,8,'2024-03-22 00:00:00'),(14,19,'2024-03-15 00:00:00'),(14,36,'2024-03-13 00:00:00'),(14,37,'2024-03-25 00:00:00'),(14,38,'2024-03-26 00:00:00'),(14,39,'2024-03-15 00:00:00'),(15,4,'2024-03-16 00:00:00'),(15,14,'2024-03-07 00:00:00'),(15,20,'2024-03-22 00:00:00'),(15,25,'2024-03-22 00:00:00'),(15,29,'2024-03-19 00:00:00'),(15,30,'2024-03-19 00:00:00'),(15,39,'2024-03-02 00:00:00'),(25,8,'2024-08-09 00:00:00'),(25,23,'2024-08-18 00:00:00'),(25,28,'2024-08-10 00:00:00'),(25,30,'2024-08-20 00:00:00'),(25,35,'2024-08-11 00:00:00'),(25,37,'2024-08-13 00:00:00'),(26,6,'2024-08-13 00:00:00'),(26,31,'2024-08-20 00:00:00'),(26,32,'2024-08-10 00:00:00'),(26,38,'2024-08-14 00:00:00'),(26,39,'2024-08-17 00:00:00'),(28,14,'2024-08-21 00:00:00'),(28,16,'2024-08-26 00:00:00'),(28,23,'2024-08-10 00:00:00'),(28,26,'2024-08-17 00:00:00'),(28,29,'2024-08-22 00:00:00'),(28,31,'2024-08-21 00:00:00'),(29,12,'2024-09-09 00:00:00'),(29,17,'2024-08-25 00:00:00'),(29,20,'2024-08-22 00:00:00'),(29,24,'2024-09-03 00:00:00'),(29,36,'2024-08-22 00:00:00'),(32,12,'2024-10-02 00:00:00'),(32,19,'2024-10-18 00:00:00'),(32,25,'2024-10-01 00:00:00'),(32,38,'2024-10-08 00:00:00'),(33,4,'2024-10-16 00:00:00'),(33,10,'2024-10-15 00:00:00'),(33,18,'2024-10-11 00:00:00'),(33,24,'2024-10-22 00:00:00'),(33,26,'2024-10-16 00:00:00'),(33,29,'2024-10-18 00:00:00'),(33,36,'2024-10-24 00:00:00'),(34,13,'2024-10-06 00:00:00'),(34,17,'2024-10-08 00:00:00'),(34,25,'2024-10-25 00:00:00'),(34,28,'2024-10-15 00:00:00'),(34,30,'2024-10-21 00:00:00'),(35,6,'2024-10-07 00:00:00'),(35,8,'2024-10-08 00:00:00'),(35,14,'2024-10-19 00:00:00'),(35,15,'2024-10-07 00:00:00'),(35,17,'2024-10-14 00:00:00'),(35,19,'2024-10-11 00:00:00'),(35,33,'2024-10-03 00:00:00'),(36,6,'2024-10-11 00:00:00'),(36,13,'2024-10-12 00:00:00'),(36,14,'2024-10-10 00:00:00'),(36,16,'2024-10-15 00:00:00'),(36,22,'2024-10-15 00:00:00'),(36,35,'2024-10-07 00:00:00');
/*!40000 ALTER TABLE `inscripcion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instructor`
--

DROP TABLE IF EXISTS `instructor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instructor` (
  `legajo` int unsigned NOT NULL,
  `cuil` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`legajo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instructor`
--

LOCK TABLES `instructor` WRITE;
/*!40000 ALTER TABLE `instructor` DISABLE KEYS */;
INSERT INTO `instructor` VALUES (1,'20-12345678-9','Levi','Ackerman','555-0101'),(2,'20-23456789-0','Mikasa','Ackerman','555-0102'),(3,'20-34567890-1','Zeke','Yeager','555-0103'),(4,'20-45678901-2','Armin','Arlert','555-0104'),(5,'20-56789012-3','Erwin','Smith','555-0105'),(6,'20-67890123-4','Jean','Kirstein','555-0106'),(7,'20-78901234-5','Hange','Zoë','555-0107'),(8,'20-89012345-6','Edward','Wong','555-0108'),(9,'20-90123456-7','Captain','Harlock','555-0109'),(10,'20-01234567-8','Yuki','Mori','555-0110'),(11,'20-12345678-0','Lafiel','Abriel','555-0111'),(12,'20-23456789-1','Jinto','Linn','555-0112'),(13,'20-34567890-2','Han','Solo','555-0113'),(14,'20-45678901-3','Yang','Wen-li','555-0114'),(15,'20-56789012-4','Reinhard','von Lohengramm','555-0115'),(16,'20-67890123-5','Leia','Organa','555-0116'),(17,'20-78901234-6','Rei','Ayanami','555-0117'),(18,'20-89012345-7','Qui-Gon','Jinn','555-0118'),(19,'20-90123456-8','Obi-Wan','Kenoby','555-0119');
/*!40000 ALTER TABLE `instructor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instructor_actividad`
--

DROP TABLE IF EXISTS `instructor_actividad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instructor_actividad` (
  `legajo_instructor` int unsigned NOT NULL,
  `numero_actividad` int unsigned NOT NULL,
  PRIMARY KEY (`legajo_instructor`,`numero_actividad`),
  KEY `fk_instructor_actividad_actividad_idx` (`numero_actividad`),
  CONSTRAINT `fk_instructor_actividad_actividad` FOREIGN KEY (`numero_actividad`) REFERENCES `actividad` (`numero`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_instructor_actividad_instructor` FOREIGN KEY (`legajo_instructor`) REFERENCES `instructor` (`legajo`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instructor_actividad`
--

LOCK TABLES `instructor_actividad` WRITE;
/*!40000 ALTER TABLE `instructor_actividad` DISABLE KEYS */;
INSERT INTO `instructor_actividad` VALUES (9,1),(9,2),(1,5),(2,5),(4,5),(6,5),(1,6),(2,6),(3,6),(5,6),(6,6),(7,6),(18,7),(19,7),(12,8),(12,9),(18,9),(19,9),(8,10),(12,10),(13,10),(12,11),(13,11),(19,11),(12,12),(17,13),(11,14),(14,14),(10,15),(11,15),(12,15),(14,15),(15,15),(10,16),(11,16),(13,16),(14,16),(15,16),(19,16),(17,17);
/*!40000 ALTER TABLE `instructor_actividad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salida`
--

DROP TABLE IF EXISTS `salida`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salida` (
  `hin` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_hora_salida` datetime NOT NULL,
  `fecha_hora_regreso_tentativo` datetime NOT NULL,
  `fecha_hora_regreso_real` datetime DEFAULT NULL,
  PRIMARY KEY (`hin`,`fecha_hora_salida`),
  CONSTRAINT `fk_salida_embarcacion` FOREIGN KEY (`hin`) REFERENCES `embarcacion` (`hin`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salida`
--

LOCK TABLES `salida` WRITE;
/*!40000 ALTER TABLE `salida` DISABLE KEYS */;
INSERT INTO `salida` VALUES ('CAN002','2023-04-13 23:22:05','2023-04-14 14:22:05','2023-04-16 13:22:05'),('CAN002','2023-05-24 13:22:05','2023-05-24 21:22:05','2023-05-24 17:08:33'),('CAN002','2023-06-09 05:22:05','2023-06-09 17:22:05','2023-06-09 13:23:16'),('CAN002','2023-06-22 04:22:05','2023-06-23 18:22:05','2023-06-23 15:33:28'),('CAN002','2023-07-24 00:22:05','2023-07-24 07:22:05','2023-07-24 04:44:43'),('CAN002','2023-07-27 05:22:05','2023-07-28 03:22:05','2023-07-27 13:02:00'),('CAN002','2023-08-18 17:22:05','2023-08-20 14:22:05','2023-08-20 08:20:47'),('CAN002','2023-10-14 15:22:05','2023-10-16 15:22:05','2023-10-15 05:04:49'),('CAN002','2023-11-15 15:22:05','2023-11-19 07:22:05','2023-11-18 16:23:20'),('CAN002','2023-12-25 12:22:05','2023-12-27 17:22:05','2023-12-26 03:50:21'),('CAN002','2024-02-07 03:22:05','2024-02-08 16:22:05','2024-02-08 15:15:55'),('CAN002','2024-04-15 06:22:05','2024-04-17 04:22:05','2024-04-17 03:13:47'),('CAN002','2024-05-01 01:22:05','2024-05-03 19:22:05','2024-05-03 10:22:05'),('CAN004','2023-06-19 17:10:50','2023-06-22 15:10:50','2023-06-22 12:46:42'),('CAN004','2023-07-31 12:10:50','2023-08-01 09:10:50','2023-08-01 07:08:11'),('CAN004','2023-09-28 06:10:50','2023-09-29 12:10:50','2023-09-30 13:10:50'),('CAN004','2023-11-21 08:10:50','2023-11-24 21:10:50','2023-11-23 20:10:50'),('CAN004','2023-12-06 00:10:50','2023-12-06 05:10:50','2023-12-07 21:10:50'),('CAN004','2023-12-26 05:10:50','2023-12-27 10:10:50','2023-12-26 23:03:02'),('CAN004','2024-07-11 15:10:50','2024-07-13 11:10:50','2024-07-12 07:35:49'),('CAN004','2024-07-20 10:10:50','2024-07-25 10:10:50','2024-07-21 04:10:50'),('CAN005','2023-02-14 21:22:36','2023-02-16 20:22:36','2023-02-14 22:10:10'),('CAN005','2023-03-25 09:22:36','2023-03-27 06:22:36','2023-03-27 04:48:12'),('CAN005','2023-03-30 00:22:36','2023-03-30 06:22:36','2023-03-30 05:01:27'),('CAN005','2023-04-25 17:22:36','2023-04-26 12:22:36','2023-04-26 05:22:36'),('CAN005','2023-06-11 00:22:36','2023-06-12 20:22:36','2023-06-12 19:24:03'),('CAN005','2023-07-24 01:22:36','2023-07-26 05:22:36','2023-07-25 06:46:27'),('CAN005','2023-08-06 18:22:36','2023-08-08 23:22:36','2023-08-08 17:43:05'),('CAN005','2023-09-05 01:22:36','2023-09-07 03:22:36','2023-09-08 22:22:36'),('CAN005','2023-09-14 21:22:36','2023-09-16 18:22:36','2023-09-16 08:02:01'),('CAN005','2023-10-17 18:22:36','2023-10-20 09:22:36','2023-10-18 05:09:16'),('CAN005','2024-04-17 15:22:36','2024-04-18 00:22:36','2024-04-17 20:16:51'),('CAN006','2023-02-28 22:33:47','2023-03-02 10:33:47','2023-03-02 07:33:47'),('CAN006','2023-03-12 04:33:47','2023-03-12 18:33:47','2023-03-13 02:33:47'),('CAN006','2023-03-25 11:33:47','2023-03-27 00:33:47','2023-03-29 20:33:47'),('CAN006','2023-05-07 22:33:47','2023-05-10 15:33:47','2023-05-08 12:17:56'),('CAN006','2023-06-15 13:33:47','2023-06-16 16:33:47','2023-06-16 00:57:14'),('CAN006','2023-07-07 20:33:47','2023-07-08 10:33:47','2023-07-08 03:13:09'),('CAN006','2024-02-29 02:33:47','2024-03-03 14:33:47','2024-02-29 11:55:55'),('CAN006','2024-03-21 01:33:47','2024-03-21 20:33:47','2024-03-21 04:03:32'),('CAN006','2024-04-05 22:33:47','2024-04-06 08:33:47','2024-04-06 11:33:47'),('CAN006','2024-04-16 14:33:47','2024-04-17 03:33:47','2024-04-16 20:33:47'),('ESP003','2023-03-19 01:50:03','2023-03-20 16:50:03','2023-03-19 14:24:02'),('ESP003','2023-04-03 15:50:03','2023-04-04 07:50:03','2023-04-04 00:50:03'),('ESP003','2023-05-07 18:50:03','2023-05-09 11:50:03','2023-05-10 02:50:03'),('ESP003','2023-06-01 20:50:03','2023-06-04 04:50:03','2023-06-02 08:59:05'),('ESP003','2023-07-29 12:50:03','2023-07-30 13:50:03','2023-07-29 15:47:24'),('ESP003','2023-08-09 00:50:03','2023-08-09 14:50:03','2023-08-09 13:59:52'),('ESP003','2023-11-02 14:50:03','2023-11-03 12:50:03','2023-11-02 22:27:31'),('ESP003','2024-02-19 11:50:03','2024-02-23 10:50:03','2024-02-23 02:28:48'),('ESP003','2024-03-11 14:50:03','2024-03-15 07:50:03','2024-03-13 13:10:07'),('ESP003','2024-03-25 00:50:03','2024-03-26 02:50:03','2024-03-26 02:50:03'),('ESP003','2024-04-08 02:50:03','2024-04-08 15:50:03','2024-04-08 14:06:13'),('ESP003','2024-05-03 15:50:03','2024-05-04 15:50:03','2024-05-04 10:22:29'),('ESP006','2023-01-27 00:22:09','2023-01-27 03:22:09','2023-01-31 03:22:09'),('ESP006','2023-02-08 10:22:09','2023-02-09 16:22:09','2023-02-08 18:13:45'),('ESP006','2023-03-24 23:22:09','2023-03-27 00:22:09','2023-03-26 23:59:56'),('ESP006','2023-04-04 02:22:09','2023-04-07 09:22:09','2023-04-05 15:22:09'),('ESP006','2023-05-05 03:22:09','2023-05-08 23:22:09','2023-05-09 17:22:09'),('ESP006','2023-07-04 03:22:09','2023-07-07 19:22:09','2023-07-07 01:22:09'),('ESP006','2023-07-29 10:22:09','2023-08-02 01:22:09','2023-08-02 02:22:09'),('ESP006','2023-09-25 05:22:09','2023-09-26 07:22:09','2023-09-25 09:57:02'),('ESP006','2023-10-06 09:22:09','2023-10-07 08:22:09','2023-10-08 10:22:09'),('ESP006','2024-03-28 07:22:09','2024-03-30 15:22:09','2024-03-30 09:58:32'),('ESP007','2023-05-23 06:13:56','2023-05-23 17:13:56','2023-05-25 00:13:56'),('ESP007','2023-06-23 03:13:56','2023-06-26 03:13:56','2023-06-24 15:13:56'),('ESP007','2023-07-05 08:13:56','2023-07-09 04:13:56','2023-07-06 11:13:56'),('ESP007','2023-07-16 21:13:56','2023-07-17 21:13:56','2023-07-17 20:59:17'),('ESP007','2023-09-04 10:13:56','2023-09-06 00:13:56','2023-09-04 19:16:42'),('ESP007','2023-10-29 15:13:56','2023-10-31 14:13:56','2023-10-31 00:13:56'),('ESP007','2023-12-02 16:13:56','2023-12-05 01:13:56','2023-12-03 04:49:06'),('ESP007','2023-12-23 00:13:56','2023-12-24 02:13:56','2023-12-23 10:22:08'),('ESP007','2024-04-30 22:13:56','2024-05-01 12:13:56','2024-05-01 02:14:57'),('ESP007','2024-06-04 16:13:56','2024-06-05 15:13:56','2024-06-04 22:19:42'),('ESP007','2024-07-12 01:13:56','2024-07-12 11:13:56','2024-07-12 19:13:56'),('ESP008','2023-03-15 21:03:58','2023-03-18 18:03:58','2023-03-17 05:06:46'),('ESP008','2023-04-23 22:03:58','2023-04-26 07:03:58','2023-04-25 04:06:33'),('ESP008','2023-05-05 21:03:58','2023-05-06 11:03:58','2023-05-06 05:03:58'),('ESP008','2023-05-22 04:03:58','2023-05-22 04:03:58','2023-05-22 04:03:58'),('ESP008','2023-06-19 23:03:58','2023-06-21 12:03:58','2023-06-22 23:03:58'),('ESP008','2023-07-07 18:03:58','2023-07-08 13:03:58','2023-07-08 06:00:57'),('ESP008','2023-08-30 20:03:58','2023-08-31 18:03:58','2023-08-31 05:16:30'),('ESP008','2023-10-12 05:03:58','2023-10-12 11:03:58','2023-10-12 19:03:58'),('ESP008','2023-10-21 07:03:58','2023-10-23 07:03:58','2023-10-25 19:03:58'),('ESP008','2024-04-01 16:03:58','2024-04-04 07:03:58','2024-04-02 05:03:04'),('ESP010','2023-11-28 01:10:55','2023-12-02 05:10:55','2023-11-29 23:10:55'),('ESP010','2023-12-12 07:10:55','2023-12-15 01:10:55','2023-12-14 10:19:09'),('ESP010','2024-01-26 10:10:55','2024-01-26 11:10:55','2024-01-26 10:26:16'),('ESP010','2024-02-02 19:10:55','2024-02-06 11:10:55','2024-02-05 03:10:55'),('ESP011','2023-03-06 16:50:04','2023-03-06 20:50:04','2023-03-09 11:50:04'),('ESP011','2023-03-24 06:50:04','2023-03-25 18:50:04','2023-03-25 17:10:51'),('ESP011','2023-04-06 02:50:04','2023-04-06 11:50:04','2023-04-08 14:50:04'),('ESP011','2023-05-07 15:50:04','2023-05-09 07:50:04','2023-05-07 15:57:50'),('ESP011','2023-06-02 00:50:04','2023-06-05 07:50:04','2023-06-02 12:59:59'),('ESP011','2023-09-08 18:50:04','2023-09-08 21:50:04','2023-09-08 21:06:55'),('ESP011','2023-10-08 06:50:04','2023-10-09 11:50:04','2023-10-09 11:50:04'),('ESP011','2024-02-13 07:50:04','2024-02-15 11:50:04','2024-02-14 01:28:28'),('ESP011','2024-02-15 11:50:04','2024-02-15 12:50:04','2024-02-15 12:15:00'),('ESP011','2024-03-30 20:50:04','2024-03-31 20:50:04','2024-03-30 22:15:41'),('ESP013','2023-02-03 07:22:39','2023-02-05 13:22:39','2023-02-03 10:07:52'),('ESP013','2023-03-07 23:22:39','2023-03-10 19:22:39','2023-03-08 04:35:10'),('ESP013','2023-04-03 08:22:39','2023-04-05 16:22:39','2023-04-03 21:15:29'),('ESP013','2023-05-04 05:22:39','2023-05-05 00:22:39','2023-05-04 22:51:44'),('ESP013','2023-05-31 13:22:39','2023-06-01 00:22:39','2023-05-31 23:24:03'),('ESP013','2023-07-11 22:22:39','2023-07-13 17:22:39','2023-07-13 08:34:32'),('ESP013','2024-01-21 18:22:39','2024-01-23 05:22:39','2024-01-22 23:22:39'),('ESP013','2024-02-27 18:22:39','2024-03-01 07:22:39','2024-02-28 09:11:41'),('KAY001','2023-03-16 04:12:29','2023-03-20 14:12:29','2023-03-17 09:12:29'),('KAY001','2023-05-21 18:12:29','2023-05-24 15:12:29','2023-05-24 17:12:29'),('KAY001','2023-11-28 11:12:29','2023-12-02 00:12:29','2023-12-01 09:38:24'),('KAY001','2024-03-18 17:12:29','2024-03-21 02:12:29','2024-03-19 16:49:31'),('KAY001','2024-04-02 10:12:29','2024-04-03 03:12:29','2024-04-02 20:10:03'),('KAY003','2023-06-07 18:44:37','2023-06-08 18:44:37','2023-06-08 11:12:46'),('KAY003','2023-06-22 04:44:37','2023-06-22 17:44:37','2023-06-22 13:30:00'),('KAY003','2023-07-02 15:44:37','2023-07-02 20:44:37','2023-07-02 21:44:37'),('KAY003','2023-07-09 22:44:37','2023-07-10 13:44:37','2023-07-10 03:22:52'),('KAY003','2023-07-22 09:44:37','2023-07-24 02:44:37','2023-07-23 12:44:37'),('KAY003','2023-08-12 23:44:37','2023-08-13 23:44:37','2023-08-13 12:20:52'),('KAY003','2023-09-05 18:44:37','2023-09-06 02:44:37','2023-09-09 07:44:37'),('KAY003','2023-09-20 06:44:37','2023-09-23 07:44:37','2023-09-22 09:43:24'),('KAY003','2023-09-30 10:44:37','2023-09-30 11:44:37','2023-09-30 11:39:35'),('KAY003','2023-12-14 12:44:37','2023-12-15 08:44:37','2023-12-14 22:27:57'),('KAY003','2024-02-06 12:44:37','2024-02-09 23:44:37','2024-02-08 21:20:23'),('KAY003','2024-07-14 04:44:37','2024-07-18 12:44:37','2024-07-18 07:39:11'),('LAN001','2023-04-16 19:22:12','2023-04-17 04:22:12','2023-04-19 05:22:12'),('LAN001','2023-05-26 01:22:12','2023-05-27 23:22:12','2023-05-27 10:00:44'),('LAN001','2023-06-02 03:22:12','2023-06-03 12:22:12','2023-06-03 02:18:08'),('LAN001','2023-07-16 09:22:12','2023-07-18 08:22:12','2023-07-17 01:37:12'),('LAN001','2023-08-12 19:22:12','2023-08-15 10:22:12','2023-08-14 11:56:23'),('LAN001','2023-09-20 09:22:12','2023-09-24 17:22:12','2023-09-21 17:22:12'),('LAN001','2023-11-17 22:22:12','2023-11-20 02:22:12','2023-11-18 07:51:55'),('LAN001','2024-04-25 02:22:12','2024-04-26 17:22:12','2024-04-27 03:22:12'),('LAN001','2024-05-10 00:22:12','2024-05-10 06:22:12','2024-05-10 06:15:24'),('LAN001','2024-06-07 14:22:12','2024-06-10 04:22:12','2024-06-08 12:32:51'),('LAN002','2023-02-23 11:02:17','2023-02-24 16:02:17','2023-02-24 11:32:56'),('LAN002','2023-03-03 21:02:17','2023-03-04 09:02:17','2023-03-03 22:52:23'),('LAN002','2023-04-28 14:02:17','2023-04-29 21:02:17','2023-04-28 21:08:08'),('LAN002','2023-05-23 12:02:17','2023-05-27 21:02:17','2023-05-26 12:04:13'),('LAN002','2023-06-23 15:02:17','2023-06-26 02:02:17','2023-06-25 10:53:24'),('LAN002','2023-07-16 03:02:17','2023-07-17 10:02:17','2023-07-16 23:26:32'),('LAN002','2023-08-03 23:02:17','2023-08-05 02:02:17','2023-08-04 00:41:30'),('LAN002','2023-08-17 09:02:17','2023-08-18 00:02:17','2023-08-17 13:02:17'),('LAN002','2023-11-09 07:02:17','2023-11-11 02:02:17','2023-11-12 09:02:17'),('LAN002','2024-01-14 14:02:17','2024-01-15 15:02:17','2024-01-14 22:19:41'),('LAN002','2024-02-16 09:02:17','2024-02-18 10:02:17','2024-02-18 23:02:17'),('LAN002','2024-03-01 14:02:17','2024-03-02 11:02:17','2024-03-01 23:59:53'),('SUB001','2023-10-24 20:53:45','2023-10-26 18:53:45','2023-10-25 14:13:16'),('SUB001','2023-11-02 19:53:45','2023-11-05 03:53:45','2023-11-04 09:53:45'),('SUB001','2023-12-03 00:53:45','2023-12-03 02:53:45','2023-12-03 01:48:59'),('SUB001','2023-12-31 17:53:45','2024-01-01 19:53:45','2023-12-31 22:21:33'),('SUB001','2024-02-06 02:53:45','2024-02-06 18:53:45','2024-02-06 10:32:03'),('SUB001','2024-02-16 04:53:45','2024-02-16 08:53:45','2024-02-17 20:53:45'),('SUB001','2024-02-28 06:53:45','2024-02-28 16:53:45','2024-02-29 21:53:45'),('SUB001','2024-05-11 16:53:45','2024-05-14 05:53:45','2024-05-13 22:05:05'),('VEL001','2023-04-27 21:15:44','2023-04-28 17:15:44','2023-04-28 15:48:50'),('VEL001','2023-06-06 18:15:44','2023-06-07 06:15:44','2023-06-06 18:31:37'),('VEL001','2023-06-20 21:15:44','2023-06-21 22:15:44','2023-06-25 02:15:44'),('VEL001','2023-11-11 06:15:44','2023-11-13 17:15:44','2023-11-15 15:15:44'),('VEL001','2023-12-22 08:15:44','2023-12-23 00:15:44','2023-12-23 19:15:44'),('VEL001','2024-04-28 16:15:44','2024-05-02 04:15:44','2024-04-29 19:46:38'),('VEL001','2024-05-12 11:15:44','2024-05-13 19:15:44','2024-05-13 05:33:13'),('VEL001','2024-05-17 17:15:44','2024-05-19 21:15:44','2024-05-19 14:46:52'),('VEL002','2023-02-15 16:01:35','2023-02-16 04:01:35','2023-02-15 19:01:35'),('VEL002','2023-02-25 20:01:35','2023-02-28 07:01:35','2023-02-27 11:05:04'),('VEL002','2023-03-02 22:01:35','2023-03-05 04:01:35','2023-03-03 23:01:35'),('VEL002','2023-03-13 09:01:35','2023-03-16 02:01:35','2023-03-13 10:01:35'),('VEL002','2023-03-25 10:01:35','2023-03-28 06:01:35','2023-03-27 08:31:54'),('VEL002','2023-04-17 15:01:35','2023-04-18 13:01:35','2023-04-18 00:33:49'),('VEL002','2023-05-10 10:01:35','2023-05-11 09:01:35','2023-05-11 21:01:35'),('VEL002','2023-08-09 11:01:35','2023-08-10 16:01:35','2023-08-10 23:01:35'),('VEL002','2023-09-14 20:01:35','2023-09-17 20:01:35','2023-09-18 22:01:35'),('VEL002','2023-11-01 05:01:35','2023-11-01 18:01:35','2023-11-01 16:01:35'),('VEL002','2024-01-09 00:01:35','2024-01-09 09:01:35','2024-01-09 01:04:08'),('VEL002','2024-01-19 01:01:35','2024-01-23 05:01:35','2024-01-21 17:01:35'),('VEL002','2024-02-08 03:01:35','2024-02-09 15:01:35','2024-02-10 07:01:35'),('VEL002','2024-03-07 01:01:35','2024-03-07 15:01:35','2024-03-07 04:55:41'),('VEL003','2023-06-09 05:52:36','2023-06-10 03:52:36','2023-06-09 06:53:14'),('VEL003','2023-07-22 18:52:36','2023-07-24 18:52:36','2023-07-23 20:52:36'),('VEL003','2023-09-22 16:52:36','2023-09-25 00:52:36','2023-09-23 14:55:08'),('VEL003','2023-12-29 13:52:36','2024-01-01 06:52:36','2023-12-30 09:52:36'),('VEL003','2024-02-07 00:52:36','2024-02-08 23:52:36','2024-02-10 02:52:36'),('VEL003','2024-06-17 16:52:36','2024-06-18 01:52:36','2024-06-18 00:20:55'),('VEL003','2024-07-04 18:52:36','2024-07-08 06:52:36','2024-07-08 04:23:01'),('VEL003','2024-07-16 12:52:36','2024-07-17 11:52:36','2024-07-16 21:10:40'),('VEL004','2023-04-16 00:24:41','2023-04-18 07:24:41','2023-04-18 01:33:37'),('VEL004','2023-04-21 22:24:41','2023-04-22 17:24:41','2023-04-26 14:24:41'),('VEL004','2023-09-18 06:24:41','2023-09-19 23:24:41','2023-09-19 14:24:41'),('VEL004','2023-10-11 22:24:41','2023-10-14 20:24:41','2023-10-14 12:24:41'),('VEL004','2023-12-06 01:24:41','2023-12-08 08:24:41','2023-12-07 05:24:41'),('VEL004','2024-05-03 18:24:41','2024-05-05 16:24:41','2024-05-04 12:08:11'),('VEL004','2024-05-18 16:24:41','2024-05-22 11:24:41','2024-05-19 14:46:41'),('VEL004','2024-06-24 14:24:41','2024-06-27 05:24:41','2024-06-24 19:00:28'),('WSF001','2023-12-06 13:01:21','2023-12-07 06:01:21','2023-12-06 23:41:20'),('WSF001','2023-12-15 12:01:21','2023-12-17 11:01:21','2023-12-17 07:10:56'),('WSF001','2024-01-06 11:01:21','2024-01-06 16:01:21','2024-01-06 12:01:21'),('WSF001','2024-01-26 02:01:21','2024-01-26 06:01:21','2024-01-26 04:51:33'),('WSF001','2024-05-06 00:01:21','2024-05-08 03:01:21','2024-05-07 16:21:35'),('WSF001','2024-05-19 00:01:21','2024-05-21 14:01:21','2024-05-21 03:18:18'),('WSF002','2023-06-28 17:01:03','2023-07-02 08:01:03','2023-07-01 08:01:03'),('WSF002','2023-08-08 12:01:03','2023-08-10 00:01:03','2023-08-09 15:28:58'),('WSF002','2023-08-23 13:01:03','2023-08-25 07:01:03','2023-08-27 15:01:03'),('WSF002','2023-10-09 16:01:03','2023-10-14 13:01:03','2023-10-13 19:01:03'),('WSF002','2023-10-22 18:01:03','2023-10-23 02:01:03','2023-10-23 01:01:03'),('WSF002','2023-12-15 09:01:03','2023-12-18 04:01:03','2023-12-16 10:01:03'),('WSF002','2024-01-17 03:01:03','2024-01-18 16:01:03','2024-01-17 15:20:46'),('WSF002','2024-07-14 05:01:03','2024-07-15 11:01:03','2024-07-14 16:20:06'),('WSF002','2024-07-20 01:01:03','2024-07-21 16:01:03','2024-07-21 11:35:47'),('WSF003','2023-05-09 21:23:57','2023-05-14 11:23:57','2023-05-13 10:23:57'),('WSF003','2023-06-23 05:23:57','2023-06-23 18:23:57','2023-06-23 09:19:04'),('WSF003','2023-06-26 21:23:57','2023-07-01 15:23:57','2023-06-28 06:23:57'),('WSF003','2023-07-06 23:23:57','2023-07-07 19:23:57','2023-07-07 16:20:37'),('WSF003','2023-07-17 07:23:57','2023-07-18 00:23:57','2023-07-17 13:02:24'),('WSF003','2023-08-20 09:23:57','2023-08-20 18:23:57','2023-08-20 10:27:22'),('WSF003','2023-09-03 03:23:57','2023-09-03 15:23:57','2023-09-03 10:30:01'),('WSF003','2023-10-25 21:23:57','2023-10-26 15:23:57','2023-10-28 05:23:57'),('WSF003','2024-07-08 00:23:57','2024-07-10 08:23:57','2024-07-12 02:23:57');
/*!40000 ALTER TABLE `salida` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sector`
--

DROP TABLE IF EXISTS `sector`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sector` (
  `codigo` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_operacion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sector`
--

LOCK TABLES `sector` WRITE;
/*!40000 ALTER TABLE `sector` DISABLE KEYS */;
INSERT INTO `sector` VALUES (1,'Bohemian Junkheap','Manual'),(2,'Mars','Automático'),(3,'Ganymede','Manual'),(4,'Callisto','Automático'),(5,'Triton','Manual');
/*!40000 ALTER TABLE `sector` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sector_tipo_embarcacion`
--

DROP TABLE IF EXISTS `sector_tipo_embarcacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sector_tipo_embarcacion` (
  `codigo_tipo_embarcacion` int unsigned NOT NULL,
  `codigo_sector` int unsigned NOT NULL,
  PRIMARY KEY (`codigo_tipo_embarcacion`,`codigo_sector`),
  KEY `fk_sector_tipo_embarcacion_sector_idx` (`codigo_sector`),
  CONSTRAINT `fk_sector_tipo_embarcacion_sector` FOREIGN KEY (`codigo_sector`) REFERENCES `sector` (`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_sector_tipo_embarcacion_tipo_embarcacion` FOREIGN KEY (`codigo_tipo_embarcacion`) REFERENCES `tipo_embarcacion` (`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sector_tipo_embarcacion`
--

LOCK TABLES `sector_tipo_embarcacion` WRITE;
/*!40000 ALTER TABLE `sector_tipo_embarcacion` DISABLE KEYS */;
INSERT INTO `sector_tipo_embarcacion` VALUES (4,1),(5,1),(6,1),(7,1),(8,2),(4,3),(5,3),(6,3),(7,3),(1,4),(2,4),(3,4),(4,5),(5,5),(6,5),(7,5);
/*!40000 ALTER TABLE `sector_tipo_embarcacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `socio`
--

DROP TABLE IF EXISTS `socio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `socio` (
  `numero` int unsigned NOT NULL AUTO_INCREMENT,
  `tipo_doc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nro_doc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`numero`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `socio`
--

LOCK TABLES `socio` WRITE;
/*!40000 ALTER TABLE `socio` DISABLE KEYS */;
INSERT INTO `socio` VALUES (1,'cuit','401401401','Monkey D. Luffy'),(3,'dni','403403403','Makino'),(4,'cuit','404404404','Buggy'),(5,'cuit','405405405','Red-Haired Shanks'),(6,'dni','406406406','Trafalgar D. Water Law'),(7,'cuit','407407407','Big Mom'),(8,'dni','408408408','Spike Spiegel'),(10,'dni','410410410','Faye Valentine'),(11,'dni','408408408','Jet Black'),(12,'cuit','412412412','Captain Harlock'),(13,'cuit','413413413','Harry MacDougall'),(14,'cuit','414414414','Dread Team'),(15,'dni','415415415','Isamu Dyson'),(16,'dni','416416416','Akito Tenkawa'),(17,'dni','417417417','Yurika Misumaru'),(18,'dni','418418418','Juzo Okita'),(19,'cuit','419419419','Hikaru Ichijyo'),(20,'cuit','419419419','Ozma Lee'),(21,'cuit','421421421','Jean-Luc Picard'),(22,'cuit','422422422','Maetel'),(23,'cuit','419419419','Hikaru Ichijyo'),(24,'cuit','424424424','Max Sterling'),(25,'dni','415415415','Isamu Dyson'),(26,'cuit','424424424','Max Sterling'),(27,'dni','427427427','Shin Kudo'),(28,'cuit','424424424','Ray Lovelock'),(29,'dni','429429429','Amuro Ray'),(30,'dni','429429429','Mikhail Kaminsky'),(31,'cuit','431431431','Char Aznable'),(32,'cuit','432432432','Banagher Links'),(33,'cuit','431431431','Full Frontal'),(34,'cuit','431431431','Char Aznable'),(35,'dni','435435435','Denim'),(36,'cuit','431431431','Char Aznable'),(37,'dni','437437437','Christina Mackenzie'),(38,'dni','438383838','Din Djarin'),(39,'dni','439393939','Katerose Von Kreutser');
/*!40000 ALTER TABLE `socio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_embarcacion`
--

DROP TABLE IF EXISTS `tipo_embarcacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_embarcacion` (
  `codigo` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `operacion_requerida` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_embarcacion`
--

LOCK TABLES `tipo_embarcacion` WRITE;
/*!40000 ALTER TABLE `tipo_embarcacion` DISABLE KEYS */;
INSERT INTO `tipo_embarcacion` VALUES (1,'Velero','Automática'),(2,'Lancha','Automática'),(3,'Submarino','Automática'),(4,'Kayak','Manual'),(5,'Tabla Wind Surf','Manual'),(6,'Tabla Kite','Manual'),(7,'Canoa','Manual'),(8,'No convencional','Automática');
/*!40000 ALTER TABLE `tipo_embarcacion` ENABLE KEYS */;
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

-- Dump completed on 2025-03-08  9:46:30

CREATE DATABASE  IF NOT EXISTS `convenciones_underground` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `convenciones_underground`;
-- MySQL dump 10.13  Distrib 8.0.32, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: convenciones_underground
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
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `cuit` char(13) NOT NULL,
  `razon_social` varchar(255) NOT NULL,
  `telefono` varchar(45) DEFAULT NULL,
  `direccion` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `categoria` varchar(255) NOT NULL,
  PRIMARY KEY (`cuit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empleado`
--

DROP TABLE IF EXISTS `empleado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleado` (
  `cuil` varchar(25) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `fecha_nac` date NOT NULL,
  `categoria` varchar(255) NOT NULL,
  PRIMARY KEY (`cuil`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleado`
--

LOCK TABLES `empleado` WRITE;
/*!40000 ALTER TABLE `empleado` DISABLE KEYS */;
/*!40000 ALTER TABLE `empleado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `encargado_evento`
--

DROP TABLE IF EXISTS `encargado_evento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `encargado_evento` (
  `id_evento` int unsigned NOT NULL,
  `cuil_encargado` varchar(25) NOT NULL,
  `rol` varchar(255) NOT NULL,
  PRIMARY KEY (`id_evento`,`cuil_encargado`),
  KEY `fk_encargado_evento_empleado_idx` (`cuil_encargado`),
  CONSTRAINT `fk_encargado_evento_empleado` FOREIGN KEY (`cuil_encargado`) REFERENCES `empleado` (`cuil`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_encargado_evento_evento` FOREIGN KEY (`id_evento`) REFERENCES `evento` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `encargado_evento`
--

LOCK TABLES `encargado_evento` WRITE;
/*!40000 ALTER TABLE `encargado_evento` DISABLE KEYS */;
/*!40000 ALTER TABLE `encargado_evento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entrada`
--

DROP TABLE IF EXISTS `entrada`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entrada` (
  `id_evento` int unsigned NOT NULL,
  `nro` int unsigned NOT NULL,
  `fecha_hora_venta` datetime NOT NULL,
  `costo` decimal(9,3) NOT NULL,
  `id_comprador` int unsigned NOT NULL,
  `id_asistente` int unsigned NOT NULL,
  PRIMARY KEY (`id_evento`,`nro`),
  KEY `fk_entrada_asistente_idx` (`id_asistente`),
  KEY `fk_entrada_comprador_idx` (`id_comprador`),
  CONSTRAINT `fk_entrada_asistente` FOREIGN KEY (`id_asistente`) REFERENCES `persona` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_entrada_comprador` FOREIGN KEY (`id_comprador`) REFERENCES `persona` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_entrada_evento` FOREIGN KEY (`id_evento`) REFERENCES `evento` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entrada`
--

LOCK TABLES `entrada` WRITE;
/*!40000 ALTER TABLE `entrada` DISABLE KEYS */;
/*!40000 ALTER TABLE `entrada` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evento`
--

DROP TABLE IF EXISTS `evento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evento` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `fecha_desde` date NOT NULL,
  `fecha_hasta` date NOT NULL,
  `valor_base_entrada` decimal(9,3) NOT NULL,
  `tematica` varchar(255) NOT NULL,
  `tipo` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evento`
--

LOCK TABLES `evento` WRITE;
/*!40000 ALTER TABLE `evento` DISABLE KEYS */;
/*!40000 ALTER TABLE `evento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locacion`
--

DROP TABLE IF EXISTS `locacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locacion` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `ubicacion_gps` point DEFAULT NULL,
  `direccion` varchar(255) NOT NULL,
  `zona` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locacion`
--

LOCK TABLES `locacion` WRITE;
/*!40000 ALTER TABLE `locacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `locacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persona`
--

DROP TABLE IF EXISTS `persona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `persona` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `tipo_doc` varchar(25) NOT NULL,
  `nro_doc` varchar(25) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persona`
--

LOCK TABLES `persona` WRITE;
/*!40000 ALTER TABLE `persona` DISABLE KEYS */;
/*!40000 ALTER TABLE `persona` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `presentacion`
--

DROP TABLE IF EXISTS `presentacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `presentacion` (
  `id_evento` int unsigned NOT NULL,
  `id_locacion` int unsigned NOT NULL,
  `nro_sala` int unsigned NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha_hora_ini` datetime NOT NULL,
  `fecha_hora_fin` datetime NOT NULL,
  `costo_entrada` decimal(9,3) NOT NULL,
  `tipo` varchar(255) NOT NULL,
  PRIMARY KEY (`id_locacion`,`nro_sala`,`fecha_hora_ini`),
  KEY `fk_presentacion_evento_idx` (`id_evento`),
  CONSTRAINT `fk_presentacion_evento` FOREIGN KEY (`id_evento`) REFERENCES `evento` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_presentacion_sala` FOREIGN KEY (`id_locacion`, `nro_sala`) REFERENCES `sala` (`id_locacion`, `nro`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `presentacion`
--

LOCK TABLES `presentacion` WRITE;
/*!40000 ALTER TABLE `presentacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `presentacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `presentacion_entrada`
--

DROP TABLE IF EXISTS `presentacion_entrada`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `presentacion_entrada` (
  `id_evento` int unsigned NOT NULL,
  `nro_entrada` int unsigned NOT NULL,
  `id_locacion` int unsigned NOT NULL,
  `nro_sala` int unsigned NOT NULL,
  `fecha_hora_ini` datetime NOT NULL,
  PRIMARY KEY (`id_evento`,`nro_entrada`,`id_locacion`,`nro_sala`,`fecha_hora_ini`),
  KEY `fk_presentacion_entrada_presentacion_idx` (`id_locacion`,`nro_sala`,`fecha_hora_ini`),
  CONSTRAINT `fk_presentacion_entrada_entrada` FOREIGN KEY (`id_evento`, `nro_entrada`) REFERENCES `entrada` (`id_evento`, `nro`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_presentacion_entrada_presentacion` FOREIGN KEY (`id_locacion`, `nro_sala`, `fecha_hora_ini`) REFERENCES `presentacion` (`id_locacion`, `nro_sala`, `fecha_hora_ini`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `presentacion_entrada`
--

LOCK TABLES `presentacion_entrada` WRITE;
/*!40000 ALTER TABLE `presentacion_entrada` DISABLE KEYS */;
/*!40000 ALTER TABLE `presentacion_entrada` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `presentador`
--

DROP TABLE IF EXISTS `presentador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `presentador` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `cuit` char(13) NOT NULL,
  `telefono` varchar(45) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `denominacion` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `apellido` varchar(255) DEFAULT NULL,
  `especialidad` varchar(255) DEFAULT NULL,
  `cv` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `presentador`
--

LOCK TABLES `presentador` WRITE;
/*!40000 ALTER TABLE `presentador` DISABLE KEYS */;
/*!40000 ALTER TABLE `presentador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `presentador_presentacion`
--

DROP TABLE IF EXISTS `presentador_presentacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `presentador_presentacion` (
  `id_presentador` int unsigned NOT NULL,
  `id_locacion` int unsigned NOT NULL,
  `nro_sala` int unsigned NOT NULL,
  `fecha_hora_ini` datetime NOT NULL,
  PRIMARY KEY (`id_presentador`,`id_locacion`,`nro_sala`,`fecha_hora_ini`),
  KEY `fk_presentador_presentacion_presentacion_idx` (`id_locacion`,`nro_sala`,`fecha_hora_ini`),
  CONSTRAINT `fk_presentador_presentacion_presentacion` FOREIGN KEY (`id_locacion`, `nro_sala`, `fecha_hora_ini`) REFERENCES `presentacion` (`id_locacion`, `nro_sala`, `fecha_hora_ini`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_presentador_presentacion_presentador` FOREIGN KEY (`id_presentador`) REFERENCES `presentador` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `presentador_presentacion`
--

LOCK TABLES `presentador_presentacion` WRITE;
/*!40000 ALTER TABLE `presentador_presentacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `presentador_presentacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sala`
--

DROP TABLE IF EXISTS `sala`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sala` (
  `id_locacion` int unsigned NOT NULL,
  `nro` int unsigned NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `m2` decimal(9,3) NOT NULL,
  `capacidad_maxima` int NOT NULL,
  `estado` varchar(255) NOT NULL,
  PRIMARY KEY (`id_locacion`,`nro`),
  CONSTRAINT `fk_sala_locacion` FOREIGN KEY (`id_locacion`) REFERENCES `locacion` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sala`
--

LOCK TABLES `sala` WRITE;
/*!40000 ALTER TABLE `sala` DISABLE KEYS */;
/*!40000 ALTER TABLE `sala` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stand`
--

DROP TABLE IF EXISTS `stand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stand` (
  `id_evento` int unsigned NOT NULL,
  `nro` int unsigned NOT NULL,
  `ubicacion` varchar(255) NOT NULL,
  `valor_sugerido` decimal(9,3) NOT NULL,
  `tipo` varchar(255) NOT NULL,
  `cuit_cliente` char(13) DEFAULT NULL,
  `valor_acordado` decimal(9,3) DEFAULT NULL,
  `fecha_contrato` date DEFAULT NULL,
  PRIMARY KEY (`id_evento`),
  KEY `fk_stand_cliente_idx` (`cuit_cliente`),
  CONSTRAINT `fk_stand_cliente` FOREIGN KEY (`cuit_cliente`) REFERENCES `cliente` (`cuit`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_stand_evento` FOREIGN KEY (`id_evento`) REFERENCES `evento` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stand`
--

LOCK TABLES `stand` WRITE;
/*!40000 ALTER TABLE `stand` DISABLE KEYS */;
/*!40000 ALTER TABLE `stand` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-07-30  9:56:06

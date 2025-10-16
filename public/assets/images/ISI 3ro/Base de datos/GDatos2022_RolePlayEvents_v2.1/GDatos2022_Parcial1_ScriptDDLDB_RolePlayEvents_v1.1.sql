CREATE DATABASE  IF NOT EXISTS `role_play_events` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `role_play_events`;
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
-- Table structure for table `actividad`
--

DROP TABLE IF EXISTS `actividad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actividad` (
  `codigo_locacion` int unsigned NOT NULL,
  `nro` int unsigned NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `equipamiento` varchar(255) NOT NULL,
  PRIMARY KEY (`codigo_locacion`,`nro`),
  CONSTRAINT `fk_actividad_locacion` FOREIGN KEY (`codigo_locacion`) REFERENCES `locacion` (`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actividad`
--

LOCK TABLES `actividad` WRITE;
/*!40000 ALTER TABLE `actividad` DISABLE KEYS */;
/*!40000 ALTER TABLE `actividad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asistente`
--

DROP TABLE IF EXISTS `asistente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asistente` (
  `dni` int unsigned NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `telefono` varchar(45) NOT NULL,
  PRIMARY KEY (`dni`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asistente`
--

LOCK TABLES `asistente` WRITE;
/*!40000 ALTER TABLE `asistente` DISABLE KEYS */;
/*!40000 ALTER TABLE `asistente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asistente_contrato`
--

DROP TABLE IF EXISTS `asistente_contrato`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asistente_contrato` (
  `dni_asistente` int unsigned NOT NULL,
  `nro_tour` int unsigned NOT NULL,
  `cuil_cliente` bigint unsigned NOT NULL,
  `fecha_hora` datetime NOT NULL,
  PRIMARY KEY (`dni_asistente`,`nro_tour`,`cuil_cliente`,`fecha_hora`),
  KEY `fk_asistente_contrato_contrata_idx` (`nro_tour`,`cuil_cliente`),
  KEY `fk_asistente_contrato_contrata_idx1` (`nro_tour`,`cuil_cliente`,`fecha_hora`),
  CONSTRAINT `fk_asistente_contrato_asistente` FOREIGN KEY (`dni_asistente`) REFERENCES `asistente` (`dni`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_asistente_contrato_contrata` FOREIGN KEY (`nro_tour`, `cuil_cliente`, `fecha_hora`) REFERENCES `contrata` (`nro_tour`, `cuil_cliente`, `fecha_hora`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asistente_contrato`
--

LOCK TABLES `asistente_contrato` WRITE;
/*!40000 ALTER TABLE `asistente_contrato` DISABLE KEYS */;
/*!40000 ALTER TABLE `asistente_contrato` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `cuil` bigint unsigned NOT NULL,
  `denom` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefono` varchar(45) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `tipo` varchar(45) NOT NULL,
  PRIMARY KEY (`cuil`)
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
-- Table structure for table `contrata`
--

DROP TABLE IF EXISTS `contrata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contrata` (
  `nro_tour` int unsigned NOT NULL,
  `cuil_cliente` bigint unsigned NOT NULL,
  `fecha_hora` datetime NOT NULL,
  `importe` decimal(10,3) NOT NULL,
  `cant_entradas` int unsigned NOT NULL,
  `codigo_idioma` int unsigned DEFAULT NULL,
  PRIMARY KEY (`nro_tour`,`cuil_cliente`,`fecha_hora`),
  KEY `fk_contrata_cliente_idx` (`cuil_cliente`),
  KEY `fk_contrata_idioma_idx` (`codigo_idioma`),
  CONSTRAINT `fk_contrata_cliente` FOREIGN KEY (`cuil_cliente`) REFERENCES `cliente` (`cuil`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_contrata_idioma` FOREIGN KEY (`codigo_idioma`) REFERENCES `idioma` (`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_contrata_tour` FOREIGN KEY (`nro_tour`) REFERENCES `tour` (`nro`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contrata`
--

LOCK TABLES `contrata` WRITE;
/*!40000 ALTER TABLE `contrata` DISABLE KEYS */;
/*!40000 ALTER TABLE `contrata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `costo`
--

DROP TABLE IF EXISTS `costo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `costo` (
  `codigo_locacion` int unsigned NOT NULL,
  `nro_actividad` int unsigned NOT NULL,
  `fecha_desde` date NOT NULL,
  `valor` decimal(10,3) NOT NULL,
  PRIMARY KEY (`codigo_locacion`,`nro_actividad`,`fecha_desde`),
  CONSTRAINT `fk_costo_actividad` FOREIGN KEY (`codigo_locacion`, `nro_actividad`) REFERENCES `actividad` (`codigo_locacion`, `nro`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `costo`
--

LOCK TABLES `costo` WRITE;
/*!40000 ALTER TABLE `costo` DISABLE KEYS */;
/*!40000 ALTER TABLE `costo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `descuento`
--

DROP TABLE IF EXISTS `descuento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `descuento` (
  `dias_anticipacion` int unsigned NOT NULL,
  `porcentaje_descuento` decimal(10,3) NOT NULL,
  PRIMARY KEY (`dias_anticipacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `descuento`
--

LOCK TABLES `descuento` WRITE;
/*!40000 ALTER TABLE `descuento` DISABLE KEYS */;
/*!40000 ALTER TABLE `descuento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empleado`
--

DROP TABLE IF EXISTS `empleado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleado` (
  `cuil` bigint unsigned NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `telefono` varchar(45) DEFAULT NULL,
  `categoria` varchar(255) NOT NULL,
  `tipo` varchar(255) NOT NULL,
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
-- Table structure for table `escala`
--

DROP TABLE IF EXISTS `escala`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `escala` (
  `nro_tour` int unsigned NOT NULL,
  `fecha_hora_ini` datetime NOT NULL,
  `fecha_hora_fin` datetime NOT NULL,
  `codigo_locacion` int unsigned NOT NULL,
  `nro_actividad` int unsigned NOT NULL,
  `cuil_encargado` bigint unsigned NOT NULL,
  PRIMARY KEY (`nro_tour`,`fecha_hora_ini`),
  KEY `fk_escala_actividad_idx` (`codigo_locacion`,`nro_actividad`),
  KEY `fk_escala_ecnargado_idx` (`cuil_encargado`),
  CONSTRAINT `fk_escala_actividad` FOREIGN KEY (`codigo_locacion`, `nro_actividad`) REFERENCES `actividad` (`codigo_locacion`, `nro`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_escala_ecnargado` FOREIGN KEY (`cuil_encargado`) REFERENCES `empleado` (`cuil`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_escala_tour` FOREIGN KEY (`nro_tour`) REFERENCES `tour` (`nro`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `escala`
--

LOCK TABLES `escala` WRITE;
/*!40000 ALTER TABLE `escala` DISABLE KEYS */;
/*!40000 ALTER TABLE `escala` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `idioma`
--

DROP TABLE IF EXISTS `idioma`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `idioma` (
  `codigo` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `idioma`
--

LOCK TABLES `idioma` WRITE;
/*!40000 ALTER TABLE `idioma` DISABLE KEYS */;
/*!40000 ALTER TABLE `idioma` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `idioma_guia`
--

DROP TABLE IF EXISTS `idioma_guia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `idioma_guia` (
  `cuil_guia` bigint unsigned NOT NULL,
  `codigo_idioma` int unsigned NOT NULL,
  PRIMARY KEY (`cuil_guia`,`codigo_idioma`),
  KEY `fk_idioma_guia_idioma_idx` (`codigo_idioma`),
  CONSTRAINT `fk_idioma_guia_empleado` FOREIGN KEY (`cuil_guia`) REFERENCES `empleado` (`cuil`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_idioma_guia_idioma` FOREIGN KEY (`codigo_idioma`) REFERENCES `idioma` (`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `idioma_guia`
--

LOCK TABLES `idioma_guia` WRITE;
/*!40000 ALTER TABLE `idioma_guia` DISABLE KEYS */;
/*!40000 ALTER TABLE `idioma_guia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locacion`
--

DROP TABLE IF EXISTS `locacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locacion` (
  `codigo` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `ambientacion` varchar(255) NOT NULL,
  `ubicacion_gps` point NULL,
  `direccion` varchar(255) NOT NULL,
  PRIMARY KEY (`codigo`)
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
-- Table structure for table `salario_hora`
--

DROP TABLE IF EXISTS `salario_hora`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salario_hora` (
  `cuil_empleado` bigint unsigned NOT NULL,
  `fecha_desde` date NOT NULL,
  `valor` decimal(10,3) NOT NULL,
  PRIMARY KEY (`cuil_empleado`,`fecha_desde`),
  CONSTRAINT `fk_salario_hora_empleado` FOREIGN KEY (`cuil_empleado`) REFERENCES `empleado` (`cuil`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salario_hora`
--

LOCK TABLES `salario_hora` WRITE;
/*!40000 ALTER TABLE `salario_hora` DISABLE KEYS */;
/*!40000 ALTER TABLE `salario_hora` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tour`
--

DROP TABLE IF EXISTS `tour`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tour` (
  `nro` int unsigned NOT NULL,
  `fecha_hora_salida` datetime NOT NULL,
  `fecha_hora_regreso` datetime NOT NULL,
  `lugar_salida` varchar(255) NOT NULL,
  `precio_unitario_sugerido` decimal(10,3) NOT NULL,
  `vehiculo` varchar(10) DEFAULT NULL,
  `tematica` varchar(255) NOT NULL,
  `cuil_guia` bigint unsigned NOT NULL,
  PRIMARY KEY (`nro`),
  KEY `fk_tour_empleado_idx` (`cuil_guia`),
  CONSTRAINT `fk_tour_empleado` FOREIGN KEY (`cuil_guia`) REFERENCES `empleado` (`cuil`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tour`
--

LOCK TABLES `tour` WRITE;
/*!40000 ALTER TABLE `tour` DISABLE KEYS */;
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

-- Dump completed on 2022-07-11 23:08:13

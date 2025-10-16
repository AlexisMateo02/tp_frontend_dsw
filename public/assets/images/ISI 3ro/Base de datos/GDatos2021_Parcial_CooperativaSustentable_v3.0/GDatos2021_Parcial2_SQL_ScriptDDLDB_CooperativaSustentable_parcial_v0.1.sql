CREATE DATABASE  IF NOT EXISTS `cooperativa_sustentable` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `cooperativa_sustentable`;
-- MySQL dump 10.15  Distrib 10.0.38-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: 127.0.0.1    Database: cooperativa_sustentable
-- ------------------------------------------------------
-- Server version	8.0.17-8

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
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cliente` (
  `cuil` bigint(20) unsigned NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `domicilio` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`cuil`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `composicion`
--

DROP TABLE IF EXISTS `composicion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `composicion` (
  `codigo_producto` int(10) unsigned NOT NULL,
  `codigo_material` int(10) unsigned NOT NULL,
  `cantidad` decimal(10,3) NOT NULL,
  PRIMARY KEY (`codigo_producto`,`codigo_material`),
  KEY `fk_composicion_material_idx` (`codigo_material`),
  CONSTRAINT `fk_composicion_material` FOREIGN KEY (`codigo_material`) REFERENCES `material` (`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_composicion_producto` FOREIGN KEY (`codigo_producto`) REFERENCES `producto` (`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `entrega`
--

DROP TABLE IF EXISTS `entrega`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `entrega` (
  `numero_pedido` int(10) unsigned NOT NULL,
  `codigo_producto` int(10) unsigned NOT NULL,
  `numero_lote` int(10) unsigned NOT NULL,
  `fecha_entrega` date NOT NULL,
  `cantidad` decimal(10,3) NOT NULL,
  PRIMARY KEY (`numero_pedido`,`codigo_producto`,`numero_lote`,`fecha_entrega`),
  KEY `fk_entrega_lote_idx` (`codigo_producto`,`numero_lote`),
  CONSTRAINT `fk_entrega_lote` FOREIGN KEY (`codigo_producto`, `numero_lote`) REFERENCES `lote` (`codigo_producto`, `numero`),
  CONSTRAINT `fk_entrega_solicita` FOREIGN KEY (`numero_pedido`, `codigo_producto`) REFERENCES `solicita` (`numero_pedido`, `codigo_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `grupo`
--

DROP TABLE IF EXISTS `grupo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `grupo` (
  `numero` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`numero`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `grupo_miembro`
--

DROP TABLE IF EXISTS `grupo_miembro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `grupo_miembro` (
  `numero_grupo` int(10) unsigned NOT NULL,
  `cuil_miembro` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`numero_grupo`,`cuil_miembro`),
  KEY `fk_grupo_miembro_miembro_idx` (`cuil_miembro`),
  CONSTRAINT `fk_grupo_miembro_grupo` FOREIGN KEY (`numero_grupo`) REFERENCES `grupo` (`numero`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_grupo_miembro_miembro` FOREIGN KEY (`cuil_miembro`) REFERENCES `miembro` (`cuil`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lote`
--

DROP TABLE IF EXISTS `lote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lote` (
  `codigo_producto` int(10) unsigned NOT NULL,
  `numero` int(10) unsigned NOT NULL,
  `cantidad_producida` decimal(10,3) NOT NULL,
  `fecha_produccion` date NOT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  PRIMARY KEY (`codigo_producto`,`numero`),
  CONSTRAINT `fk_lote_producto` FOREIGN KEY (`codigo_producto`) REFERENCES `producto` (`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `material`
--

DROP TABLE IF EXISTS `material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `material` (
  `codigo` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unidad_medida` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stock` decimal(10,3) NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `miembro`
--

DROP TABLE IF EXISTS `miembro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `miembro` (
  `cuil` bigint(20) unsigned NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `domicilio` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`cuil`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pedido`
--

DROP TABLE IF EXISTS `pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pedido` (
  `numero` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `fecha_entrega_convenida` date NOT NULL,
  `fecha_pedido` date NOT NULL,
  `cuil_cliente` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`numero`),
  KEY `fk_pedido_cliente_idx` (`cuil_cliente`),
  CONSTRAINT `fk_pedido_cliente` FOREIGN KEY (`cuil_cliente`) REFERENCES `cliente` (`cuil`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `produce`
--

DROP TABLE IF EXISTS `produce`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `produce` (
  `codigo_producto` int(20) unsigned NOT NULL,
  `numero_lote` int(10) unsigned NOT NULL,
  `cuil_miembro` bigint(20) unsigned NOT NULL,
  `horas_trabajadas` decimal(10,3) NOT NULL,
  PRIMARY KEY (`codigo_producto`,`numero_lote`,`cuil_miembro`),
  KEY `fk_produce_miembro_idx` (`cuil_miembro`),
  CONSTRAINT `fk_produce_lote` FOREIGN KEY (`codigo_producto`, `numero_lote`) REFERENCES `lote` (`codigo_producto`, `numero`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_produce_miembro` FOREIGN KEY (`cuil_miembro`) REFERENCES `miembro` (`cuil`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `producto` (
  `codigo` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `caracteristicas` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `proceso_fabricacion` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `precio_sugerido` decimal(10,3) NOT NULL,
  `numero_grupo` int(10) unsigned NOT NULL,
  PRIMARY KEY (`codigo`),
  KEY `fk_producto_grupo_idx` (`numero_grupo`),
  CONSTRAINT `fk_producto_grupo` FOREIGN KEY (`numero_grupo`) REFERENCES `grupo` (`numero`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `solicita`
--

DROP TABLE IF EXISTS `solicita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `solicita` (
  `numero_pedido` int(10) unsigned NOT NULL,
  `codigo_producto` int(10) unsigned NOT NULL,
  `cantidad` decimal(10,3) NOT NULL,
  `precio_unitario_acordado` decimal(10,3) NOT NULL,
  PRIMARY KEY (`numero_pedido`,`codigo_producto`),
  KEY `fk_solicita_producto_idx` (`codigo_producto`),
  CONSTRAINT `fk_solicita_pedido` FOREIGN KEY (`numero_pedido`) REFERENCES `pedido` (`numero`) ON UPDATE CASCADE,
  CONSTRAINT `fk_solicita_producto` FOREIGN KEY (`codigo_producto`) REFERENCES `producto` (`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `valor_hora`
--

DROP TABLE IF EXISTS `valor_hora`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `valor_hora` (
  `fecha_desde` date NOT NULL,
  `valor` decimal(10,3) NOT NULL,
  PRIMARY KEY (`fecha_desde`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `valor_material`
--

DROP TABLE IF EXISTS `valor_material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `valor_material` (
  `codigo_material` int(10) unsigned NOT NULL,
  `fecha_desde` date NOT NULL,
  `valor` decimal(10,3) NOT NULL,
  PRIMARY KEY (`codigo_material`,`fecha_desde`),
  CONSTRAINT `fk_valor_material_material` FOREIGN KEY (`codigo_material`) REFERENCES `material` (`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-06-21 23:10:17

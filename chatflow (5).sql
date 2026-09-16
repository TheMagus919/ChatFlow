-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-09-2026 a las 03:16:42
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `chatflow`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `conversations`
--

CREATE TABLE `conversations` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `last_message` text DEFAULT NULL,
  `last_message_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `users_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `conversations`
--

INSERT INTO `conversations` (`id`, `customer_id`, `last_message`, `last_message_at`, `created_at`, `users_id`) VALUES
(1, 7, 'Mañana te confirmo.', '2025-06-16 01:56:26', '2025-06-14 09:56:26', 1),
(2, 7, 'Quedo atento a tu respuesta.', '2025-06-16 16:56:26', '2025-06-14 09:56:26', 2),
(3, 8, 'Quedo atento a tu respuesta.', '2025-02-02 10:58:17', '2025-01-31 03:58:17', 1),
(4, 9, 'Si retomo el proyecto te escribo.', '2025-03-17 14:00:07', '2025-03-15 22:00:07', 1),
(5, 10, 'Gracias a vos. La venta quedó confirmada.', '2025-05-03 04:01:58', '2025-04-30 16:01:58', 4),
(6, 11, 'Listo, ya realicé la transferencia.', '2025-06-16 22:03:49', '2025-06-14 10:03:49', 4),
(7, 12, 'Listo, ya realicé la transferencia.', '2025-02-02 16:05:39', '2025-01-31 04:05:39', 4),
(8, 13, 'Pago acreditado correctamente.', '2025-03-18 15:07:30', '2025-03-15 22:07:30', 4),
(9, 14, 'hola como estas', '2026-06-16 16:51:25', '2025-04-30 16:09:21', 4),
(10, 15, 'Mañana te confirmo.', '2025-06-16 12:11:12', '2025-06-14 10:11:12', 4),
(11, 16, 'Hola, todo bien?', '2026-09-14 20:42:45', '2025-01-31 04:13:02', 4),
(12, 17, 'No hay problema.', '2025-03-17 19:14:53', '2025-03-15 22:14:53', 4),
(13, 18, 'La verdad encontré algo más económico.', '2025-05-02 08:16:44', '2025-04-30 16:16:44', 4),
(14, 19, 'Quizás más adelante vuelva a consultar.', '2025-06-16 22:18:35', '2025-06-14 10:18:35', 4),
(15, 20, 'Gracias a vos. La venta quedó confirmada.', '2025-02-03 07:20:25', '2025-01-31 04:20:25', 5),
(16, 21, 'Pago acreditado correctamente.', '2025-03-18 15:22:16', '2025-03-15 22:22:16', 5),
(17, 22, 'Sin problema.', '2025-05-02 13:24:07', '2025-04-30 16:24:07', 5),
(18, 23, 'Mañana te confirmo.', '2025-06-16 12:25:58', '2025-06-14 10:25:58', 5),
(19, 24, 'Quedo atento a tu respuesta.', '2025-02-01 13:27:48', '2025-01-31 04:27:48', 5),
(20, 25, 'Quedo atento a tu respuesta.', '2025-03-17 18:29:39', '2025-03-15 22:29:39', 5),
(21, 26, 'A disposición.', '2025-05-02 04:31:30', '2025-04-30 16:31:30', 5),
(22, 27, 'Gracias.', '2025-06-16 02:33:21', '2025-06-14 10:33:21', 5),
(23, 28, 'Perfecto, cerramos la consulta por ahora.', '2025-02-02 11:35:11', '2025-01-31 04:35:11', 5),
(24, 29, 'No hay problema, gracias por tu tiempo.', '2025-03-18 05:37:02', '2025-03-15 22:37:02', 5),
(25, 30, 'Pago acreditado correctamente.', '2025-05-03 09:38:53', '2025-04-30 16:38:53', 6),
(26, 31, 'Gracias a vos. La venta quedó confirmada.', '2025-06-17 13:40:44', '2025-06-14 10:40:44', 6),
(27, 32, 'Quedo atento a tu respuesta.', '2025-02-02 11:42:34', '2025-01-31 04:42:34', 6),
(28, 33, 'Mañana te confirmo.', '2025-03-19 00:44:25', '2025-03-16 22:44:25', 6),
(29, 34, 'A disposición.', '2025-05-03 13:46:16', '2025-05-01 16:46:16', 6),
(30, 35, 'A disposición.', '2025-06-16 22:48:07', '2025-06-15 10:48:07', 6),
(31, 36, 'Te esperamos cuando quieras.', '2025-02-03 21:49:57', '2025-02-01 04:49:57', 6),
(32, 37, 'No hay problema, gracias por tu tiempo.', '2025-03-19 05:51:48', '2025-03-16 22:51:48', 6),
(33, 38, 'Te esperamos cuando quieras.', '2025-05-04 09:53:39', '2025-05-01 16:53:39', 6),
(34, 39, 'No hay problema.', '2025-06-16 22:55:30', '2025-06-15 10:55:30', 6),
(35, 40, 'Gracias a vos. La venta quedó confirmada.', '2025-02-04 07:57:20', '2025-02-01 04:57:20', 7),
(36, 41, 'Gracias a vos. La venta quedó confirmada.', '2025-03-20 01:59:11', '2025-03-16 22:59:11', 7),
(37, 42, 'Muchas gracias por la atención.', '2025-05-04 15:01:02', '2025-05-01 17:01:02', 7),
(38, 43, 'Quisiera saber formas de pago.', '2025-06-16 17:02:53', '2025-06-15 11:02:53', 7),
(39, 44, 'Gracias, no continuaré', '2025-02-07 05:04:43', '2025-02-01 05:04:43', 7),
(40, 45, 'Damos por finalizada la consulta', '2025-04-05 23:06:34', '2025-03-16 23:06:34', 7),
(41, 46, 'Lo reviso y te aviso', '2025-05-08 17:08:25', '2025-05-01 17:08:25', 7),
(42, 47, 'Hola, quiero información', '2025-06-14 11:10:16', '2025-06-15 11:10:16', 7),
(43, 48, 'Perfecto, cerramos la operación', '2025-02-08 05:12:06', '2025-02-01 05:12:06', 7),
(44, 49, 'Gracias, no continuaré', '2025-03-31 23:13:57', '2025-03-16 23:13:57', 7),
(45, 50, 'Lo reviso y te aviso', '2025-05-08 17:15:48', '2025-05-01 17:15:48', 8),
(46, 51, 'Hola, quiero información', '2025-06-14 11:17:39', '2025-06-15 11:17:39', 8),
(47, 52, 'Perfecto, cerramos la operación', '2025-02-08 05:19:29', '2025-02-01 05:19:29', 8),
(48, 53, 'Gracias, no continuaré', '2025-03-31 23:21:20', '2025-03-16 23:21:20', 8),
(49, 54, 'Damos por finalizada la consulta', '2025-05-27 17:23:11', '2025-05-01 17:23:11', 8),
(50, 55, 'Lo reviso y te aviso', '2025-06-24 11:25:01', '2025-06-15 11:25:01', 8),
(51, 56, 'Hola, quiero información', '2025-01-31 05:26:52', '2025-02-01 05:26:52', 8),
(52, 57, 'Perfecto, cerramos la operación', '2025-03-29 23:28:43', '2025-03-16 23:28:43', 8),
(53, 58, 'Gracias, no continuaré', '2025-05-23 17:30:34', '2025-05-01 17:30:34', 8),
(54, 59, 'Damos por finalizada la consulta', '2025-07-16 11:32:24', '2025-06-15 11:32:24', 8);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `status` enum('new','in_conversation','closed','lost','won') DEFAULT 'new',
  `last_message_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `avatar` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `customers`
--

INSERT INTO `customers` (`id`, `user_id`, `name`, `phone`, `email`, `status`, `last_message_at`, `created_at`, `updated_at`, `avatar`) VALUES
(5, 3, 'Probando', '26664545484', NULL, 'new', NULL, '2025-03-16 00:52:44', '2025-03-16 00:52:44', NULL),
(6, 1, 'Administrador', '2664481454', NULL, 'new', NULL, '2025-04-29 18:54:35', '2025-04-29 18:54:35', NULL),
(7, 1, 'Mario', '2664545485', 'mario@gmail.com', 'in_conversation', NULL, '2025-06-13 12:56:26', '2025-06-23 12:56:26', NULL),
(8, 1, 'Florencia', '2664995874', 'flor@gmail.com', 'in_conversation', NULL, '2025-01-29 06:58:17', '2025-01-31 06:58:17', NULL),
(9, 1, 'Marcos', '2664313151', 'marquinhos@gmail.com', 'closed', NULL, '2025-03-16 01:00:07', '2025-04-16 01:00:07', NULL),
(10, 4, 'Sofia Perez', '2666913463', 'c10@mail.com', 'won', NULL, '2025-04-29 19:01:58', '2025-05-13 19:01:58', 'https://randomuser.me/api/portraits/women/11.jpg'),
(11, 4, 'Martin Gomez', '2669165110', 'c11@mail.com', 'won', NULL, '2025-06-13 13:03:49', '2025-07-01 13:03:49', 'https://randomuser.me/api/portraits/men/12.jpg'),
(12, 4, 'Carla Lopez', '2662416759', 'c12@mail.com', 'won', NULL, '2025-01-29 07:05:39', '2025-02-05 07:05:39', 'https://randomuser.me/api/portraits/women/13.jpg'),
(13, 4, 'Nicolas Diaz', '2664668407', 'c13@mail.com', 'won', NULL, '2025-03-16 01:07:30', '2025-03-27 01:07:30', 'https://randomuser.me/api/portraits/men/14.jpg'),
(14, 4, 'Martina Ruiz', '2666920054', 'c14@mail.com', 'in_conversation', NULL, '2025-04-29 19:09:21', '2025-05-06 19:09:21', 'https://randomuser.me/api/portraits/women/15.jpg'),
(15, 4, 'Juan Perez', '2669171702', 'c15@mail.com', 'in_conversation', NULL, '2025-06-13 13:11:12', '2025-06-23 13:11:12', 'https://randomuser.me/api/portraits/men/16.jpg'),
(16, 4, 'Valentina Gomez', '2662423351', 'c16@mail.com', 'new', NULL, '2025-01-29 07:13:02', '2025-01-29 07:13:02', 'https://randomuser.me/api/portraits/women/17.jpg'),
(17, 4, 'Lucas Lopez', '2664674999', 'c17@mail.com', 'closed', NULL, '2025-03-16 01:14:53', '2025-04-16 01:14:53', 'https://randomuser.me/api/portraits/men/18.jpg'),
(18, 4, 'Lucia Diaz', '2666926646', 'c18@mail.com', 'lost', NULL, '2025-04-29 19:16:44', '2025-05-28 19:16:44', 'https://randomuser.me/api/portraits/women/19.jpg'),
(19, 4, 'Franco Ruiz', '2669178294', 'c19@mail.com', 'lost', NULL, '2025-06-13 13:18:35', '2025-07-20 13:18:35', 'https://randomuser.me/api/portraits/men/20.jpg'),
(20, 5, 'Sofia Perez', '2662429943', 'c20@mail.com', 'won', NULL, '2025-01-29 07:20:25', '2025-02-05 07:20:25', 'https://randomuser.me/api/portraits/women/21.jpg'),
(21, 5, 'Martin Gomez', '2664681591', 'c21@mail.com', 'won', NULL, '2025-03-16 01:22:16', '2025-03-27 01:22:16', 'https://randomuser.me/api/portraits/men/22.jpg'),
(22, 5, 'Carla Lopez', '2666933238', 'c22@mail.com', 'in_conversation', NULL, '2025-04-29 19:24:07', '2025-05-06 19:24:07', 'https://randomuser.me/api/portraits/women/23.jpg'),
(23, 5, 'Nicolas Diaz', '2669184886', 'c23@mail.com', 'in_conversation', NULL, '2025-06-13 13:25:58', '2025-06-23 13:25:58', 'https://randomuser.me/api/portraits/men/24.jpg'),
(24, 5, 'Martina Ruiz', '2662436535', 'c24@mail.com', 'in_conversation', NULL, '2025-01-29 07:27:48', '2025-01-31 07:27:48', 'https://randomuser.me/api/portraits/women/25.jpg'),
(25, 5, 'Juan Perez', '2664688183', 'c25@mail.com', 'in_conversation', NULL, '2025-03-16 01:29:39', '2025-03-21 01:29:39', 'https://randomuser.me/api/portraits/men/26.jpg'),
(26, 5, 'Valentina Gomez', '2666939830', 'c26@mail.com', 'new', NULL, '2025-04-29 19:31:30', '2025-04-29 19:31:30', 'https://randomuser.me/api/portraits/women/27.jpg'),
(27, 5, 'Lucas Lopez', '2669191478', 'c27@mail.com', 'new', NULL, '2025-06-13 13:33:21', '2025-06-13 13:33:21', 'https://randomuser.me/api/portraits/men/28.jpg'),
(28, 5, 'Lucia Diaz', '2662443127', 'c28@mail.com', 'closed', NULL, '2025-01-29 07:35:11', '2025-02-19 07:35:11', 'https://randomuser.me/api/portraits/women/29.jpg'),
(29, 5, 'Franco Ruiz', '2664694774', 'c29@mail.com', 'lost', NULL, '2025-03-16 01:37:02', '2025-04-07 01:37:02', 'https://randomuser.me/api/portraits/men/30.jpg'),
(30, 6, 'Sofia Perez', '2666946422', 'c30@mail.com', 'won', NULL, '2025-04-29 19:38:53', '2025-05-13 19:38:53', 'https://randomuser.me/api/portraits/women/31.jpg'),
(31, 6, 'Martin Gomez', '2669198070', 'c31@mail.com', 'won', NULL, '2025-06-13 13:40:44', '2025-07-01 13:40:44', 'https://randomuser.me/api/portraits/men/32.jpg'),
(32, 6, 'Carla Lopez', '2662449719', 'c32@mail.com', 'in_conversation', NULL, '2025-01-29 07:42:34', '2025-01-31 07:42:34', 'https://randomuser.me/api/portraits/women/33.jpg'),
(33, 6, 'Nicolas Diaz', '2664701366', 'c33@mail.com', 'in_conversation', NULL, '2025-03-17 01:44:25', '2025-03-22 01:44:25', 'https://randomuser.me/api/portraits/men/34.jpg'),
(34, 6, 'Martina Ruiz', '2666953014', 'c34@mail.com', 'new', NULL, '2025-04-30 19:46:16', '2025-04-30 19:46:16', 'https://randomuser.me/api/portraits/women/35.jpg'),
(35, 6, 'Juan Perez', '2669204662', 'c35@mail.com', 'new', NULL, '2025-06-14 13:48:07', '2025-06-14 13:48:07', 'https://randomuser.me/api/portraits/men/36.jpg'),
(36, 6, 'Valentina Gomez', '2662456311', 'c36@mail.com', 'lost', NULL, '2025-01-30 07:49:57', '2025-02-13 07:49:57', 'https://randomuser.me/api/portraits/women/37.jpg'),
(37, 6, 'Lucas Lopez', '2664707958', 'c37@mail.com', 'lost', NULL, '2025-03-17 01:51:48', '2025-04-08 01:51:48', 'https://randomuser.me/api/portraits/men/38.jpg'),
(38, 6, 'Lucia Diaz', '2666959606', 'c38@mail.com', 'lost', NULL, '2025-04-30 19:53:39', '2025-05-29 19:53:39', 'https://randomuser.me/api/portraits/women/39.jpg'),
(39, 6, 'Franco Ruiz', '2669211254', 'c39@mail.com', 'closed', NULL, '2025-06-14 13:55:30', '2025-08-04 13:55:30', 'https://randomuser.me/api/portraits/men/40.jpg'),
(40, 7, 'Sofia Perez', '2662462903', 'c40@mail.com', 'won', NULL, '2025-01-30 07:57:20', '2025-02-06 07:57:20', 'https://randomuser.me/api/portraits/women/41.jpg'),
(41, 7, 'Martin Gomez', '2664714550', 'c41@mail.com', 'won', NULL, '2025-03-17 01:59:11', '2025-03-28 01:59:11', 'https://randomuser.me/api/portraits/men/42.jpg'),
(42, 7, 'Carla Lopez', '2666966198', 'c42@mail.com', 'won', NULL, '2025-04-30 20:01:02', '2025-05-14 20:01:02', 'https://randomuser.me/api/portraits/women/43.jpg'),
(43, 7, 'Nicolas Diaz', '2669217846', 'c43@mail.com', 'in_conversation', NULL, '2025-06-14 14:02:53', '2025-06-24 14:02:53', 'https://randomuser.me/api/portraits/men/44.jpg'),
(44, 7, 'Martina Ruiz', '2662469494', 'c44@mail.com', 'in_conversation', NULL, '2025-01-30 08:04:43', '2025-02-01 08:04:43', 'https://randomuser.me/api/portraits/women/45.jpg'),
(45, 7, 'Juan Perez', '2664721142', 'c45@mail.com', 'new', NULL, '2025-03-17 02:06:34', '2025-03-17 02:06:34', 'https://randomuser.me/api/portraits/men/46.jpg'),
(46, 7, 'Valentina Gomez', '2666972790', 'c46@mail.com', 'new', NULL, '2025-04-30 20:08:25', '2025-04-30 20:08:25', 'https://randomuser.me/api/portraits/women/47.jpg'),
(47, 7, 'Lucas Lopez', '2669224438', 'c47@mail.com', 'closed', NULL, '2025-06-14 14:10:16', '2025-08-04 14:10:16', 'https://randomuser.me/api/portraits/men/48.jpg'),
(48, 7, 'Lucia Diaz', '2662476086', 'c48@mail.com', 'closed', NULL, '2025-01-30 08:12:06', '2025-02-20 08:12:06', 'https://randomuser.me/api/portraits/women/49.jpg'),
(49, 7, 'Franco Ruiz', '2664727734', 'c49@mail.com', 'lost', NULL, '2025-03-17 02:13:57', '2025-04-08 02:13:57', 'https://randomuser.me/api/portraits/men/50.jpg'),
(50, 8, 'Sofia Perez', '2666979382', 'c50@mail.com', 'won', NULL, '2025-04-30 20:15:48', '2025-05-14 20:15:48', 'https://randomuser.me/api/portraits/women/51.jpg'),
(51, 8, 'Martin Gomez', '2669231030', 'c51@mail.com', 'in_conversation', NULL, '2025-06-14 14:17:39', '2025-06-24 14:17:39', 'https://randomuser.me/api/portraits/men/52.jpg'),
(52, 8, 'Carla Lopez', '2662482678', 'c52@mail.com', 'in_conversation', NULL, '2025-01-30 08:19:29', '2025-02-01 08:19:29', 'https://randomuser.me/api/portraits/women/53.jpg'),
(53, 8, 'Nicolas Diaz', '2664734326', 'c53@mail.com', 'new', NULL, '2025-03-17 02:21:20', '2025-03-17 02:21:20', 'https://randomuser.me/api/portraits/men/54.jpg'),
(54, 8, 'Martina Ruiz', '2666985974', 'c54@mail.com', 'new', NULL, '2025-04-30 20:23:11', '2025-04-30 20:23:11', 'https://randomuser.me/api/portraits/women/55.jpg'),
(55, 8, 'Juan Perez', '2669237621', 'c55@mail.com', 'closed', NULL, '2025-06-14 14:25:01', '2025-08-04 14:25:01', 'https://randomuser.me/api/portraits/men/56.jpg'),
(56, 8, 'Valentina Gomez', '2662489270', 'c56@mail.com', 'closed', NULL, '2025-01-30 08:26:52', '2025-02-20 08:26:52', 'https://randomuser.me/api/portraits/women/57.jpg'),
(57, 8, 'Lucas Lopez', '2664740918', 'c57@mail.com', 'closed', NULL, '2025-03-17 02:28:43', '2025-04-17 02:28:43', 'https://randomuser.me/api/portraits/men/58.jpg'),
(58, 8, 'Lucia Diaz', '2666992566', 'c58@mail.com', 'lost', NULL, '2025-04-30 20:30:34', '2025-05-29 20:30:34', 'https://randomuser.me/api/portraits/women/59.jpg'),
(59, 8, 'Franco Ruiz', '2669244213', 'c59@mail.com', 'lost', NULL, '2025-06-14 14:32:24', '2025-07-21 14:32:24', 'https://randomuser.me/api/portraits/men/60.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `customer_tags`
--

CREATE TABLE `customer_tags` (
  `id` int(50) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `tag_id` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `customer_tags`
--

INSERT INTO `customer_tags` (`id`, `customer_id`, `tag_id`) VALUES
(1, 6, '3'),
(9, 7, '2'),
(3, 8, '3'),
(10, 10, '1'),
(11, 11, '2'),
(12, 12, '3'),
(13, 13, '4'),
(60, 14, '1'),
(61, 14, '2'),
(15, 15, '1'),
(16, 16, '2'),
(17, 17, '3'),
(18, 18, '4'),
(19, 19, '1'),
(20, 20, '2'),
(21, 21, '3'),
(22, 22, '4'),
(23, 23, '1'),
(24, 24, '1'),
(25, 25, '2'),
(26, 26, '3'),
(27, 27, '4'),
(28, 28, '1'),
(29, 29, '1'),
(30, 30, '3'),
(31, 31, '4'),
(32, 32, '1'),
(33, 33, '1'),
(34, 34, '2'),
(35, 35, '3'),
(36, 36, '4'),
(37, 37, '1'),
(38, 38, '1'),
(39, 39, '2'),
(40, 40, '4'),
(41, 41, '1'),
(42, 42, '1'),
(43, 43, '2'),
(44, 44, '3'),
(45, 45, '4'),
(46, 46, '1'),
(47, 47, '1'),
(48, 48, '2'),
(49, 49, '3'),
(50, 50, '1'),
(51, 51, '1'),
(52, 52, '2'),
(53, 53, '3'),
(54, 54, '4'),
(55, 55, '1'),
(56, 56, '1'),
(57, 57, '2'),
(58, 58, '3'),
(59, 59, '4');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `content` text NOT NULL,
  `direction` enum('incoming','outgoing') NOT NULL,
  `status` enum('sent','delivered','read') DEFAULT 'sent',
  `customer_id` int(11) NOT NULL,
  `conversation_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `delivered_at` datetime DEFAULT NULL,
  `read_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `messages`
--

INSERT INTO `messages` (`id`, `content`, `direction`, `status`, `customer_id`, `conversation_id`, `created_at`, `delivered_at`, `read_at`) VALUES
(1, 'Hola, me interesa el producto.', 'incoming', 'read', 7, 1, '2025-06-14 09:56:26', NULL, NULL),
(2, 'Excelente, contame qué necesitás.', 'outgoing', 'read', 7, 1, '2025-06-14 14:56:26', NULL, NULL),
(3, 'Estoy comparando alternativas.', 'incoming', 'read', 7, 1, '2025-06-14 13:56:26', NULL, NULL),
(4, 'Te puedo explicar las ventajas.', 'outgoing', 'read', 7, 1, '2025-06-14 15:56:26', NULL, NULL),
(5, 'Perfecto.', 'incoming', 'read', 7, 1, '2025-06-14 21:56:26', NULL, NULL),
(6, '¿Tenés alguna duda puntual?', 'outgoing', 'read', 7, 1, '2025-06-15 10:56:26', NULL, NULL),
(7, 'Quisiera saber formas de pago.', 'incoming', 'read', 7, 1, '2025-06-15 03:56:26', NULL, NULL),
(8, 'Tenemos varias opciones.', 'outgoing', 'read', 7, 1, '2025-06-15 20:56:26', NULL, NULL),
(9, 'Bien, voy a analizarlo.', 'incoming', 'delivered', 7, 1, '2025-06-15 01:56:26', NULL, NULL),
(10, 'Sin problema.', 'outgoing', 'delivered', 7, 1, '2025-06-15 21:56:26', NULL, NULL),
(11, 'Mañana te confirmo.', 'incoming', 'sent', 7, 1, '2025-06-16 01:56:26', NULL, NULL),
(12, 'Quedo atento a tu respuesta.', 'outgoing', 'sent', 7, 1, '2025-06-15 18:56:26', NULL, NULL),
(13, 'Hola, me interesa el producto.', 'incoming', 'read', 7, 2, '2025-06-14 09:56:26', NULL, NULL),
(14, 'Excelente, contame qué necesitás.', 'outgoing', 'read', 7, 2, '2025-06-14 13:56:26', NULL, NULL),
(15, 'Estoy comparando alternativas.', 'incoming', 'read', 7, 2, '2025-06-14 13:56:26', NULL, NULL),
(16, 'Te puedo explicar las ventajas.', 'outgoing', 'read', 7, 2, '2025-06-14 15:56:26', NULL, NULL),
(17, 'Perfecto.', 'incoming', 'read', 7, 2, '2025-06-14 21:56:26', NULL, NULL),
(18, '¿Tenés alguna duda puntual?', 'outgoing', 'read', 7, 2, '2025-06-14 19:56:26', NULL, NULL),
(19, 'Quisiera saber formas de pago.', 'incoming', 'read', 7, 2, '2025-06-14 21:56:26', NULL, NULL),
(20, 'Tenemos varias opciones.', 'outgoing', 'read', 7, 2, '2025-06-15 06:56:26', NULL, NULL),
(21, 'Bien, voy a analizarlo.', 'incoming', 'delivered', 7, 2, '2025-06-15 09:56:26', NULL, NULL),
(22, 'Sin problema.', 'outgoing', 'delivered', 7, 2, '2025-06-15 21:56:26', NULL, NULL),
(23, 'Mañana te confirmo.', 'incoming', 'sent', 7, 2, '2025-06-16 11:56:26', NULL, NULL),
(24, 'Quedo atento a tu respuesta.', 'outgoing', 'sent', 7, 2, '2025-06-16 16:56:26', NULL, NULL),
(25, 'Hola, me interesa el producto.', 'incoming', 'read', 8, 3, '2025-01-31 03:58:17', NULL, NULL),
(26, 'Excelente, contame qué necesitás.', 'outgoing', 'read', 8, 3, '2025-01-31 06:58:17', NULL, NULL),
(27, 'Estoy comparando alternativas.', 'incoming', 'read', 8, 3, '2025-01-31 07:58:17', NULL, NULL),
(28, 'Te puedo explicar las ventajas.', 'outgoing', 'read', 8, 3, '2025-01-31 18:58:17', NULL, NULL),
(29, 'Perfecto.', 'incoming', 'read', 8, 3, '2025-01-31 15:58:17', NULL, NULL),
(30, '¿Tenés alguna duda puntual?', 'outgoing', 'read', 8, 3, '2025-01-31 13:58:17', NULL, NULL),
(31, 'Quisiera saber formas de pago.', 'incoming', 'read', 8, 3, '2025-02-01 03:58:17', NULL, NULL),
(32, 'Tenemos varias opciones.', 'outgoing', 'read', 8, 3, '2025-02-01 07:58:17', NULL, NULL),
(33, 'Bien, voy a analizarlo.', 'incoming', 'delivered', 8, 3, '2025-02-01 19:58:17', NULL, NULL),
(34, 'Sin problema.', 'outgoing', 'delivered', 8, 3, '2025-02-01 15:58:17', NULL, NULL),
(35, 'Mañana te confirmo.', 'incoming', 'sent', 8, 3, '2025-02-01 09:58:17', NULL, NULL),
(36, 'Quedo atento a tu respuesta.', 'outgoing', 'sent', 8, 3, '2025-02-02 10:58:17', NULL, NULL),
(37, 'Hola, quería información.', 'incoming', 'read', 9, 4, '2025-03-15 22:00:07', NULL, NULL),
(38, 'Claro, ¿en qué puedo ayudarte?', 'outgoing', 'read', 9, 4, '2025-03-16 03:00:07', NULL, NULL),
(39, 'Estoy evaluando el proyecto.', 'incoming', 'read', 9, 4, '2025-03-16 02:00:07', NULL, NULL),
(40, 'Te envié toda la información por aquí.', 'outgoing', 'read', 9, 4, '2025-03-16 07:00:07', NULL, NULL),
(41, 'La recibí correctamente.', 'incoming', 'read', 9, 4, '2025-03-16 18:00:07', NULL, NULL),
(42, '¿Pudiste revisarla?', 'outgoing', 'read', 9, 4, '2025-03-16 18:00:07', NULL, NULL),
(43, 'Sí, pero voy a postergarlo.', 'incoming', 'read', 9, 4, '2025-03-16 10:00:07', NULL, NULL),
(44, 'Entendido.', 'outgoing', 'read', 9, 4, '2025-03-16 12:00:07', NULL, NULL),
(45, 'Gracias por el seguimiento.', 'incoming', 'read', 9, 4, '2025-03-16 22:00:07', NULL, NULL),
(46, 'No hay problema.', 'outgoing', 'read', 9, 4, '2025-03-16 16:00:07', NULL, NULL),
(47, 'Si retomo el proyecto te escribo.', 'incoming', 'read', 9, 4, '2025-03-17 14:00:07', NULL, NULL),
(48, 'Perfecto, cerramos la consulta por ahora.', 'outgoing', 'read', 9, 4, '2025-03-16 20:00:07', NULL, NULL),
(49, 'Hola, vi la publicación y me interesa.', 'incoming', 'read', 10, 5, '2025-04-30 16:01:58', NULL, NULL),
(50, '¡Hola! Gracias por escribirnos.', 'outgoing', 'read', 10, 5, '2025-04-30 21:01:58', NULL, NULL),
(51, '¿Podrías contarme un poco más?', 'incoming', 'read', 10, 5, '2025-04-30 22:01:58', NULL, NULL),
(52, 'Claro, te explico las características.', 'outgoing', 'read', 10, 5, '2025-05-01 01:01:58', NULL, NULL),
(53, '¿Cuál sería el precio final?', 'incoming', 'read', 10, 5, '2025-05-01 00:01:58', NULL, NULL),
(54, 'Tenemos una promoción vigente esta semana.', 'outgoing', 'read', 10, 5, '2025-05-01 02:01:58', NULL, NULL),
(55, 'Perfecto, ¿aceptan transferencia?', 'incoming', 'read', 10, 5, '2025-05-01 22:01:58', NULL, NULL),
(56, 'Sí, transferencia, débito y crédito.', 'outgoing', 'read', 10, 5, '2025-05-02 03:01:58', NULL, NULL),
(57, '¿Tienen stock disponible?', 'incoming', 'read', 10, 5, '2025-05-02 08:01:58', NULL, NULL),
(58, 'Sí, entrega inmediata.', 'outgoing', 'read', 10, 5, '2025-05-01 19:01:58', NULL, NULL),
(59, 'Excelente, me interesa avanzar.', 'incoming', 'read', 10, 5, '2025-05-01 12:01:58', NULL, NULL),
(60, 'Te envío los datos de pago.', 'outgoing', 'read', 10, 5, '2025-05-02 23:01:58', NULL, NULL),
(61, 'Listo, ya realicé la transferencia.', 'incoming', 'read', 10, 5, '2025-05-01 16:01:58', NULL, NULL),
(62, 'Pago acreditado correctamente.', 'outgoing', 'read', 10, 5, '2025-05-02 07:01:58', NULL, NULL),
(63, 'Muchas gracias por la atención.', 'incoming', 'read', 10, 5, '2025-05-03 00:01:58', NULL, NULL),
(64, 'Gracias a vos. La venta quedó confirmada.', 'outgoing', 'read', 10, 5, '2025-05-03 04:01:58', NULL, NULL),
(65, 'Hola, vi la publicación y me interesa.', 'incoming', 'read', 11, 6, '2025-06-14 10:03:49', NULL, NULL),
(66, '¡Hola! Gracias por escribirnos.', 'outgoing', 'read', 11, 6, '2025-06-14 14:03:49', NULL, NULL),
(67, '¿Podrías contarme un poco más?', 'incoming', 'read', 11, 6, '2025-06-14 20:03:49', NULL, NULL),
(68, 'Claro, te explico las características.', 'outgoing', 'read', 11, 6, '2025-06-14 22:03:49', NULL, NULL),
(69, '¿Cuál sería el precio final?', 'incoming', 'read', 11, 6, '2025-06-14 18:03:49', NULL, NULL),
(70, 'Tenemos una promoción vigente esta semana.', 'outgoing', 'read', 11, 6, '2025-06-15 01:03:49', NULL, NULL),
(71, 'Perfecto, ¿aceptan transferencia?', 'incoming', 'read', 11, 6, '2025-06-14 22:03:49', NULL, NULL),
(72, 'Sí, transferencia, débito y crédito.', 'outgoing', 'read', 11, 6, '2025-06-15 00:03:49', NULL, NULL),
(73, '¿Tienen stock disponible?', 'incoming', 'read', 11, 6, '2025-06-16 02:03:49', NULL, NULL),
(74, 'Sí, entrega inmediata.', 'outgoing', 'read', 11, 6, '2025-06-15 13:03:49', NULL, NULL),
(75, 'Excelente, me interesa avanzar.', 'incoming', 'read', 11, 6, '2025-06-16 12:03:49', NULL, NULL),
(76, 'Te envío los datos de pago.', 'outgoing', 'read', 11, 6, '2025-06-15 19:03:49', NULL, NULL),
(77, 'Listo, ya realicé la transferencia.', 'incoming', 'read', 11, 6, '2025-06-16 22:03:49', NULL, NULL),
(78, 'Pago acreditado correctamente.', 'outgoing', 'read', 11, 6, '2025-06-15 12:03:49', NULL, NULL),
(79, 'Muchas gracias por la atención.', 'incoming', 'read', 11, 6, '2025-06-15 14:03:49', NULL, NULL),
(80, 'Gracias a vos. La venta quedó confirmada.', 'outgoing', 'read', 11, 6, '2025-06-16 07:03:49', NULL, NULL),
(81, 'Hola, vi la publicación y me interesa.', 'incoming', 'read', 12, 7, '2025-01-31 04:05:39', NULL, NULL),
(82, '¡Hola! Gracias por escribirnos.', 'outgoing', 'read', 12, 7, '2025-01-31 06:05:39', NULL, NULL),
(83, '¿Podrías contarme un poco más?', 'incoming', 'read', 12, 7, '2025-01-31 12:05:39', NULL, NULL),
(84, 'Claro, te explico las características.', 'outgoing', 'read', 12, 7, '2025-01-31 10:05:39', NULL, NULL),
(85, '¿Cuál sería el precio final?', 'incoming', 'read', 12, 7, '2025-02-01 00:05:39', NULL, NULL),
(86, 'Tenemos una promoción vigente esta semana.', 'outgoing', 'read', 12, 7, '2025-01-31 14:05:39', NULL, NULL),
(87, 'Perfecto, ¿aceptan transferencia?', 'incoming', 'read', 12, 7, '2025-02-01 04:05:39', NULL, NULL),
(88, 'Sí, transferencia, débito y crédito.', 'outgoing', 'read', 12, 7, '2025-02-01 01:05:39', NULL, NULL),
(89, '¿Tienen stock disponible?', 'incoming', 'read', 12, 7, '2025-02-01 12:05:39', NULL, NULL),
(90, 'Sí, entrega inmediata.', 'outgoing', 'read', 12, 7, '2025-01-31 22:05:39', NULL, NULL),
(91, 'Excelente, me interesa avanzar.', 'incoming', 'read', 12, 7, '2025-02-01 00:05:39', NULL, NULL),
(92, 'Te envío los datos de pago.', 'outgoing', 'read', 12, 7, '2025-02-02 11:05:39', NULL, NULL),
(93, 'Listo, ya realicé la transferencia.', 'incoming', 'read', 12, 7, '2025-02-02 16:05:39', NULL, NULL),
(94, 'Pago acreditado correctamente.', 'outgoing', 'read', 12, 7, '2025-02-02 08:05:39', NULL, NULL),
(95, 'Muchas gracias por la atención.', 'incoming', 'read', 12, 7, '2025-02-01 08:05:39', NULL, NULL),
(96, 'Gracias a vos. La venta quedó confirmada.', 'outgoing', 'read', 12, 7, '2025-02-01 10:05:39', NULL, NULL),
(97, 'Hola, vi la publicación y me interesa.', 'incoming', 'read', 13, 8, '2025-03-15 22:07:30', NULL, NULL),
(98, '¡Hola! Gracias por escribirnos.', 'outgoing', 'read', 13, 8, '2025-03-16 03:07:30', NULL, NULL),
(99, '¿Podrías contarme un poco más?', 'incoming', 'read', 13, 8, '2025-03-16 06:07:30', NULL, NULL),
(100, 'Claro, te explico las características.', 'outgoing', 'read', 13, 8, '2025-03-16 13:07:30', NULL, NULL),
(101, '¿Cuál sería el precio final?', 'incoming', 'read', 13, 8, '2025-03-16 18:07:30', NULL, NULL),
(102, 'Tenemos una promoción vigente esta semana.', 'outgoing', 'read', 13, 8, '2025-03-16 23:07:30', NULL, NULL),
(103, 'Perfecto, ¿aceptan transferencia?', 'incoming', 'read', 13, 8, '2025-03-16 22:07:30', NULL, NULL),
(104, 'Sí, transferencia, débito y crédito.', 'outgoing', 'read', 13, 8, '2025-03-16 12:07:30', NULL, NULL),
(105, '¿Tienen stock disponible?', 'incoming', 'read', 13, 8, '2025-03-16 14:07:30', NULL, NULL),
(106, 'Sí, entrega inmediata.', 'outgoing', 'read', 13, 8, '2025-03-17 19:07:30', NULL, NULL),
(107, 'Excelente, me interesa avanzar.', 'incoming', 'read', 13, 8, '2025-03-17 14:07:30', NULL, NULL),
(108, 'Te envío los datos de pago.', 'outgoing', 'read', 13, 8, '2025-03-16 20:07:30', NULL, NULL),
(109, 'Listo, ya realicé la transferencia.', 'incoming', 'read', 13, 8, '2025-03-17 10:07:30', NULL, NULL),
(110, 'Pago acreditado correctamente.', 'outgoing', 'read', 13, 8, '2025-03-18 15:07:30', NULL, NULL),
(111, 'Muchas gracias por la atención.', 'incoming', 'read', 13, 8, '2025-03-17 16:07:30', NULL, NULL),
(112, 'Gracias a vos. La venta quedó confirmada.', 'outgoing', 'read', 13, 8, '2025-03-18 10:07:30', NULL, NULL),
(113, 'Hola, me interesa el producto.', 'incoming', 'read', 14, 9, '2025-04-30 16:09:21', NULL, NULL),
(114, 'Excelente, contame qué necesitás.', 'outgoing', 'read', 14, 9, '2025-04-30 20:09:21', NULL, NULL),
(115, 'Estoy comparando alternativas.', 'incoming', 'read', 14, 9, '2025-04-30 20:09:21', NULL, NULL),
(116, 'Te puedo explicar las ventajas.', 'outgoing', 'read', 14, 9, '2025-05-01 07:09:21', NULL, NULL),
(117, 'Perfecto.', 'incoming', 'read', 14, 9, '2025-05-01 08:09:21', NULL, NULL),
(118, '¿Tenés alguna duda puntual?', 'outgoing', 'read', 14, 9, '2025-05-01 12:09:21', NULL, NULL),
(119, 'Quisiera saber formas de pago.', 'incoming', 'read', 14, 9, '2025-05-01 10:09:21', NULL, NULL),
(120, 'Tenemos varias opciones.', 'outgoing', 'read', 14, 9, '2025-05-01 20:09:21', NULL, NULL),
(121, 'Bien, voy a analizarlo.', 'incoming', 'delivered', 14, 9, '2025-05-02 08:09:21', NULL, NULL),
(122, 'Sin problema.', 'outgoing', 'delivered', 14, 9, '2025-05-01 19:09:21', NULL, NULL),
(123, 'Mañana te confirmo.', 'incoming', 'sent', 14, 9, '2025-05-01 12:09:21', NULL, NULL),
(124, 'Quedo atento a tu respuesta.', 'outgoing', 'sent', 14, 9, '2025-05-02 01:09:21', NULL, NULL),
(125, 'Hola, me interesa el producto.', 'incoming', 'read', 15, 10, '2025-06-14 10:11:12', NULL, NULL),
(126, 'Excelente, contame qué necesitás.', 'outgoing', 'read', 15, 10, '2025-06-14 12:11:12', NULL, NULL),
(127, 'Estoy comparando alternativas.', 'incoming', 'read', 15, 10, '2025-06-14 16:11:12', NULL, NULL),
(128, 'Te puedo explicar las ventajas.', 'outgoing', 'read', 15, 10, '2025-06-14 19:11:12', NULL, NULL),
(129, 'Perfecto.', 'incoming', 'read', 15, 10, '2025-06-15 02:11:12', NULL, NULL),
(130, '¿Tenés alguna duda puntual?', 'outgoing', 'read', 15, 10, '2025-06-14 20:11:12', NULL, NULL),
(131, 'Quisiera saber formas de pago.', 'incoming', 'read', 15, 10, '2025-06-15 10:11:12', NULL, NULL),
(132, 'Tenemos varias opciones.', 'outgoing', 'read', 15, 10, '2025-06-15 21:11:12', NULL, NULL),
(133, 'Bien, voy a analizarlo.', 'incoming', 'delivered', 15, 10, '2025-06-15 10:11:12', NULL, NULL),
(134, 'Sin problema.', 'outgoing', 'delivered', 15, 10, '2025-06-15 13:11:12', NULL, NULL),
(135, 'Mañana te confirmo.', 'incoming', 'sent', 15, 10, '2025-06-16 12:11:12', NULL, NULL),
(136, 'Quedo atento a tu respuesta.', 'outgoing', 'sent', 15, 10, '2025-06-16 06:11:12', NULL, NULL),
(137, 'Hola.', 'incoming', 'read', 16, 11, '2025-01-31 04:13:02', NULL, NULL),
(138, 'Hola, gracias por contactarnos.', 'outgoing', 'read', 16, 11, '2025-01-31 07:13:02', NULL, NULL),
(139, 'Vi una publicación de ustedes.', 'incoming', 'read', 16, 11, '2025-01-31 14:13:02', NULL, NULL),
(140, 'Correcto, ¿qué información necesitás?', 'outgoing', 'read', 16, 11, '2025-01-31 19:13:02', NULL, NULL),
(141, 'Todavía estoy averiguando.', 'incoming', 'read', 16, 11, '2025-02-01 00:13:02', NULL, NULL),
(142, 'Perfecto, puedo ayudarte cuando quieras.', 'outgoing', 'read', 16, 11, '2025-01-31 14:13:02', NULL, NULL),
(143, '¿Me podrías pasar catálogo?', 'incoming', 'delivered', 16, 11, '2025-02-01 10:13:02', NULL, NULL),
(144, 'Claro, te lo envío.', 'outgoing', 'delivered', 16, 11, '2025-02-01 01:13:02', NULL, NULL),
(145, 'Gracias.', 'incoming', 'sent', 16, 11, '2025-01-31 20:13:02', NULL, NULL),
(146, 'A disposición.', 'outgoing', 'sent', 16, 11, '2025-02-01 16:13:02', NULL, NULL),
(147, 'Hola, quería información.', 'incoming', 'read', 17, 12, '2025-03-15 22:14:53', NULL, NULL),
(148, 'Claro, ¿en qué puedo ayudarte?', 'outgoing', 'read', 17, 12, '2025-03-16 02:14:53', NULL, NULL),
(149, 'Estoy evaluando el proyecto.', 'incoming', 'read', 17, 12, '2025-03-16 08:14:53', NULL, NULL),
(150, 'Te envié toda la información por aquí.', 'outgoing', 'read', 17, 12, '2025-03-16 10:14:53', NULL, NULL),
(151, 'La recibí correctamente.', 'incoming', 'read', 17, 12, '2025-03-16 18:14:53', NULL, NULL),
(152, '¿Pudiste revisarla?', 'outgoing', 'read', 17, 12, '2025-03-16 23:14:53', NULL, NULL),
(153, 'Sí, pero voy a postergarlo.', 'incoming', 'read', 17, 12, '2025-03-16 10:14:53', NULL, NULL),
(154, 'Entendido.', 'outgoing', 'read', 17, 12, '2025-03-16 19:14:53', NULL, NULL),
(155, 'Gracias por el seguimiento.', 'incoming', 'read', 17, 12, '2025-03-16 14:14:53', NULL, NULL),
(156, 'No hay problema.', 'outgoing', 'read', 17, 12, '2025-03-17 19:14:53', NULL, NULL),
(157, 'Si retomo el proyecto te escribo.', 'incoming', 'read', 17, 12, '2025-03-17 14:14:53', NULL, NULL),
(158, 'Perfecto, cerramos la consulta por ahora.', 'outgoing', 'read', 17, 12, '2025-03-17 07:14:53', NULL, NULL),
(159, 'Hola, quería consultar precios.', 'incoming', 'read', 18, 13, '2025-04-30 16:16:44', NULL, NULL),
(160, 'Con gusto, te paso la información.', 'outgoing', 'read', 18, 13, '2025-04-30 19:16:44', NULL, NULL),
(161, 'Lo estoy comparando con otras opciones.', 'incoming', 'read', 18, 13, '2025-05-01 02:16:44', NULL, NULL),
(162, 'Perfecto, cualquier duda consultame.', 'outgoing', 'read', 18, 13, '2025-05-01 04:16:44', NULL, NULL),
(163, '¿Hay descuento adicional?', 'incoming', 'read', 18, 13, '2025-05-01 00:16:44', NULL, NULL),
(164, 'Por el momento no.', 'outgoing', 'read', 18, 13, '2025-05-01 07:16:44', NULL, NULL),
(165, 'Entiendo.', 'incoming', 'read', 18, 13, '2025-05-01 10:16:44', NULL, NULL),
(166, '¿Qué te pareció la propuesta?', 'outgoing', 'read', 18, 13, '2025-05-01 20:16:44', NULL, NULL),
(167, 'La verdad encontré algo más económico.', 'incoming', 'read', 18, 13, '2025-05-02 08:16:44', NULL, NULL),
(168, 'Comprendo.', 'outgoing', 'read', 18, 13, '2025-05-01 19:16:44', NULL, NULL),
(169, 'Creo que voy a elegir la otra opción.', 'incoming', 'read', 18, 13, '2025-05-01 12:16:44', NULL, NULL),
(170, 'No hay problema, gracias por tu tiempo.', 'outgoing', 'read', 18, 13, '2025-05-02 01:16:44', NULL, NULL),
(171, 'Quizás más adelante vuelva a consultar.', 'incoming', 'read', 18, 13, '2025-05-02 04:16:44', NULL, NULL),
(172, 'Te esperamos cuando quieras.', 'outgoing', 'read', 18, 13, '2025-05-01 18:16:44', NULL, NULL),
(173, 'Hola, quería consultar precios.', 'incoming', 'read', 19, 14, '2025-06-14 10:18:35', NULL, NULL),
(174, 'Con gusto, te paso la información.', 'outgoing', 'read', 19, 14, '2025-06-14 15:18:35', NULL, NULL),
(175, 'Lo estoy comparando con otras opciones.', 'incoming', 'read', 19, 14, '2025-06-14 18:18:35', NULL, NULL),
(176, 'Perfecto, cualquier duda consultame.', 'outgoing', 'read', 19, 14, '2025-06-14 16:18:35', NULL, NULL),
(177, '¿Hay descuento adicional?', 'incoming', 'read', 19, 14, '2025-06-14 18:18:35', NULL, NULL),
(178, 'Por el momento no.', 'outgoing', 'read', 19, 14, '2025-06-15 06:18:35', NULL, NULL),
(179, 'Entiendo.', 'incoming', 'read', 19, 14, '2025-06-15 16:18:35', NULL, NULL),
(180, '¿Qué te pareció la propuesta?', 'outgoing', 'read', 19, 14, '2025-06-15 00:18:35', NULL, NULL),
(181, 'La verdad encontré algo más económico.', 'incoming', 'read', 19, 14, '2025-06-16 02:18:35', NULL, NULL),
(182, 'Comprendo.', 'outgoing', 'read', 19, 14, '2025-06-16 07:18:35', NULL, NULL),
(183, 'Creo que voy a elegir la otra opción.', 'incoming', 'read', 19, 14, '2025-06-15 06:18:35', NULL, NULL),
(184, 'No hay problema, gracias por tu tiempo.', 'outgoing', 'read', 19, 14, '2025-06-16 17:18:35', NULL, NULL),
(185, 'Quizás más adelante vuelva a consultar.', 'incoming', 'read', 19, 14, '2025-06-16 22:18:35', NULL, NULL),
(186, 'Te esperamos cuando quieras.', 'outgoing', 'read', 19, 14, '2025-06-16 14:18:35', NULL, NULL),
(187, 'Hola, vi la publicación y me interesa.', 'incoming', 'read', 20, 15, '2025-01-31 04:20:25', NULL, NULL),
(188, '¡Hola! Gracias por escribirnos.', 'outgoing', 'read', 20, 15, '2025-01-31 06:20:25', NULL, NULL),
(189, '¿Podrías contarme un poco más?', 'incoming', 'read', 20, 15, '2025-01-31 14:20:25', NULL, NULL),
(190, 'Claro, te explico las características.', 'outgoing', 'read', 20, 15, '2025-01-31 19:20:25', NULL, NULL),
(191, '¿Cuál sería el precio final?', 'incoming', 'read', 20, 15, '2025-01-31 12:20:25', NULL, NULL),
(192, 'Tenemos una promoción vigente esta semana.', 'outgoing', 'read', 20, 15, '2025-01-31 19:20:25', NULL, NULL),
(193, 'Perfecto, ¿aceptan transferencia?', 'incoming', 'read', 20, 15, '2025-01-31 22:20:25', NULL, NULL),
(194, 'Sí, transferencia, débito y crédito.', 'outgoing', 'read', 20, 15, '2025-02-01 08:20:25', NULL, NULL),
(195, '¿Tienen stock disponible?', 'incoming', 'read', 20, 15, '2025-02-01 20:20:25', NULL, NULL),
(196, 'Sí, entrega inmediata.', 'outgoing', 'read', 20, 15, '2025-02-01 07:20:25', NULL, NULL),
(197, 'Excelente, me interesa avanzar.', 'incoming', 'read', 20, 15, '2025-02-02 06:20:25', NULL, NULL),
(198, 'Te envío los datos de pago.', 'outgoing', 'read', 20, 15, '2025-02-02 11:20:25', NULL, NULL),
(199, 'Listo, ya realicé la transferencia.', 'incoming', 'read', 20, 15, '2025-02-02 16:20:25', NULL, NULL),
(200, 'Pago acreditado correctamente.', 'outgoing', 'read', 20, 15, '2025-02-01 19:20:25', NULL, NULL),
(201, 'Muchas gracias por la atención.', 'incoming', 'read', 20, 15, '2025-02-01 08:20:25', NULL, NULL),
(202, 'Gracias a vos. La venta quedó confirmada.', 'outgoing', 'read', 20, 15, '2025-02-03 07:20:25', NULL, NULL),
(203, 'Hola, vi la publicación y me interesa.', 'incoming', 'read', 21, 16, '2025-03-15 22:22:16', NULL, NULL),
(204, '¡Hola! Gracias por escribirnos.', 'outgoing', 'read', 21, 16, '2025-03-16 02:22:16', NULL, NULL),
(205, '¿Podrías contarme un poco más?', 'incoming', 'read', 21, 16, '2025-03-16 02:22:16', NULL, NULL),
(206, 'Claro, te explico las características.', 'outgoing', 'read', 21, 16, '2025-03-16 13:22:16', NULL, NULL),
(207, '¿Cuál sería el precio final?', 'incoming', 'read', 21, 16, '2025-03-16 18:22:16', NULL, NULL),
(208, 'Tenemos una promoción vigente esta semana.', 'outgoing', 'read', 21, 16, '2025-03-16 23:22:16', NULL, NULL),
(209, 'Perfecto, ¿aceptan transferencia?', 'incoming', 'read', 21, 16, '2025-03-17 04:22:16', NULL, NULL),
(210, 'Sí, transferencia, débito y crédito.', 'outgoing', 'read', 21, 16, '2025-03-17 02:22:16', NULL, NULL),
(211, '¿Tienen stock disponible?', 'incoming', 'read', 21, 16, '2025-03-16 22:22:16', NULL, NULL),
(212, 'Sí, entrega inmediata.', 'outgoing', 'read', 21, 16, '2025-03-17 10:22:16', NULL, NULL),
(213, 'Excelente, me interesa avanzar.', 'incoming', 'read', 21, 16, '2025-03-17 14:22:16', NULL, NULL),
(214, 'Te envío los datos de pago.', 'outgoing', 'read', 21, 16, '2025-03-18 05:22:16', NULL, NULL),
(215, 'Listo, ya realicé la transferencia.', 'incoming', 'read', 21, 16, '2025-03-17 10:22:16', NULL, NULL),
(216, 'Pago acreditado correctamente.', 'outgoing', 'read', 21, 16, '2025-03-18 15:22:16', NULL, NULL),
(217, 'Muchas gracias por la atención.', 'incoming', 'read', 21, 16, '2025-03-17 16:22:16', NULL, NULL),
(218, 'Gracias a vos. La venta quedó confirmada.', 'outgoing', 'read', 21, 16, '2025-03-17 04:22:16', NULL, NULL),
(219, 'Hola, me interesa el producto.', 'incoming', 'read', 22, 17, '2025-04-30 16:24:07', NULL, NULL),
(220, 'Excelente, contame qué necesitás.', 'outgoing', 'read', 22, 17, '2025-04-30 18:24:07', NULL, NULL),
(221, 'Estoy comparando alternativas.', 'incoming', 'read', 22, 17, '2025-05-01 00:24:07', NULL, NULL),
(222, 'Te puedo explicar las ventajas.', 'outgoing', 'read', 22, 17, '2025-05-01 01:24:07', NULL, NULL),
(223, 'Perfecto.', 'incoming', 'read', 22, 17, '2025-05-01 08:24:07', NULL, NULL),
(224, '¿Tenés alguna duda puntual?', 'outgoing', 'read', 22, 17, '2025-05-01 12:24:07', NULL, NULL),
(225, 'Quisiera saber formas de pago.', 'incoming', 'read', 22, 17, '2025-05-01 10:24:07', NULL, NULL),
(226, 'Tenemos varias opciones.', 'outgoing', 'read', 22, 17, '2025-05-01 06:24:07', NULL, NULL),
(227, 'Bien, voy a analizarlo.', 'incoming', 'delivered', 22, 17, '2025-05-01 08:24:07', NULL, NULL),
(228, 'Sin problema.', 'outgoing', 'delivered', 22, 17, '2025-05-02 13:24:07', NULL, NULL),
(229, 'Mañana te confirmo.', 'incoming', 'sent', 22, 17, '2025-05-01 12:24:07', NULL, NULL),
(230, 'Quedo atento a tu respuesta.', 'outgoing', 'sent', 22, 17, '2025-05-02 01:24:07', NULL, NULL),
(231, 'Hola, me interesa el producto.', 'incoming', 'read', 23, 18, '2025-06-14 10:25:58', NULL, NULL),
(232, 'Excelente, contame qué necesitás.', 'outgoing', 'read', 23, 18, '2025-06-14 12:25:58', NULL, NULL),
(233, 'Estoy comparando alternativas.', 'incoming', 'read', 23, 18, '2025-06-14 14:25:58', NULL, NULL),
(234, 'Te puedo explicar las ventajas.', 'outgoing', 'read', 23, 18, '2025-06-14 22:25:58', NULL, NULL),
(235, 'Perfecto.', 'incoming', 'read', 23, 18, '2025-06-14 18:25:58', NULL, NULL),
(236, '¿Tenés alguna duda puntual?', 'outgoing', 'read', 23, 18, '2025-06-15 11:25:58', NULL, NULL),
(237, 'Quisiera saber formas de pago.', 'incoming', 'read', 23, 18, '2025-06-15 16:25:58', NULL, NULL),
(238, 'Tenemos varias opciones.', 'outgoing', 'read', 23, 18, '2025-06-15 00:25:58', NULL, NULL),
(239, 'Bien, voy a analizarlo.', 'incoming', 'delivered', 23, 18, '2025-06-15 18:25:58', NULL, NULL),
(240, 'Sin problema.', 'outgoing', 'delivered', 23, 18, '2025-06-15 13:25:58', NULL, NULL),
(241, 'Mañana te confirmo.', 'incoming', 'sent', 23, 18, '2025-06-16 12:25:58', NULL, NULL),
(242, 'Quedo atento a tu respuesta.', 'outgoing', 'sent', 23, 18, '2025-06-16 06:25:58', NULL, NULL),
(243, 'Hola, me interesa el producto.', 'incoming', 'read', 24, 19, '2025-01-31 04:27:48', NULL, NULL),
(244, 'Excelente, contame qué necesitás.', 'outgoing', 'read', 24, 19, '2025-01-31 08:27:48', NULL, NULL),
(245, 'Estoy comparando alternativas.', 'incoming', 'read', 24, 19, '2025-01-31 12:27:48', NULL, NULL),
(246, 'Te puedo explicar las ventajas.', 'outgoing', 'read', 24, 19, '2025-01-31 13:27:48', NULL, NULL),
(247, 'Perfecto.', 'incoming', 'read', 24, 19, '2025-02-01 00:27:48', NULL, NULL),
(248, '¿Tenés alguna duda puntual?', 'outgoing', 'read', 24, 19, '2025-02-01 05:27:48', NULL, NULL),
(249, 'Quisiera saber formas de pago.', 'incoming', 'read', 24, 19, '2025-02-01 10:27:48', NULL, NULL),
(250, 'Tenemos varias opciones.', 'outgoing', 'read', 24, 19, '2025-01-31 18:27:48', NULL, NULL),
(251, 'Bien, voy a analizarlo.', 'incoming', 'delivered', 24, 19, '2025-02-01 04:27:48', NULL, NULL),
(252, 'Sin problema.', 'outgoing', 'delivered', 24, 19, '2025-02-01 07:27:48', NULL, NULL),
(253, 'Mañana te confirmo.', 'incoming', 'sent', 24, 19, '2025-02-01 00:27:48', NULL, NULL),
(254, 'Quedo atento a tu respuesta.', 'outgoing', 'sent', 24, 19, '2025-02-01 13:27:48', NULL, NULL),
(255, 'Hola, me interesa el producto.', 'incoming', 'read', 25, 20, '2025-03-15 22:29:39', NULL, NULL),
(256, 'Excelente, contame qué necesitás.', 'outgoing', 'read', 25, 20, '2025-03-16 02:29:39', NULL, NULL),
(257, 'Estoy comparando alternativas.', 'incoming', 'read', 25, 20, '2025-03-16 02:29:39', NULL, NULL),
(258, 'Te puedo explicar las ventajas.', 'outgoing', 'read', 25, 20, '2025-03-16 13:29:39', NULL, NULL),
(259, 'Perfecto.', 'incoming', 'read', 25, 20, '2025-03-16 10:29:39', NULL, NULL),
(260, '¿Tenés alguna duda puntual?', 'outgoing', 'read', 25, 20, '2025-03-16 08:29:39', NULL, NULL),
(261, 'Quisiera saber formas de pago.', 'incoming', 'read', 25, 20, '2025-03-16 16:29:39', NULL, NULL),
(262, 'Tenemos varias opciones.', 'outgoing', 'read', 25, 20, '2025-03-17 09:29:39', NULL, NULL),
(263, 'Bien, voy a analizarlo.', 'incoming', 'delivered', 25, 20, '2025-03-16 22:29:39', NULL, NULL),
(264, 'Sin problema.', 'outgoing', 'delivered', 25, 20, '2025-03-17 10:29:39', NULL, NULL),
(265, 'Mañana te confirmo.', 'incoming', 'sent', 25, 20, '2025-03-17 04:29:39', NULL, NULL),
(266, 'Quedo atento a tu respuesta.', 'outgoing', 'sent', 25, 20, '2025-03-17 18:29:39', NULL, NULL),
(267, 'Hola.', 'incoming', 'read', 26, 21, '2025-04-30 16:31:30', NULL, NULL),
(268, 'Hola, gracias por contactarnos.', 'outgoing', 'read', 26, 21, '2025-04-30 19:31:30', NULL, NULL),
(269, 'Vi una publicación de ustedes.', 'incoming', 'read', 26, 21, '2025-05-01 02:31:30', NULL, NULL),
(270, 'Correcto, ¿qué información necesitás?', 'outgoing', 'read', 26, 21, '2025-05-01 04:31:30', NULL, NULL),
(271, 'Todavía estoy averiguando.', 'incoming', 'read', 26, 21, '2025-05-01 08:31:30', NULL, NULL),
(272, 'Perfecto, puedo ayudarte cuando quieras.', 'outgoing', 'read', 26, 21, '2025-05-01 17:31:30', NULL, NULL),
(273, '¿Me podrías pasar catálogo?', 'incoming', 'delivered', 26, 21, '2025-05-01 22:31:30', NULL, NULL),
(274, 'Claro, te lo envío.', 'outgoing', 'delivered', 26, 21, '2025-05-01 13:31:30', NULL, NULL),
(275, 'Gracias.', 'incoming', 'sent', 26, 21, '2025-05-02 00:31:30', NULL, NULL),
(276, 'A disposición.', 'outgoing', 'sent', 26, 21, '2025-05-02 04:31:30', NULL, NULL),
(277, 'Hola.', 'incoming', 'read', 27, 22, '2025-06-14 10:33:21', NULL, NULL),
(278, 'Hola, gracias por contactarnos.', 'outgoing', 'read', 27, 22, '2025-06-14 12:33:21', NULL, NULL),
(279, 'Vi una publicación de ustedes.', 'incoming', 'read', 27, 22, '2025-06-14 14:33:21', NULL, NULL),
(280, 'Correcto, ¿qué información necesitás?', 'outgoing', 'read', 27, 22, '2025-06-14 19:33:21', NULL, NULL),
(281, 'Todavía estoy averiguando.', 'incoming', 'read', 27, 22, '2025-06-14 18:33:21', NULL, NULL),
(282, 'Perfecto, puedo ayudarte cuando quieras.', 'outgoing', 'read', 27, 22, '2025-06-15 11:33:21', NULL, NULL),
(283, '¿Me podrías pasar catálogo?', 'incoming', 'delivered', 27, 22, '2025-06-15 16:33:21', NULL, NULL),
(284, 'Claro, te lo envío.', 'outgoing', 'delivered', 27, 22, '2025-06-15 14:33:21', NULL, NULL),
(285, 'Gracias.', 'incoming', 'sent', 27, 22, '2025-06-16 02:33:21', NULL, NULL),
(286, 'A disposición.', 'outgoing', 'sent', 27, 22, '2025-06-15 04:33:21', NULL, NULL),
(287, 'Hola, quería información.', 'incoming', 'read', 28, 23, '2025-01-31 04:35:11', NULL, NULL),
(288, 'Claro, ¿en qué puedo ayudarte?', 'outgoing', 'read', 28, 23, '2025-01-31 09:35:11', NULL, NULL),
(289, 'Estoy evaluando el proyecto.', 'incoming', 'read', 28, 23, '2025-01-31 12:35:11', NULL, NULL),
(290, 'Te envié toda la información por aquí.', 'outgoing', 'read', 28, 23, '2025-01-31 13:35:11', NULL, NULL),
(291, 'La recibí correctamente.', 'incoming', 'read', 28, 23, '2025-01-31 12:35:11', NULL, NULL),
(292, '¿Pudiste revisarla?', 'outgoing', 'read', 28, 23, '2025-01-31 19:35:11', NULL, NULL),
(293, 'Sí, pero voy a postergarlo.', 'incoming', 'read', 28, 23, '2025-02-01 04:35:11', NULL, NULL),
(294, 'Entendido.', 'outgoing', 'read', 28, 23, '2025-02-01 08:35:11', NULL, NULL),
(295, 'Gracias por el seguimiento.', 'incoming', 'read', 28, 23, '2025-02-01 12:35:11', NULL, NULL),
(296, 'No hay problema.', 'outgoing', 'read', 28, 23, '2025-01-31 22:35:11', NULL, NULL),
(297, 'Si retomo el proyecto te escribo.', 'incoming', 'read', 28, 23, '2025-02-02 06:35:11', NULL, NULL),
(298, 'Perfecto, cerramos la consulta por ahora.', 'outgoing', 'read', 28, 23, '2025-02-02 11:35:11', NULL, NULL),
(299, 'Hola, quería consultar precios.', 'incoming', 'read', 29, 24, '2025-03-15 22:37:02', NULL, NULL),
(300, 'Con gusto, te paso la información.', 'outgoing', 'read', 29, 24, '2025-03-16 01:37:02', NULL, NULL),
(301, 'Lo estoy comparando con otras opciones.', 'incoming', 'read', 29, 24, '2025-03-16 02:37:02', NULL, NULL),
(302, 'Perfecto, cualquier duda consultame.', 'outgoing', 'read', 29, 24, '2025-03-16 07:37:02', NULL, NULL),
(303, '¿Hay descuento adicional?', 'incoming', 'read', 29, 24, '2025-03-16 18:37:02', NULL, NULL),
(304, 'Por el momento no.', 'outgoing', 'read', 29, 24, '2025-03-16 23:37:02', NULL, NULL),
(305, 'Entiendo.', 'incoming', 'read', 29, 24, '2025-03-16 16:37:02', NULL, NULL),
(306, '¿Qué te pareció la propuesta?', 'outgoing', 'read', 29, 24, '2025-03-17 09:37:02', NULL, NULL),
(307, 'La verdad encontré algo más económico.', 'incoming', 'read', 29, 24, '2025-03-17 06:37:02', NULL, NULL),
(308, 'Comprendo.', 'outgoing', 'read', 29, 24, '2025-03-17 19:37:02', NULL, NULL),
(309, 'Creo que voy a elegir la otra opción.', 'incoming', 'read', 29, 24, '2025-03-17 14:37:02', NULL, NULL),
(310, 'No hay problema, gracias por tu tiempo.', 'outgoing', 'read', 29, 24, '2025-03-18 05:37:02', NULL, NULL),
(311, 'Quizás más adelante vuelva a consultar.', 'incoming', 'read', 29, 24, '2025-03-17 22:37:02', NULL, NULL),
(312, 'Te esperamos cuando quieras.', 'outgoing', 'read', 29, 24, '2025-03-17 13:37:02', NULL, NULL),
(313, 'Hola, vi la publicación y me interesa.', 'incoming', 'read', 30, 25, '2025-04-30 16:38:53', NULL, NULL),
(314, '¡Hola! Gracias por escribirnos.', 'outgoing', 'read', 30, 25, '2025-04-30 20:38:53', NULL, NULL),
(315, '¿Podrías contarme un poco más?', 'incoming', 'read', 30, 25, '2025-04-30 20:38:53', NULL, NULL),
(316, 'Claro, te explico las características.', 'outgoing', 'read', 30, 25, '2025-05-01 07:38:53', NULL, NULL),
(317, '¿Cuál sería el precio final?', 'incoming', 'read', 30, 25, '2025-05-01 00:38:53', NULL, NULL),
(318, 'Tenemos una promoción vigente esta semana.', 'outgoing', 'read', 30, 25, '2025-05-01 12:38:53', NULL, NULL),
(319, 'Perfecto, ¿aceptan transferencia?', 'incoming', 'read', 30, 25, '2025-05-01 04:38:53', NULL, NULL),
(320, 'Sí, transferencia, débito y crédito.', 'outgoing', 'read', 30, 25, '2025-05-02 03:38:53', NULL, NULL),
(321, '¿Tienen stock disponible?', 'incoming', 'read', 30, 25, '2025-05-02 00:38:53', NULL, NULL),
(322, 'Sí, entrega inmediata.', 'outgoing', 'read', 30, 25, '2025-05-01 19:38:53', NULL, NULL),
(323, 'Excelente, me interesa avanzar.', 'incoming', 'read', 30, 25, '2025-05-02 18:38:53', NULL, NULL),
(324, 'Te envío los datos de pago.', 'outgoing', 'read', 30, 25, '2025-05-02 12:38:53', NULL, NULL),
(325, 'Listo, ya realicé la transferencia.', 'incoming', 'read', 30, 25, '2025-05-01 16:38:53', NULL, NULL),
(326, 'Pago acreditado correctamente.', 'outgoing', 'read', 30, 25, '2025-05-03 09:38:53', NULL, NULL),
(327, 'Muchas gracias por la atención.', 'incoming', 'read', 30, 25, '2025-05-03 00:38:53', NULL, NULL),
(328, 'Gracias a vos. La venta quedó confirmada.', 'outgoing', 'read', 30, 25, '2025-05-02 13:38:53', NULL, NULL),
(329, 'Hola, vi la publicación y me interesa.', 'incoming', 'read', 31, 26, '2025-06-14 10:40:44', NULL, NULL),
(330, '¡Hola! Gracias por escribirnos.', 'outgoing', 'read', 31, 26, '2025-06-14 12:40:44', NULL, NULL),
(331, '¿Podrías contarme un poco más?', 'incoming', 'read', 31, 26, '2025-06-14 18:40:44', NULL, NULL),
(332, 'Claro, te explico las características.', 'outgoing', 'read', 31, 26, '2025-06-14 19:40:44', NULL, NULL),
(333, '¿Cuál sería el precio final?', 'incoming', 'read', 31, 26, '2025-06-15 02:40:44', NULL, NULL),
(334, 'Tenemos una promoción vigente esta semana.', 'outgoing', 'read', 31, 26, '2025-06-15 11:40:44', NULL, NULL),
(335, 'Perfecto, ¿aceptan transferencia?', 'incoming', 'read', 31, 26, '2025-06-15 10:40:44', NULL, NULL),
(336, 'Sí, transferencia, débito y crédito.', 'outgoing', 'read', 31, 26, '2025-06-15 00:40:44', NULL, NULL),
(337, '¿Tienen stock disponible?', 'incoming', 'read', 31, 26, '2025-06-15 10:40:44', NULL, NULL),
(338, 'Sí, entrega inmediata.', 'outgoing', 'read', 31, 26, '2025-06-16 07:40:44', NULL, NULL),
(339, 'Excelente, me interesa avanzar.', 'incoming', 'read', 31, 26, '2025-06-15 06:40:44', NULL, NULL),
(340, 'Te envío los datos de pago.', 'outgoing', 'read', 31, 26, '2025-06-16 06:40:44', NULL, NULL),
(341, 'Listo, ya realicé la transferencia.', 'incoming', 'read', 31, 26, '2025-06-15 10:40:44', NULL, NULL),
(342, 'Pago acreditado correctamente.', 'outgoing', 'read', 31, 26, '2025-06-16 14:40:44', NULL, NULL),
(343, 'Muchas gracias por la atención.', 'incoming', 'read', 31, 26, '2025-06-16 18:40:44', NULL, NULL),
(344, 'Gracias a vos. La venta quedó confirmada.', 'outgoing', 'read', 31, 26, '2025-06-17 13:40:44', NULL, NULL),
(345, 'Hola, me interesa el producto.', 'incoming', 'read', 32, 27, '2025-01-31 04:42:34', NULL, NULL),
(346, 'Excelente, contame qué necesitás.', 'outgoing', 'read', 32, 27, '2025-01-31 07:42:34', NULL, NULL),
(347, 'Estoy comparando alternativas.', 'incoming', 'read', 32, 27, '2025-01-31 10:42:34', NULL, NULL),
(348, 'Te puedo explicar las ventajas.', 'outgoing', 'read', 32, 27, '2025-01-31 13:42:34', NULL, NULL),
(349, 'Perfecto.', 'incoming', 'read', 32, 27, '2025-01-31 20:42:34', NULL, NULL),
(350, '¿Tenés alguna duda puntual?', 'outgoing', 'read', 32, 27, '2025-01-31 14:42:34', NULL, NULL),
(351, 'Quisiera saber formas de pago.', 'incoming', 'read', 32, 27, '2025-01-31 22:42:34', NULL, NULL),
(352, 'Tenemos varias opciones.', 'outgoing', 'read', 32, 27, '2025-02-01 08:42:34', NULL, NULL),
(353, 'Bien, voy a analizarlo.', 'incoming', 'delivered', 32, 27, '2025-01-31 20:42:34', NULL, NULL),
(354, 'Sin problema.', 'outgoing', 'delivered', 32, 27, '2025-02-01 07:42:34', NULL, NULL),
(355, 'Mañana te confirmo.', 'incoming', 'sent', 32, 27, '2025-02-01 10:42:34', NULL, NULL),
(356, 'Quedo atento a tu respuesta.', 'outgoing', 'sent', 32, 27, '2025-02-02 11:42:34', NULL, NULL),
(357, 'Hola, me interesa el producto.', 'incoming', 'read', 33, 28, '2025-03-16 22:44:25', NULL, NULL),
(358, 'Excelente, contame qué necesitás.', 'outgoing', 'read', 33, 28, '2025-03-17 01:44:25', NULL, NULL),
(359, 'Estoy comparando alternativas.', 'incoming', 'read', 33, 28, '2025-03-17 02:44:25', NULL, NULL),
(360, 'Te puedo explicar las ventajas.', 'outgoing', 'read', 33, 28, '2025-03-17 07:44:25', NULL, NULL),
(361, 'Perfecto.', 'incoming', 'read', 33, 28, '2025-03-17 18:44:25', NULL, NULL),
(362, '¿Tenés alguna duda puntual?', 'outgoing', 'read', 33, 28, '2025-03-17 13:44:25', NULL, NULL),
(363, 'Quisiera saber formas de pago.', 'incoming', 'read', 33, 28, '2025-03-17 10:44:25', NULL, NULL),
(364, 'Tenemos varias opciones.', 'outgoing', 'read', 33, 28, '2025-03-17 12:44:25', NULL, NULL),
(365, 'Bien, voy a analizarlo.', 'incoming', 'delivered', 33, 28, '2025-03-17 22:44:25', NULL, NULL),
(366, 'Sin problema.', 'outgoing', 'delivered', 33, 28, '2025-03-17 16:44:25', NULL, NULL),
(367, 'Mañana te confirmo.', 'incoming', 'sent', 33, 28, '2025-03-19 00:44:25', NULL, NULL),
(368, 'Quedo atento a tu respuesta.', 'outgoing', 'sent', 33, 28, '2025-03-17 20:44:25', NULL, NULL),
(369, 'Hola.', 'incoming', 'read', 34, 29, '2025-05-01 16:46:16', NULL, NULL),
(370, 'Hola, gracias por contactarnos.', 'outgoing', 'read', 34, 29, '2025-05-01 19:46:16', NULL, NULL),
(371, 'Vi una publicación de ustedes.', 'incoming', 'read', 34, 29, '2025-05-01 22:46:16', NULL, NULL),
(372, 'Correcto, ¿qué información necesitás?', 'outgoing', 'read', 34, 29, '2025-05-01 22:46:16', NULL, NULL),
(373, 'Todavía estoy averiguando.', 'incoming', 'read', 34, 29, '2025-05-02 04:46:16', NULL, NULL),
(374, 'Perfecto, puedo ayudarte cuando quieras.', 'outgoing', 'read', 34, 29, '2025-05-02 07:46:16', NULL, NULL),
(375, '¿Me podrías pasar catálogo?', 'incoming', 'delivered', 34, 29, '2025-05-02 10:46:16', NULL, NULL),
(376, 'Claro, te lo envío.', 'outgoing', 'delivered', 34, 29, '2025-05-03 03:46:16', NULL, NULL),
(377, 'Gracias.', 'incoming', 'sent', 34, 29, '2025-05-02 16:46:16', NULL, NULL),
(378, 'A disposición.', 'outgoing', 'sent', 34, 29, '2025-05-03 13:46:16', NULL, NULL),
(379, 'Hola.', 'incoming', 'read', 35, 30, '2025-06-15 10:48:07', NULL, NULL),
(380, 'Hola, gracias por contactarnos.', 'outgoing', 'read', 35, 30, '2025-06-15 13:48:07', NULL, NULL),
(381, 'Vi una publicación de ustedes.', 'incoming', 'read', 35, 30, '2025-06-15 20:48:07', NULL, NULL),
(382, 'Correcto, ¿qué información necesitás?', 'outgoing', 'read', 35, 30, '2025-06-15 16:48:07', NULL, NULL),
(383, 'Todavía estoy averiguando.', 'incoming', 'read', 35, 30, '2025-06-15 22:48:07', NULL, NULL),
(384, 'Perfecto, puedo ayudarte cuando quieras.', 'outgoing', 'read', 35, 30, '2025-06-16 06:48:07', NULL, NULL),
(385, '¿Me podrías pasar catálogo?', 'incoming', 'delivered', 35, 30, '2025-06-15 22:48:07', NULL, NULL),
(386, 'Claro, te lo envío.', 'outgoing', 'delivered', 35, 30, '2025-06-16 00:48:07', NULL, NULL),
(387, 'Gracias.', 'incoming', 'sent', 35, 30, '2025-06-16 02:48:07', NULL, NULL),
(388, 'A disposición.', 'outgoing', 'sent', 35, 30, '2025-06-16 22:48:07', NULL, NULL),
(389, 'Hola, quería consultar precios.', 'incoming', 'read', 36, 31, '2025-02-01 04:49:57', NULL, NULL),
(390, 'Con gusto, te paso la información.', 'outgoing', 'read', 36, 31, '2025-02-01 08:49:57', NULL, NULL),
(391, 'Lo estoy comparando con otras opciones.', 'incoming', 'read', 36, 31, '2025-02-01 08:49:57', NULL, NULL),
(392, 'Perfecto, cualquier duda consultame.', 'outgoing', 'read', 36, 31, '2025-02-01 19:49:57', NULL, NULL),
(393, '¿Hay descuento adicional?', 'incoming', 'read', 36, 31, '2025-02-02 00:49:57', NULL, NULL),
(394, 'Por el momento no.', 'outgoing', 'read', 36, 31, '2025-02-01 19:49:57', NULL, NULL),
(395, 'Entiendo.', 'incoming', 'read', 36, 31, '2025-02-01 22:49:57', NULL, NULL),
(396, '¿Qué te pareció la propuesta?', 'outgoing', 'read', 36, 31, '2025-02-02 15:49:57', NULL, NULL),
(397, 'La verdad encontré algo más económico.', 'incoming', 'read', 36, 31, '2025-02-02 12:49:57', NULL, NULL),
(398, 'Comprendo.', 'outgoing', 'read', 36, 31, '2025-02-03 01:49:57', NULL, NULL),
(399, 'Creo que voy a elegir la otra opción.', 'incoming', 'read', 36, 31, '2025-02-02 20:49:57', NULL, NULL),
(400, 'No hay problema, gracias por tu tiempo.', 'outgoing', 'read', 36, 31, '2025-02-03 11:49:57', NULL, NULL),
(401, 'Quizás más adelante vuelva a consultar.', 'incoming', 'read', 36, 31, '2025-02-02 04:49:57', NULL, NULL),
(402, 'Te esperamos cuando quieras.', 'outgoing', 'read', 36, 31, '2025-02-03 21:49:57', NULL, NULL),
(403, 'Hola, quería consultar precios.', 'incoming', 'read', 37, 32, '2025-03-16 22:51:48', NULL, NULL),
(404, 'Con gusto, te paso la información.', 'outgoing', 'read', 37, 32, '2025-03-17 03:51:48', NULL, NULL),
(405, 'Lo estoy comparando con otras opciones.', 'incoming', 'read', 37, 32, '2025-03-17 06:51:48', NULL, NULL),
(406, 'Perfecto, cualquier duda consultame.', 'outgoing', 'read', 37, 32, '2025-03-17 04:51:48', NULL, NULL),
(407, '¿Hay descuento adicional?', 'incoming', 'read', 37, 32, '2025-03-17 14:51:48', NULL, NULL),
(408, 'Por el momento no.', 'outgoing', 'read', 37, 32, '2025-03-17 18:51:48', NULL, NULL),
(409, 'Entiendo.', 'incoming', 'read', 37, 32, '2025-03-17 22:51:48', NULL, NULL),
(410, '¿Qué te pareció la propuesta?', 'outgoing', 'read', 37, 32, '2025-03-17 12:51:48', NULL, NULL),
(411, 'La verdad encontré algo más económico.', 'incoming', 'read', 37, 32, '2025-03-17 14:51:48', NULL, NULL),
(412, 'Comprendo.', 'outgoing', 'read', 37, 32, '2025-03-18 01:51:48', NULL, NULL),
(413, 'Creo que voy a elegir la otra opción.', 'incoming', 'read', 37, 32, '2025-03-17 18:51:48', NULL, NULL),
(414, 'No hay problema, gracias por tu tiempo.', 'outgoing', 'read', 37, 32, '2025-03-19 05:51:48', NULL, NULL),
(415, 'Quizás más adelante vuelva a consultar.', 'incoming', 'read', 37, 32, '2025-03-18 10:51:48', NULL, NULL),
(416, 'Te esperamos cuando quieras.', 'outgoing', 'read', 37, 32, '2025-03-18 13:51:48', NULL, NULL),
(417, 'Hola, quería consultar precios.', 'incoming', 'read', 38, 33, '2025-05-01 16:53:39', NULL, NULL),
(418, 'Con gusto, te paso la información.', 'outgoing', 'read', 38, 33, '2025-05-01 21:53:39', NULL, NULL),
(419, 'Lo estoy comparando con otras opciones.', 'incoming', 'read', 38, 33, '2025-05-01 22:53:39', NULL, NULL),
(420, 'Perfecto, cualquier duda consultame.', 'outgoing', 'read', 38, 33, '2025-05-01 22:53:39', NULL, NULL),
(421, '¿Hay descuento adicional?', 'incoming', 'read', 38, 33, '2025-05-02 08:53:39', NULL, NULL),
(422, 'Por el momento no.', 'outgoing', 'read', 38, 33, '2025-05-02 02:53:39', NULL, NULL),
(423, 'Entiendo.', 'incoming', 'read', 38, 33, '2025-05-02 10:53:39', NULL, NULL),
(424, '¿Qué te pareció la propuesta?', 'outgoing', 'read', 38, 33, '2025-05-02 06:53:39', NULL, NULL),
(425, 'La verdad encontré algo más económico.', 'incoming', 'read', 38, 33, '2025-05-02 08:53:39', NULL, NULL),
(426, 'Comprendo.', 'outgoing', 'read', 38, 33, '2025-05-03 13:53:39', NULL, NULL),
(427, 'Creo que voy a elegir la otra opción.', 'incoming', 'read', 38, 33, '2025-05-02 12:53:39', NULL, NULL),
(428, 'No hay problema, gracias por tu tiempo.', 'outgoing', 'read', 38, 33, '2025-05-03 01:53:39', NULL, NULL),
(429, 'Quizás más adelante vuelva a consultar.', 'incoming', 'read', 38, 33, '2025-05-02 16:53:39', NULL, NULL),
(430, 'Te esperamos cuando quieras.', 'outgoing', 'read', 38, 33, '2025-05-04 09:53:39', NULL, NULL),
(431, 'Hola, quería información.', 'incoming', 'read', 39, 34, '2025-06-15 10:55:30', NULL, NULL),
(432, 'Claro, ¿en qué puedo ayudarte?', 'outgoing', 'read', 39, 34, '2025-06-15 15:55:30', NULL, NULL),
(433, 'Estoy evaluando el proyecto.', 'incoming', 'read', 39, 34, '2025-06-15 16:55:30', NULL, NULL),
(434, 'Te envié toda la información por aquí.', 'outgoing', 'read', 39, 34, '2025-06-15 22:55:30', NULL, NULL),
(435, 'La recibí correctamente.', 'incoming', 'read', 39, 34, '2025-06-15 18:55:30', NULL, NULL),
(436, '¿Pudiste revisarla?', 'outgoing', 'read', 39, 34, '2025-06-15 20:55:30', NULL, NULL),
(437, 'Sí, pero voy a postergarlo.', 'incoming', 'read', 39, 34, '2025-06-15 22:55:30', NULL, NULL),
(438, 'Entendido.', 'outgoing', 'read', 39, 34, '2025-06-16 07:55:30', NULL, NULL),
(439, 'Gracias por el seguimiento.', 'incoming', 'read', 39, 34, '2025-06-16 10:55:30', NULL, NULL),
(440, 'No hay problema.', 'outgoing', 'read', 39, 34, '2025-06-16 22:55:30', NULL, NULL),
(441, 'Si retomo el proyecto te escribo.', 'incoming', 'read', 39, 34, '2025-06-16 16:55:30', NULL, NULL),
(442, 'Perfecto, cerramos la consulta por ahora.', 'outgoing', 'read', 39, 34, '2025-06-16 19:55:30', NULL, NULL),
(443, 'Hola, vi la publicación y me interesa.', 'incoming', 'read', 40, 35, '2025-02-01 04:57:20', NULL, NULL),
(444, '¡Hola! Gracias por escribirnos.', 'outgoing', 'read', 40, 35, '2025-02-01 09:57:20', NULL, NULL),
(445, '¿Podrías contarme un poco más?', 'incoming', 'read', 40, 35, '2025-02-01 12:57:20', NULL, NULL),
(446, 'Claro, te explico las características.', 'outgoing', 'read', 40, 35, '2025-02-01 13:57:20', NULL, NULL),
(447, '¿Cuál sería el precio final?', 'incoming', 'read', 40, 35, '2025-02-01 20:57:20', NULL, NULL),
(448, 'Tenemos una promoción vigente esta semana.', 'outgoing', 'read', 40, 35, '2025-02-02 00:57:20', NULL, NULL),
(449, 'Perfecto, ¿aceptan transferencia?', 'incoming', 'read', 40, 35, '2025-02-02 10:57:20', NULL, NULL),
(450, 'Sí, transferencia, débito y crédito.', 'outgoing', 'read', 40, 35, '2025-02-02 01:57:20', NULL, NULL),
(451, '¿Tienen stock disponible?', 'incoming', 'read', 40, 35, '2025-02-01 20:57:20', NULL, NULL),
(452, 'Sí, entrega inmediata.', 'outgoing', 'read', 40, 35, '2025-02-01 22:57:20', NULL, NULL),
(453, 'Excelente, me interesa avanzar.', 'incoming', 'read', 40, 35, '2025-02-02 10:57:20', NULL, NULL),
(454, 'Te envío los datos de pago.', 'outgoing', 'read', 40, 35, '2025-02-02 02:57:20', NULL, NULL),
(455, 'Listo, ya realicé la transferencia.', 'incoming', 'read', 40, 35, '2025-02-03 04:57:20', NULL, NULL),
(456, 'Pago acreditado correctamente.', 'outgoing', 'read', 40, 35, '2025-02-03 08:57:20', NULL, NULL),
(457, 'Muchas gracias por la atención.', 'incoming', 'read', 40, 35, '2025-02-02 08:57:20', NULL, NULL),
(458, 'Gracias a vos. La venta quedó confirmada.', 'outgoing', 'read', 40, 35, '2025-02-04 07:57:20', NULL, NULL),
(459, 'Hola, vi la publicación y me interesa.', 'incoming', 'read', 41, 36, '2025-03-16 22:59:11', NULL, NULL),
(460, '¡Hola! Gracias por escribirnos.', 'outgoing', 'read', 41, 36, '2025-03-17 01:59:11', NULL, NULL),
(461, '¿Podrías contarme un poco más?', 'incoming', 'read', 41, 36, '2025-03-17 08:59:11', NULL, NULL),
(462, 'Claro, te explico las características.', 'outgoing', 'read', 41, 36, '2025-03-17 10:59:11', NULL, NULL),
(463, '¿Cuál sería el precio final?', 'incoming', 'read', 41, 36, '2025-03-17 14:59:11', NULL, NULL),
(464, 'Tenemos una promoción vigente esta semana.', 'outgoing', 'read', 41, 36, '2025-03-17 23:59:11', NULL, NULL),
(465, 'Perfecto, ¿aceptan transferencia?', 'incoming', 'read', 41, 36, '2025-03-17 10:59:11', NULL, NULL),
(466, 'Sí, transferencia, débito y crédito.', 'outgoing', 'read', 41, 36, '2025-03-17 19:59:11', NULL, NULL),
(467, '¿Tienen stock disponible?', 'incoming', 'read', 41, 36, '2025-03-18 06:59:11', NULL, NULL),
(468, 'Sí, entrega inmediata.', 'outgoing', 'read', 41, 36, '2025-03-18 01:59:11', NULL, NULL),
(469, 'Excelente, me interesa avanzar.', 'incoming', 'read', 41, 36, '2025-03-17 18:59:11', NULL, NULL),
(470, 'Te envío los datos de pago.', 'outgoing', 'read', 41, 36, '2025-03-18 07:59:11', NULL, NULL),
(471, 'Listo, ya realicé la transferencia.', 'incoming', 'read', 41, 36, '2025-03-17 22:59:11', NULL, NULL),
(472, 'Pago acreditado correctamente.', 'outgoing', 'read', 41, 36, '2025-03-18 00:59:11', NULL, NULL),
(473, 'Muchas gracias por la atención.', 'incoming', 'read', 41, 36, '2025-03-18 16:59:11', NULL, NULL),
(474, 'Gracias a vos. La venta quedó confirmada.', 'outgoing', 'read', 41, 36, '2025-03-20 01:59:11', NULL, NULL),
(475, 'Hola, vi la publicación y me interesa.', 'incoming', 'read', 42, 37, '2025-05-01 17:01:02', NULL, NULL),
(476, '¡Hola! Gracias por escribirnos.', 'outgoing', 'read', 42, 37, '2025-05-01 20:01:02', NULL, NULL),
(477, '¿Podrías contarme un poco más?', 'incoming', 'read', 42, 37, '2025-05-01 21:01:02', NULL, NULL),
(478, 'Claro, te explico las características.', 'outgoing', 'read', 42, 37, '2025-05-02 05:01:02', NULL, NULL),
(479, '¿Cuál sería el precio final?', 'incoming', 'read', 42, 37, '2025-05-02 13:01:02', NULL, NULL),
(480, 'Tenemos una promoción vigente esta semana.', 'outgoing', 'read', 42, 37, '2025-05-02 08:01:02', NULL, NULL),
(481, 'Perfecto, ¿aceptan transferencia?', 'incoming', 'read', 42, 37, '2025-05-02 11:01:02', NULL, NULL),
(482, 'Sí, transferencia, débito y crédito.', 'outgoing', 'read', 42, 37, '2025-05-02 07:01:02', NULL, NULL),
(483, '¿Tienen stock disponible?', 'incoming', 'read', 42, 37, '2025-05-03 01:01:02', NULL, NULL),
(484, 'Sí, entrega inmediata.', 'outgoing', 'read', 42, 37, '2025-05-02 11:01:02', NULL, NULL),
(485, 'Excelente, me interesa avanzar.', 'incoming', 'read', 42, 37, '2025-05-03 19:01:02', NULL, NULL),
(486, 'Te envío los datos de pago.', 'outgoing', 'read', 42, 37, '2025-05-04 00:01:02', NULL, NULL),
(487, 'Listo, ya realicé la transferencia.', 'incoming', 'read', 42, 37, '2025-05-02 17:01:02', NULL, NULL),
(488, 'Pago acreditado correctamente.', 'outgoing', 'read', 42, 37, '2025-05-02 19:01:02', NULL, NULL),
(489, 'Muchas gracias por la atención.', 'incoming', 'read', 42, 37, '2025-05-04 15:01:02', NULL, NULL),
(490, 'Gracias a vos. La venta quedó confirmada.', 'outgoing', 'read', 42, 37, '2025-05-03 14:01:02', NULL, NULL),
(491, 'Hola, me interesa el producto.', 'incoming', 'read', 43, 38, '2025-06-15 11:02:53', NULL, NULL),
(492, 'Excelente, contame qué necesitás.', 'outgoing', 'read', 43, 38, '2025-06-15 16:02:53', NULL, NULL),
(493, 'Estoy comparando alternativas.', 'incoming', 'read', 43, 38, '2025-06-15 15:02:53', NULL, NULL),
(494, 'Te puedo explicar las ventajas.', 'outgoing', 'read', 43, 38, '2025-06-15 17:02:53', NULL, NULL),
(495, 'Perfecto.', 'incoming', 'read', 43, 38, '2025-06-16 03:02:53', NULL, NULL),
(496, '¿Tenés alguna duda puntual?', 'outgoing', 'read', 43, 38, '2025-06-16 02:02:53', NULL, NULL),
(497, 'Quisiera saber formas de pago.', 'incoming', 'read', 43, 38, '2025-06-16 17:02:53', NULL, NULL),
(498, 'Tenemos varias opciones.', 'outgoing', 'read', 43, 38, '2025-06-16 08:02:53', NULL, NULL);
INSERT INTO `messages` (`id`, `content`, `direction`, `status`, `customer_id`, `conversation_id`, `created_at`, `delivered_at`, `read_at`) VALUES
(499, 'Bien, voy a analizarlo.', 'incoming', 'delivered', 43, 38, '2025-06-17 03:02:53', NULL, NULL),
(500, 'Sin problema.', 'outgoing', 'delivered', 43, 38, '2025-06-16 23:02:53', NULL, NULL),
(501, 'Mañana te confirmo.', 'incoming', 'sent', 43, 38, '2025-06-17 03:02:53', NULL, NULL),
(502, 'Quedo atento a tu respuesta.', 'outgoing', 'sent', 43, 38, '2025-06-16 20:02:53', NULL, NULL),
(503, 'Hola, me interesa el producto.', 'incoming', 'read', 44, 39, '2025-02-01 05:04:43', NULL, NULL),
(504, 'Excelente, contame qué necesitás.', 'outgoing', 'read', 44, 39, '2025-02-01 08:04:43', NULL, NULL),
(505, 'Estoy comparando alternativas.', 'incoming', 'read', 44, 39, '2025-02-01 15:04:43', NULL, NULL),
(506, 'Te puedo explicar las ventajas.', 'outgoing', 'read', 44, 39, '2025-02-01 11:04:43', NULL, NULL),
(507, 'Perfecto.', 'incoming', 'read', 44, 39, '2025-02-01 13:04:43', NULL, NULL),
(508, '¿Tenés alguna duda puntual?', 'outgoing', 'read', 44, 39, '2025-02-02 06:04:43', NULL, NULL),
(509, 'Quisiera saber formas de pago.', 'incoming', 'read', 44, 39, '2025-02-02 11:04:43', NULL, NULL),
(510, 'Tenemos varias opciones.', 'outgoing', 'read', 44, 39, '2025-02-02 16:04:43', NULL, NULL),
(511, 'Bien, voy a analizarlo.', 'incoming', 'delivered', 44, 39, '2025-02-02 13:04:43', NULL, NULL),
(512, 'Sin problema.', 'outgoing', 'delivered', 44, 39, '2025-02-03 02:04:43', NULL, NULL),
(513, 'Mañana te confirmo.', 'incoming', 'sent', 44, 39, '2025-02-02 01:04:43', NULL, NULL),
(514, 'Quedo atento a tu respuesta.', 'outgoing', 'sent', 44, 39, '2025-02-03 12:04:43', NULL, NULL),
(515, 'Hola.', 'incoming', 'read', 45, 40, '2025-03-16 23:06:34', NULL, NULL),
(516, 'Hola, gracias por contactarnos.', 'outgoing', 'read', 45, 40, '2025-03-17 02:06:34', NULL, NULL),
(517, 'Vi una publicación de ustedes.', 'incoming', 'read', 45, 40, '2025-03-17 03:06:34', NULL, NULL),
(518, 'Correcto, ¿qué información necesitás?', 'outgoing', 'read', 45, 40, '2025-03-17 05:06:34', NULL, NULL),
(519, 'Todavía estoy averiguando.', 'incoming', 'read', 45, 40, '2025-03-17 19:06:34', NULL, NULL),
(520, 'Perfecto, puedo ayudarte cuando quieras.', 'outgoing', 'read', 45, 40, '2025-03-18 00:06:34', NULL, NULL),
(521, '¿Me podrías pasar catálogo?', 'incoming', 'delivered', 45, 40, '2025-03-17 11:06:34', NULL, NULL),
(522, 'Claro, te lo envío.', 'outgoing', 'delivered', 45, 40, '2025-03-18 10:06:34', NULL, NULL),
(523, 'Gracias.', 'incoming', 'sent', 45, 40, '2025-03-18 07:06:34', NULL, NULL),
(524, 'A disposición.', 'outgoing', 'sent', 45, 40, '2025-03-18 20:06:34', NULL, NULL),
(525, 'Hola.', 'incoming', 'read', 46, 41, '2025-05-01 17:08:25', NULL, NULL),
(526, 'Hola, gracias por contactarnos.', 'outgoing', 'read', 46, 41, '2025-05-01 19:08:25', NULL, NULL),
(527, 'Vi una publicación de ustedes.', 'incoming', 'read', 46, 41, '2025-05-02 01:08:25', NULL, NULL),
(528, 'Correcto, ¿qué información necesitás?', 'outgoing', 'read', 46, 41, '2025-05-01 23:08:25', NULL, NULL),
(529, 'Todavía estoy averiguando.', 'incoming', 'read', 46, 41, '2025-05-02 01:08:25', NULL, NULL),
(530, 'Perfecto, puedo ayudarte cuando quieras.', 'outgoing', 'read', 46, 41, '2025-05-02 03:08:25', NULL, NULL),
(531, '¿Me podrías pasar catálogo?', 'incoming', 'delivered', 46, 41, '2025-05-02 17:08:25', NULL, NULL),
(532, 'Claro, te lo envío.', 'outgoing', 'delivered', 46, 41, '2025-05-02 21:08:25', NULL, NULL),
(533, 'Gracias.', 'incoming', 'sent', 46, 41, '2025-05-02 17:08:25', NULL, NULL),
(534, 'A disposición.', 'outgoing', 'sent', 46, 41, '2025-05-03 05:08:25', NULL, NULL),
(535, 'Hola, quería información.', 'incoming', 'read', 47, 42, '2025-06-15 11:10:16', NULL, NULL),
(536, 'Claro, ¿en qué puedo ayudarte?', 'outgoing', 'read', 47, 42, '2025-06-15 13:10:16', NULL, NULL),
(537, 'Estoy evaluando el proyecto.', 'incoming', 'read', 47, 42, '2025-06-15 15:10:16', NULL, NULL),
(538, 'Te envié toda la información por aquí.', 'outgoing', 'read', 47, 42, '2025-06-15 23:10:16', NULL, NULL),
(539, 'La recibí correctamente.', 'incoming', 'read', 47, 42, '2025-06-15 23:10:16', NULL, NULL),
(540, '¿Pudiste revisarla?', 'outgoing', 'read', 47, 42, '2025-06-16 12:10:16', NULL, NULL),
(541, 'Sí, pero voy a postergarlo.', 'incoming', 'read', 47, 42, '2025-06-16 05:10:16', NULL, NULL),
(542, 'Entendido.', 'outgoing', 'read', 47, 42, '2025-06-16 01:10:16', NULL, NULL),
(543, 'Gracias por el seguimiento.', 'incoming', 'read', 47, 42, '2025-06-17 03:10:16', NULL, NULL),
(544, 'No hay problema.', 'outgoing', 'read', 47, 42, '2025-06-17 08:10:16', NULL, NULL),
(545, 'Si retomo el proyecto te escribo.', 'incoming', 'read', 47, 42, '2025-06-16 07:10:16', NULL, NULL),
(546, 'Perfecto, cerramos la consulta por ahora.', 'outgoing', 'read', 47, 42, '2025-06-17 18:10:16', NULL, NULL),
(547, 'Hola, quería información.', 'incoming', 'read', 48, 43, '2025-02-01 05:12:06', NULL, NULL),
(548, 'Claro, ¿en qué puedo ayudarte?', 'outgoing', 'read', 48, 43, '2025-02-01 09:12:06', NULL, NULL),
(549, 'Estoy evaluando el proyecto.', 'incoming', 'read', 48, 43, '2025-02-01 13:12:06', NULL, NULL),
(550, 'Te envié toda la información por aquí.', 'outgoing', 'read', 48, 43, '2025-02-01 11:12:06', NULL, NULL),
(551, 'La recibí correctamente.', 'incoming', 'read', 48, 43, '2025-02-01 17:12:06', NULL, NULL),
(552, '¿Pudiste revisarla?', 'outgoing', 'read', 48, 43, '2025-02-02 01:12:06', NULL, NULL),
(553, 'Sí, pero voy a postergarlo.', 'incoming', 'read', 48, 43, '2025-02-02 11:12:06', NULL, NULL),
(554, 'Entendido.', 'outgoing', 'read', 48, 43, '2025-02-02 09:12:06', NULL, NULL),
(555, 'Gracias por el seguimiento.', 'incoming', 'read', 48, 43, '2025-02-02 13:12:06', NULL, NULL),
(556, 'No hay problema.', 'outgoing', 'read', 48, 43, '2025-02-02 08:12:06', NULL, NULL),
(557, 'Si retomo el proyecto te escribo.', 'incoming', 'read', 48, 43, '2025-02-02 21:12:06', NULL, NULL),
(558, 'Perfecto, cerramos la consulta por ahora.', 'outgoing', 'read', 48, 43, '2025-02-02 14:12:06', NULL, NULL),
(559, 'Hola, quería consultar precios.', 'incoming', 'read', 49, 44, '2025-03-16 23:13:57', NULL, NULL),
(560, 'Con gusto, te paso la información.', 'outgoing', 'read', 49, 44, '2025-03-17 02:13:57', NULL, NULL),
(561, 'Lo estoy comparando con otras opciones.', 'incoming', 'read', 49, 44, '2025-03-17 09:13:57', NULL, NULL),
(562, 'Perfecto, cualquier duda consultame.', 'outgoing', 'read', 49, 44, '2025-03-17 14:13:57', NULL, NULL),
(563, '¿Hay descuento adicional?', 'incoming', 'read', 49, 44, '2025-03-17 07:13:57', NULL, NULL),
(564, 'Por el momento no.', 'outgoing', 'read', 49, 44, '2025-03-18 00:13:57', NULL, NULL),
(565, 'Entiendo.', 'incoming', 'read', 49, 44, '2025-03-18 05:13:57', NULL, NULL),
(566, '¿Qué te pareció la propuesta?', 'outgoing', 'read', 49, 44, '2025-03-18 03:13:57', NULL, NULL),
(567, 'La verdad encontré algo más económico.', 'incoming', 'read', 49, 44, '2025-03-17 15:13:57', NULL, NULL),
(568, 'Comprendo.', 'outgoing', 'read', 49, 44, '2025-03-17 17:13:57', NULL, NULL),
(569, 'Creo que voy a elegir la otra opción.', 'incoming', 'read', 49, 44, '2025-03-18 05:13:57', NULL, NULL),
(570, 'No hay problema, gracias por tu tiempo.', 'outgoing', 'read', 49, 44, '2025-03-17 21:13:57', NULL, NULL),
(571, 'Quizás más adelante vuelva a consultar.', 'incoming', 'read', 49, 44, '2025-03-19 11:13:57', NULL, NULL),
(572, 'Te esperamos cuando quieras.', 'outgoing', 'read', 49, 44, '2025-03-19 16:13:57', NULL, NULL),
(573, 'Hola, vi la publicación y me interesa.', 'incoming', 'read', 50, 45, '2025-05-01 17:15:48', NULL, NULL),
(574, '¡Hola! Gracias por escribirnos.', 'outgoing', 'read', 50, 45, '2025-05-01 19:15:48', NULL, NULL),
(575, '¿Podrías contarme un poco más?', 'incoming', 'read', 50, 45, '2025-05-02 01:15:48', NULL, NULL),
(576, 'Claro, te explico las características.', 'outgoing', 'read', 50, 45, '2025-05-02 05:15:48', NULL, NULL),
(577, '¿Cuál sería el precio final?', 'incoming', 'read', 50, 45, '2025-05-02 09:15:48', NULL, NULL),
(578, 'Tenemos una promoción vigente esta semana.', 'outgoing', 'read', 50, 45, '2025-05-02 13:15:48', NULL, NULL),
(579, 'Perfecto, ¿aceptan transferencia?', 'incoming', 'read', 50, 45, '2025-05-02 23:15:48', NULL, NULL),
(580, 'Sí, transferencia, débito y crédito.', 'outgoing', 'read', 50, 45, '2025-05-02 14:15:48', NULL, NULL),
(581, '¿Tienen stock disponible?', 'incoming', 'read', 50, 45, '2025-05-02 09:15:48', NULL, NULL),
(582, 'Sí, entrega inmediata.', 'outgoing', 'read', 50, 45, '2025-05-02 11:15:48', NULL, NULL),
(583, 'Excelente, me interesa avanzar.', 'incoming', 'read', 50, 45, '2025-05-03 19:15:48', NULL, NULL),
(584, 'Te envío los datos de pago.', 'outgoing', 'read', 50, 45, '2025-05-03 02:15:48', NULL, NULL),
(585, 'Listo, ya realicé la transferencia.', 'incoming', 'read', 50, 45, '2025-05-02 17:15:48', NULL, NULL),
(586, 'Pago acreditado correctamente.', 'outgoing', 'read', 50, 45, '2025-05-02 19:15:48', NULL, NULL),
(587, 'Muchas gracias por la atención.', 'incoming', 'read', 50, 45, '2025-05-03 11:15:48', NULL, NULL),
(588, 'Gracias a vos. La venta quedó confirmada.', 'outgoing', 'read', 50, 45, '2025-05-04 20:15:48', NULL, NULL),
(589, 'Hola, me interesa el producto.', 'incoming', 'read', 51, 46, '2025-06-15 11:17:39', NULL, NULL),
(590, 'Excelente, contame qué necesitás.', 'outgoing', 'read', 51, 46, '2025-06-15 14:17:39', NULL, NULL),
(591, 'Estoy comparando alternativas.', 'incoming', 'read', 51, 46, '2025-06-15 15:17:39', NULL, NULL),
(592, 'Te puedo explicar las ventajas.', 'outgoing', 'read', 51, 46, '2025-06-15 17:17:39', NULL, NULL),
(593, 'Perfecto.', 'incoming', 'read', 51, 46, '2025-06-16 03:17:39', NULL, NULL),
(594, '¿Tenés alguna duda puntual?', 'outgoing', 'read', 51, 46, '2025-06-16 07:17:39', NULL, NULL),
(595, 'Quisiera saber formas de pago.', 'incoming', 'read', 51, 46, '2025-06-16 11:17:39', NULL, NULL),
(596, 'Tenemos varias opciones.', 'outgoing', 'read', 51, 46, '2025-06-16 01:17:39', NULL, NULL),
(597, 'Bien, voy a analizarlo.', 'incoming', 'delivered', 51, 46, '2025-06-16 03:17:39', NULL, NULL),
(598, 'Sin problema.', 'outgoing', 'delivered', 51, 46, '2025-06-16 23:17:39', NULL, NULL),
(599, 'Mañana te confirmo.', 'incoming', 'sent', 51, 46, '2025-06-16 07:17:39', NULL, NULL),
(600, 'Quedo atento a tu respuesta.', 'outgoing', 'sent', 51, 46, '2025-06-17 07:17:39', NULL, NULL),
(601, 'Hola, me interesa el producto.', 'incoming', 'read', 52, 47, '2025-02-01 05:19:29', NULL, NULL),
(602, 'Excelente, contame qué necesitás.', 'outgoing', 'read', 52, 47, '2025-02-01 09:19:29', NULL, NULL),
(603, 'Estoy comparando alternativas.', 'incoming', 'read', 52, 47, '2025-02-01 13:19:29', NULL, NULL),
(604, 'Te puedo explicar las ventajas.', 'outgoing', 'read', 52, 47, '2025-02-01 20:19:29', NULL, NULL),
(605, 'Perfecto.', 'incoming', 'read', 52, 47, '2025-02-01 13:19:29', NULL, NULL),
(606, '¿Tenés alguna duda puntual?', 'outgoing', 'read', 52, 47, '2025-02-01 20:19:29', NULL, NULL),
(607, 'Quisiera saber formas de pago.', 'incoming', 'read', 52, 47, '2025-02-02 05:19:29', NULL, NULL),
(608, 'Tenemos varias opciones.', 'outgoing', 'read', 52, 47, '2025-02-02 16:19:29', NULL, NULL),
(609, 'Bien, voy a analizarlo.', 'incoming', 'delivered', 52, 47, '2025-02-02 13:19:29', NULL, NULL),
(610, 'Sin problema.', 'outgoing', 'delivered', 52, 47, '2025-02-02 08:19:29', NULL, NULL),
(611, 'Mañana te confirmo.', 'incoming', 'sent', 52, 47, '2025-02-02 01:19:29', NULL, NULL),
(612, 'Quedo atento a tu respuesta.', 'outgoing', 'sent', 52, 47, '2025-02-03 12:19:29', NULL, NULL),
(613, 'Hola.', 'incoming', 'read', 53, 48, '2025-03-16 23:21:20', NULL, NULL),
(614, 'Hola, gracias por contactarnos.', 'outgoing', 'read', 53, 48, '2025-03-17 03:21:20', NULL, NULL),
(615, 'Vi una publicación de ustedes.', 'incoming', 'read', 53, 48, '2025-03-17 03:21:20', NULL, NULL),
(616, 'Correcto, ¿qué información necesitás?', 'outgoing', 'read', 53, 48, '2025-03-17 05:21:20', NULL, NULL),
(617, 'Todavía estoy averiguando.', 'incoming', 'read', 53, 48, '2025-03-17 07:21:20', NULL, NULL),
(618, 'Perfecto, puedo ayudarte cuando quieras.', 'outgoing', 'read', 53, 48, '2025-03-18 00:21:20', NULL, NULL),
(619, '¿Me podrías pasar catálogo?', 'incoming', 'delivered', 53, 48, '2025-03-18 05:21:20', NULL, NULL),
(620, 'Claro, te lo envío.', 'outgoing', 'delivered', 53, 48, '2025-03-17 13:21:20', NULL, NULL),
(621, 'Gracias.', 'incoming', 'sent', 53, 48, '2025-03-18 15:21:20', NULL, NULL),
(622, 'A disposición.', 'outgoing', 'sent', 53, 48, '2025-03-17 17:21:20', NULL, NULL),
(623, 'Hola.', 'incoming', 'read', 54, 49, '2025-05-01 17:23:11', NULL, NULL),
(624, 'Hola, gracias por contactarnos.', 'outgoing', 'read', 54, 49, '2025-05-01 22:23:11', NULL, NULL),
(625, 'Vi una publicación de ustedes.', 'incoming', 'read', 54, 49, '2025-05-01 21:23:11', NULL, NULL),
(626, 'Correcto, ¿qué información necesitás?', 'outgoing', 'read', 54, 49, '2025-05-02 08:23:11', NULL, NULL),
(627, 'Todavía estoy averiguando.', 'incoming', 'read', 54, 49, '2025-05-02 13:23:11', NULL, NULL),
(628, 'Perfecto, puedo ayudarte cuando quieras.', 'outgoing', 'read', 54, 49, '2025-05-02 18:23:11', NULL, NULL),
(629, '¿Me podrías pasar catálogo?', 'incoming', 'delivered', 54, 49, '2025-05-02 23:23:11', NULL, NULL),
(630, 'Claro, te lo envío.', 'outgoing', 'delivered', 54, 49, '2025-05-02 14:23:11', NULL, NULL),
(631, 'Gracias.', 'incoming', 'sent', 54, 49, '2025-05-03 01:23:11', NULL, NULL),
(632, 'A disposición.', 'outgoing', 'sent', 54, 49, '2025-05-02 11:23:11', NULL, NULL),
(633, 'Hola, quería información.', 'incoming', 'read', 55, 50, '2025-06-15 11:25:01', NULL, NULL),
(634, 'Claro, ¿en qué puedo ayudarte?', 'outgoing', 'read', 55, 50, '2025-06-15 15:25:01', NULL, NULL),
(635, 'Estoy evaluando el proyecto.', 'incoming', 'read', 55, 50, '2025-06-15 17:25:01', NULL, NULL),
(636, 'Te envié toda la información por aquí.', 'outgoing', 'read', 55, 50, '2025-06-16 02:25:01', NULL, NULL),
(637, 'La recibí correctamente.', 'incoming', 'read', 55, 50, '2025-06-15 19:25:01', NULL, NULL),
(638, '¿Pudiste revisarla?', 'outgoing', 'read', 55, 50, '2025-06-16 02:25:01', NULL, NULL),
(639, 'Sí, pero voy a postergarlo.', 'incoming', 'read', 55, 50, '2025-06-15 23:25:01', NULL, NULL),
(640, 'Entendido.', 'outgoing', 'read', 55, 50, '2025-06-16 22:25:01', NULL, NULL),
(641, 'Gracias por el seguimiento.', 'incoming', 'read', 55, 50, '2025-06-16 03:25:01', NULL, NULL),
(642, 'No hay problema.', 'outgoing', 'read', 55, 50, '2025-06-17 08:25:01', NULL, NULL),
(643, 'Si retomo el proyecto te escribo.', 'incoming', 'read', 55, 50, '2025-06-17 13:25:01', NULL, NULL),
(644, 'Perfecto, cerramos la consulta por ahora.', 'outgoing', 'read', 55, 50, '2025-06-16 20:25:01', NULL, NULL),
(645, 'Hola, quería información.', 'incoming', 'read', 56, 51, '2025-02-01 05:26:52', NULL, NULL),
(646, 'Claro, ¿en qué puedo ayudarte?', 'outgoing', 'read', 56, 51, '2025-02-01 08:26:52', NULL, NULL),
(647, 'Estoy evaluando el proyecto.', 'incoming', 'read', 56, 51, '2025-02-01 11:26:52', NULL, NULL),
(648, 'Te envié toda la información por aquí.', 'outgoing', 'read', 56, 51, '2025-02-01 17:26:52', NULL, NULL),
(649, 'La recibí correctamente.', 'incoming', 'read', 56, 51, '2025-02-01 21:26:52', NULL, NULL),
(650, '¿Pudiste revisarla?', 'outgoing', 'read', 56, 51, '2025-02-01 20:26:52', NULL, NULL),
(651, 'Sí, pero voy a postergarlo.', 'incoming', 'read', 56, 51, '2025-02-02 05:26:52', NULL, NULL),
(652, 'Entendido.', 'outgoing', 'read', 56, 51, '2025-02-02 02:26:52', NULL, NULL),
(653, 'Gracias por el seguimiento.', 'incoming', 'read', 56, 51, '2025-02-02 21:26:52', NULL, NULL),
(654, 'No hay problema.', 'outgoing', 'read', 56, 51, '2025-02-02 08:26:52', NULL, NULL),
(655, 'Si retomo el proyecto te escribo.', 'incoming', 'read', 56, 51, '2025-02-02 21:26:52', NULL, NULL),
(656, 'Perfecto, cerramos la consulta por ahora.', 'outgoing', 'read', 56, 51, '2025-02-03 12:26:52', NULL, NULL),
(657, 'Hola, quería información.', 'incoming', 'read', 57, 52, '2025-03-16 23:28:43', NULL, NULL),
(658, 'Claro, ¿en qué puedo ayudarte?', 'outgoing', 'read', 57, 52, '2025-03-17 02:28:43', NULL, NULL),
(659, 'Estoy evaluando el proyecto.', 'incoming', 'read', 57, 52, '2025-03-17 03:28:43', NULL, NULL),
(660, 'Te envié toda la información por aquí.', 'outgoing', 'read', 57, 52, '2025-03-17 11:28:43', NULL, NULL),
(661, 'La recibí correctamente.', 'incoming', 'read', 57, 52, '2025-03-17 19:28:43', NULL, NULL),
(662, '¿Pudiste revisarla?', 'outgoing', 'read', 57, 52, '2025-03-17 09:28:43', NULL, NULL),
(663, 'Sí, pero voy a postergarlo.', 'incoming', 'read', 57, 52, '2025-03-17 11:28:43', NULL, NULL),
(664, 'Entendido.', 'outgoing', 'read', 57, 52, '2025-03-18 03:28:43', NULL, NULL),
(665, 'Gracias por el seguimiento.', 'incoming', 'read', 57, 52, '2025-03-17 23:28:43', NULL, NULL),
(666, 'No hay problema.', 'outgoing', 'read', 57, 52, '2025-03-17 17:28:43', NULL, NULL),
(667, 'Si retomo el proyecto te escribo.', 'incoming', 'read', 57, 52, '2025-03-17 19:28:43', NULL, NULL),
(668, 'Perfecto, cerramos la consulta por ahora.', 'outgoing', 'read', 57, 52, '2025-03-17 21:28:43', NULL, NULL),
(669, 'Hola, quería consultar precios.', 'incoming', 'read', 58, 53, '2025-05-01 17:30:34', NULL, NULL),
(670, 'Con gusto, te paso la información.', 'outgoing', 'read', 58, 53, '2025-05-01 21:30:34', NULL, NULL),
(671, 'Lo estoy comparando con otras opciones.', 'incoming', 'read', 58, 53, '2025-05-01 23:30:34', NULL, NULL),
(672, 'Perfecto, cualquier duda consultame.', 'outgoing', 'read', 58, 53, '2025-05-02 02:30:34', NULL, NULL),
(673, '¿Hay descuento adicional?', 'incoming', 'read', 58, 53, '2025-05-02 05:30:34', NULL, NULL),
(674, 'Por el momento no.', 'outgoing', 'read', 58, 53, '2025-05-02 08:30:34', NULL, NULL),
(675, 'Entiendo.', 'incoming', 'read', 58, 53, '2025-05-02 23:30:34', NULL, NULL),
(676, '¿Qué te pareció la propuesta?', 'outgoing', 'read', 58, 53, '2025-05-02 21:30:34', NULL, NULL),
(677, 'La verdad encontré algo más económico.', 'incoming', 'read', 58, 53, '2025-05-03 09:30:34', NULL, NULL),
(678, 'Comprendo.', 'outgoing', 'read', 58, 53, '2025-05-03 05:30:34', NULL, NULL),
(679, 'Creo que voy a elegir la otra opción.', 'incoming', 'read', 58, 53, '2025-05-02 23:30:34', NULL, NULL),
(680, 'No hay problema, gracias por tu tiempo.', 'outgoing', 'read', 58, 53, '2025-05-04 00:30:34', NULL, NULL),
(681, 'Quizás más adelante vuelva a consultar.', 'incoming', 'read', 58, 53, '2025-05-03 05:30:34', NULL, NULL),
(682, 'Te esperamos cuando quieras.', 'outgoing', 'read', 58, 53, '2025-05-03 08:30:34', NULL, NULL),
(683, 'Hola, quería consultar precios.', 'incoming', 'read', 59, 54, '2025-06-15 11:32:24', NULL, NULL),
(684, 'Con gusto, te paso la información.', 'outgoing', 'read', 59, 54, '2025-06-15 16:32:24', NULL, NULL),
(685, 'Lo estoy comparando con otras opciones.', 'incoming', 'read', 59, 54, '2025-06-15 21:32:24', NULL, NULL),
(686, 'Perfecto, cualquier duda consultame.', 'outgoing', 'read', 59, 54, '2025-06-16 02:32:24', NULL, NULL),
(687, '¿Hay descuento adicional?', 'incoming', 'read', 59, 54, '2025-06-15 19:32:24', NULL, NULL),
(688, 'Por el momento no.', 'outgoing', 'read', 59, 54, '2025-06-15 21:32:24', NULL, NULL),
(689, 'Entiendo.', 'incoming', 'read', 59, 54, '2025-06-15 23:32:24', NULL, NULL),
(690, '¿Qué te pareció la propuesta?', 'outgoing', 'read', 59, 54, '2025-06-16 22:32:24', NULL, NULL),
(691, 'La verdad encontré algo más económico.', 'incoming', 'read', 59, 54, '2025-06-16 03:32:24', NULL, NULL),
(692, 'Comprendo.', 'outgoing', 'read', 59, 54, '2025-06-16 05:32:24', NULL, NULL),
(693, 'Creo que voy a elegir la otra opción.', 'incoming', 'read', 59, 54, '2025-06-16 17:32:24', NULL, NULL),
(694, 'No hay problema, gracias por tu tiempo.', 'outgoing', 'read', 59, 54, '2025-06-17 07:32:24', NULL, NULL),
(695, 'Quizás más adelante vuelva a consultar.', 'incoming', 'read', 59, 54, '2025-06-16 11:32:24', NULL, NULL),
(696, 'Te esperamos cuando quieras.', 'outgoing', 'read', 59, 54, '2025-06-18 04:32:24', NULL, NULL),
(714, 'Hola, como estas?', 'incoming', 'delivered', 16, 11, '2026-06-14 22:13:45', NULL, NULL),
(715, 'Hola, como estas?', 'incoming', 'delivered', 16, 11, '2026-06-14 22:14:18', NULL, NULL),
(716, 'Hola, como estas?', 'incoming', 'delivered', 16, 11, '2026-06-14 22:14:27', NULL, NULL),
(717, 'Hola, como estas?', 'incoming', 'delivered', 16, 11, '2026-06-14 22:17:03', NULL, NULL),
(718, 'Hola, como estas?', 'incoming', 'delivered', 16, 11, '2026-06-14 22:17:17', NULL, NULL),
(719, 'hola como estas', 'outgoing', 'sent', 14, 9, '2026-06-16 16:51:25', NULL, NULL),
(720, 'Hola, todo bien?', 'incoming', 'delivered', 16, 11, '2026-09-14 20:42:45', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` enum('message','customer','conversation','system') DEFAULT 'system',
  `is_read` tinyint(1) DEFAULT 0,
  `reference_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `is_read`, `reference_id`, `created_at`) VALUES
(1, 4, 'Nuevo mensaje', 'Juan Pérez envió un mensaje', 'message', 1, 15, '2026-06-11 02:18:05'),
(2, 4, 'Actualizacion del sistema en breves.', 'se actualizará la app.', 'system', 1, NULL, '2026-06-11 22:41:05'),
(15, 4, 'Nuevo mensaje', 'Moda Urbana SRL te envio un mensaje.', 'message', 1, 16, '2026-06-15 01:13:45'),
(16, 4, 'Nuevo mensaje', 'Moda Urbana SRL te envio un mensaje.', 'message', 0, 16, '2026-06-15 01:14:18'),
(17, 4, 'Nuevo mensaje', 'Moda Urbana SRL te envio un mensaje.', 'message', 0, 16, '2026-06-15 01:14:27'),
(18, 4, 'Nuevo mensaje', 'Moda Urbana SRL te envio un mensaje.', 'message', 0, 16, '2026-06-15 01:17:03'),
(19, 4, 'Nuevo mensaje', 'Moda Urbana SRL te envio un mensaje.', 'message', 1, 16, '2026-06-15 01:17:17'),
(20, 4, 'Nuevo mensaje', 'Moda Urbana SRL te envio un mensaje.', 'message', 0, 16, '2026-09-14 23:42:45');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tags`
--

CREATE TABLE `tags` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `color` varchar(7) NOT NULL DEFAULT '#64748B',
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tags`
--

INSERT INTO `tags` (`id`, `name`, `color`, `description`, `created_at`, `updated_at`) VALUES
('1', 'Hot Lead', '#FF4444', 'Clientes muy interesados', '2026-04-09 13:48:42', '2026-04-09 13:48:42'),
('2', 'VIP', '#FFD700', 'Clientes premium', '2026-04-09 13:48:42', '2026-04-09 13:48:42'),
('3', 'Follow Up', '#FFA500', 'Requiere seguimiento', '2026-04-09 13:48:42', '2026-04-09 13:48:42'),
('4', 'Closed', '#28A745', 'Venta cerrada', '2026-04-09 13:48:42', '2026-04-09 13:48:42');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `subscription` enum('free','pro','business') DEFAULT 'free',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `subscription_plan` varchar(50) DEFAULT 'free',
  `subscription_status` enum('active','cancelled','past_due') DEFAULT 'active',
  `customers_limit` int(11) DEFAULT 10,
  `stripe_customer_id` varchar(100) DEFAULT NULL,
  `stripe_subscription_id` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `name`, `subscription`, `is_active`, `created_at`, `updated_at`, `subscription_plan`, `subscription_status`, `customers_limit`, `stripe_customer_id`, `stripe_subscription_id`) VALUES
(1, 'final@test.com', '$2a$12$azjxhoCbRkn/vgMauYZgWup1E/TN43vtf2f2RCwEbXB9xqEU/yhgu', 'Final Test', 'free', 1, '2026-04-02 05:30:51', '2026-05-19 21:30:32', 'free', 'active', 10, NULL, NULL),
(2, 'admin@gmail.com', '$2a$12$azjxhoCbRkn/vgMauYZgWup1E/TN43vtf2f2RCwEbXB9xqEU/yhgu', 'Administrador', 'free', 1, '2026-05-19 22:01:50', '2026-05-19 22:01:50', 'free', 'active', 10, NULL, NULL),
(3, 'prueba@gmail.com', '$2a$12$azjxhoCbRkn/vgMauYZgWup1E/TN43vtf2f2RCwEbXB9xqEU/yhgu', 'Prueba ', 'free', 1, '2026-05-19 22:01:50', '2026-05-19 22:01:50', 'free', 'active', 10, NULL, NULL),
(4, 'ventas@modaurbana.com', '$2a$12$azjxhoCbRkn/vgMauYZgWup1E/TN43vtf2f2RCwEbXB9xqEU/yhgu', 'Moda Urbana SRL', 'business', 1, '2026-06-05 21:38:57', '2026-06-05 21:38:57', 'business', 'active', 1000, NULL, NULL),
(5, 'ventas@limpiamax.com', '$2a$12$azjxhoCbRkn/vgMauYZgWup1E/TN43vtf2f2RCwEbXB9xqEU/yhgu', 'LimpiaMax', 'business', 1, '2026-06-05 21:38:57', '2026-06-05 21:38:57', 'business', 'active', 1000, NULL, NULL),
(6, 'ventas@tecnostore.com', '$2a$12$azjxhoCbRkn/vgMauYZgWup1E/TN43vtf2f2RCwEbXB9xqEU/yhgu', 'TecnoStore', 'business', 1, '2026-06-05 21:38:57', '2026-06-05 21:38:57', 'business', 'active', 1000, NULL, NULL),
(7, 'ventas@mueblespatagonia.com', '$2a$12$azjxhoCbRkn/vgMauYZgWup1E/TN43vtf2f2RCwEbXB9xqEU/yhgu', 'Muebles Patagonia', 'business', 1, '2026-06-05 21:38:57', '2026-06-05 21:38:57', 'business', 'active', 1000, NULL, NULL),
(8, 'ventas@construmarket.com', '$2a$12$azjxhoCbRkn/vgMauYZgWup1E/TN43vtf2f2RCwEbXB9xqEU/yhgu', 'ConstruMarket', 'business', 1, '2026-06-05 21:38:57', '2026-06-05 21:38:57', 'business', 'active', 1000, NULL, NULL),
(9, 'agustin@gmail.com', '$2b$12$lGHFcY96UexN0Z38mgK09ObUX6/aPFOV4HcPpnZUmpe3QLdemdj1u', 'Agustin Barroso', 'free', 1, '2026-06-16 19:30:57', '2026-06-16 19:30:57', 'free', 'active', 10, NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_conversations_customer` (`customer_id`),
  ADD KEY `users_id` (`users_id`);

--
-- Indices de la tabla `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD KEY `idx_user_status` (`user_id`,`status`),
  ADD KEY `idx_phone` (`phone`);

--
-- Indices de la tabla `customer_tags`
--
ALTER TABLE `customer_tags`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tag_id` (`tag_id`),
  ADD KEY `unique_customer_tag` (`customer_id`,`tag_id`) USING BTREE;

--
-- Indices de la tabla `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_messages_conversation` (`conversation_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indices de la tabla `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT de la tabla `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT de la tabla `customer_tags`
--
ALTER TABLE `customer_tags`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT de la tabla `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=721;

--
-- AUTO_INCREMENT de la tabla `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `conversations`
--
ALTER TABLE `conversations`
  ADD CONSTRAINT `conversations_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `conversations_ibfk_2` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `customer_tags`
--
ALTER TABLE `customer_tags`
  ADD CONSTRAINT `customer_tags_ibfk_1` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `customer_tags_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);

--
-- Filtros para la tabla `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

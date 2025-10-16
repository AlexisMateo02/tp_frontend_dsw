use convenciones_underground;

#evento
insert into evento values(10001, '20231102','20231105',500,'Isekai','convencion','Shitara Slime');

insert into evento values(10002, '20231121','20231125',750,'Ciencia Ficcion','premier pelicula','Space Operas');

#locacion
insert into locacion values(11001, 'Rimuru', POINT(-1.107778, 36.642778),'Jura Tempest Federation Road KM 0','Jura Forest');

#sala
insert into sala values(11001, 1, 'Rouge', 240, 200,'habilitada');
insert into sala values(11001, 2, 'Noir', 400, 350,'habilitada');

#presentacion
insert into presentacion values(10002, 11001,1,'La dualidad en la trama','Las space operas nos llevan a poner en tela de juicio los límites de la moralidad, la dualidad en la trama es el elemento decisivo de éxito de la historia', '2023-11-23 17:00:00','2023-11-23 20:00:00',850,'debate');

insert into presentacion values(10001, 11001,1,'Isekais predicen el uso de las IAs','Las skills de información y soporte en los personajes de Isekai (Raphael-sensei, Sapo-kun, Nano) se parecen a las IAs generativas al mejor estilo SCI-FI', '2023-11-02 10:00:00','2023-11-02 12:00:00',1100,'disertación');

insert into presentacion values(10001, 11001,2,'Book Transmigrator: Un nuevo subgenero','Recientemente ha aparecido un nuevo subgenero de isekais donde el autor o lector transmigra como un personaje secundario de la novela que escribe o lee. Que diferencias trae conocer la trama al típico isekai munchkin', '2023-11-02 13:00:00','2023-11-02 16:00:00',800,'debate');

#encargado
insert into empleado values(23232323232, 'Clayman', 'Clown','232323232','Jistav 232','clayman@moderateclowntroupe.com','1992-03-23','jefe');

#evento_encargado
insert into encargado_evento values(10001,23232323232,'supervisor');

#cliente
insert into cliente values(14141414141, 'Falmuth', '1414141414','44 Arwenack Street','falmuth@tairiku.ma','Gold');

#stand
insert into stand values(10001,1,'central', 10000,'merchandising',14141414141,9800,'20231012');
insert into stand values(10002,1,'entrada', 1000,'banner',14141414141,1500,'20231022');

#presentador

insert into presentador(id,cuit,telefono,email,denominacion) values (30000, '30303030303', '3030303030', 'fusesensei@slime.kun', 'Fuse');
insert into presentador(id,cuit,telefono,email,denominacion) values (30001, '31313131313', '3131313131', 'nitroplus@cern.ch', 'Nitro');
insert into presentador(id,cuit,telefono,email,nombre, apellido,especialidad) values (30002, '32323232323', '3232323232', 'tanakasensei@logh.jp', 'Yoshiki','Tanaka','space opera');
insert into presentador(id,cuit,telefono,email,nombre, apellido,cv) values (30003, '33333333333', '3333333333', 'singshong@orv.kr', 'Sing','Shong','Sing Shong es el seudónimo de la pareja de autores de Omnicient Readers Viewpoint y otras series. El nombre real de Sing Shong es Kim Seong-hyeon, mientras que el nombre real de Gyaon es Kim Gyeong-hyeon. Ambos son coreanos y nacieron en 1984.');
insert into presentador(id,cuit,telefono,email,nombre, apellido,especialidad) values (30004, '34343434343', '3434343434', 'yooryeo@tcf.kr', 'Yoo Ryeo','Han','book transmigrator novels');

insert into presentador(id,cuit,telefono,email,nombre, apellido,especialidad) values (30005, '35353535353', '3535353535', 'watanabesensei@sunrise.jp', 'Shinichiro','Watanabe','direccion');
insert into presentador(id,cuit,telefono,email,nombre, apellido,especialidad) values (30006, '36363636363', '3636363636', 'keino@sunrise.jp', 'Keiko','Nobumoto','space opera');
insert into presentador(id,cuit,telefono,email,nombre, apellido,especialidad) values (30007, '37373737373', '3737373737', 'toshimoto@sunrise.jp', 'Toshihiro','Kawamoto','diseño de personajes');

#presentador_presentacion
insert into presentador_presentacion values(30000,11001,1,'2023-11-02 10:00:00');

insert into presentador_presentacion values(30003,11001,2,'2023-11-02 13:00:00');
insert into presentador_presentacion values(30004,11001,2,'2023-11-02 13:00:00');

insert into presentador_presentacion values(30002,11001,1,'2023-11-23 17:00:00');
insert into presentador_presentacion values(30005,11001,1,'2023-11-23 17:00:00');
insert into presentador_presentacion values(30006,11001,1,'2023-11-23 17:00:00');
insert into presentador_presentacion values(30007,11001,1,'2023-11-23 17:00:00');

#persona
insert into persona values(40001,'Luminous', 'Valentine', 'dni', '41414141', 'nightmarequeen@westernholychurch.ru');
insert into persona values(40002,'Louis', 'Valentine', 'dni', '42424242', 'pope@westernholychurch.ru');
insert into persona values(40003,'Roy', 'Valentine', 'dni', '43434343', 'archduke@westernholychurch.ru');
insert into persona values(40004,'Phantom Franklin', 'Harlock III', 'dni', '44444444', 'kaizoku@arcadia.space');
insert into persona values(40005,'Ruri', 'Hoshino', 'dni', '45454545', 'electronicfairy@nadesico.mars');

##entradas
insert into entrada values(10001,1,'2023-10-01',2400,40001,40001);
insert into entrada values(10001,2,'2023-10-01',2400,40001,40002);
insert into entrada values(10001,3,'2023-10-01',1600,40001,40003);
insert into entrada values(10001,4,'2023-09-01',1850,40004,40005);
insert into entrada values(10002,1,'2023-09-01',1600,40004,40005);
insert into entrada values(10002,2,'2023-09-01',1600,40004,40004);
insert into entrada values(10002,3,'2023-10-01',1600,40001,40002);

#presentacion_entrada                   eve, ent  loc   sala, fecha
insert into presentacion_entrada values(10001, 1, 11001, 1, '2023-11-02 10:00:00'); 
insert into presentacion_entrada values(10001, 1, 11001, 2, '2023-11-02 13:00:00');

insert into presentacion_entrada values(10001, 2, 11001, 1, '2023-11-02 10:00:00');
insert into presentacion_entrada values(10001, 2, 11001, 2, '2023-11-02 13:00:00');

insert into presentacion_entrada values(10001, 3, 11001, 1, '2023-11-02 10:00:00');

insert into presentacion_entrada values(10001, 4, 11001, 1, '2023-11-02 10:00:00');

insert into presentacion_entrada values(10002, 1, 11001, 1, '2023-11-23 17:00:00');
insert into presentacion_entrada values(10002, 2, 11001, 1, '2023-11-23 17:00:00');
insert into presentacion_entrada values(10002, 3, 11001, 1, '2023-11-23 17:00:00');

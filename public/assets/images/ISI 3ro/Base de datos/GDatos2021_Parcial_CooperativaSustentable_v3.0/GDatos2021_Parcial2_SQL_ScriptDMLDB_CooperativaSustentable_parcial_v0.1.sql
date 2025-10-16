#delete from valor_material;
#delete from composicion;
#delete from material;
#delete from produce;
#delete from lote;
#delete from producto;
#delete from grupo_miembro;
#delete from miembro;
#delete from grupo;

# material
insert into material values (10000,'trigo burgol', 'kg', 150);
insert into material values (10001,'tomate', 'kg', 20);
insert into material values (10002,'sal', 'kg', 10);
insert into material values (10003,'pepino org', 'kg', 25);
insert into material values (10004,'cebolla agroecol', 'kg', 60);
insert into material values (10005,'aceite oliva agroecol', 'l', 100);
insert into material values (10006,'perejil', 'g', 1000);
insert into material values (10007,'menta', 'g', 3000);
insert into material values (10008,'pan integral', 'kg', 30);
insert into material values (10009,'rucula', 'paq', 10);
insert into material values (10010,'jamon crudo dma', 'g', 5000);



# valor_material
insert into valor_material values (10000, 20210801, 200);
insert into valor_material values (10001, 20210801, 80);
insert into valor_material values (10001, 20210902, 60);
insert into valor_material values (10002, 20210810, 180);
insert into valor_material values (10003, 20210907, 110);
insert into valor_material values (10004, 20210803, 90);
insert into valor_material values (10005, 20210909, 210);
insert into valor_material values (10005, 20210911, 240);
insert into valor_material values (10006,20210816, 2);
insert into valor_material values (10007,20210823, 3);
insert into valor_material values (10008,20210813, 70);
insert into valor_material values (10009,20210817, 120);

# grupo
insert into grupo values (9000, 'Productos Exóticos');
insert into grupo values (9001, 'Beloukas');

# miembros
insert into miembro values (97979797979, 'Souma', 'Yukihira', 'Polar Star Dormitory', null);
insert into miembro values (98989898989, 'Sanji', 'Vinsmoke','Sunny 1000', null);

# producto
insert into producto values (8000, 'ensalada burgol', 'Fuente de energía y aporta vitaminas, hierro, proteínas, fibra y antioxidantes. Muy bajo en grasas. Contraindicado a celíacos o intolerantes al gluten', 'mezclar los productos, embasar por separado de condimentos', 280,9000);
insert into producto values (8001, 'ensalada tabule', 'Comida originaria del medio oriente', 'mezclar los productos, embasar por separado de condimentos', 310,9000);
insert into producto values (8002, 'bruscheta', 'tostada con tomate y rucula', 'tostar 1 rodaja de pan y ponerle encima los ingredientes',20,9001);

# composicion
insert into composicion values(8000,10000,0.5);
insert into composicion values(8000,10001,0.25);
insert into composicion values(8000,10002,0.05);
insert into composicion values(8000,10003,0.15);
insert into composicion values(8000,10005,0.1);

insert into composicion values(8001,10000,0.5);
insert into composicion values(8001,10001,0.25);
insert into composicion values(8001,10003,0.15);
insert into composicion values(8001,10004,0.25);
insert into composicion values(8001,10006,0.05);
insert into composicion values(8001,10007,0.05);


insert into composicion values(8002,10001,0.05);
insert into composicion values(8002,10008,0.1);
insert into composicion values(8002,10009,0.25);

## lote
insert into lote values(8002,1,30,20210901,20210903);

## produce
insert into produce values(8002,1,98989898989,1);
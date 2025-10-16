use convenciones_underground;

/*TRANSACTIONS*/

/*301.6- Mantenimiento de Rouge. Se terminó de acondicionar una nueva sala "Blanc" mientras se da mantenimiento a la sala
"Rouge". Registar la nueva sala Blanc que terminó de acondicionarse con los siguientes datos, pasar la sala Rouge a
estado "en mantenimiento" y reasignar las presentaciones de noviembre de la sala Rouge a Blanc.
Sala:
nombre: Blanc
locación: Rimuru (11001)
Número de sala: 3
metros cuadrados: 330
capacidad: 300
estado: habilitada*/
begin;

select id_locacion, nro into @locRouge, @nroRouge
from sala
where nombre = 'Rouge';

insert into sala
values(11001,3,'Blanc',330,300,'habilitada');

update sala
set estado = 'en mantenimiento'
where id_locacion = @locRouge and nro = @nroRouge;

update presentacion
set id_locacion = 11001, nro_sala = 3
where fecha_hora_ini between '2023-11-01' and '2023-11-30 23:59:59'
and id_locacion = @locRouge and nro_sala = @nroRouge;

commit;
/*302.6- Farmenas absorve Falmuth. La empresa cliente Falmuth fue comprada y absorvida por Farmenas. Se debe ingresar al sistema la
nueva empresa con los datos a continuación y migrar todos los stands contratados para eventos futuros por Falmuth a Farmenas.
Cliente: cuit: 15151515151, razón social: Farmenas, teléfono: 1515151515, dirección: 44 Arwenack Street, email: farmenas@tairiku.ma
categoría: Premium*/
begin;

select cuit into @falumuth
from cliente
where razon_social = 'Falmuth';

insert into cliente 
values('15151515151','Farmenas','1515151515','44 Arwenack Street', 'farmenas@tairiku.ma', 'Premium');
/*puedo usar el valor directamente 15151515151 o lo tengo que guardar en una variable @Farmenas? */
/*Creo que si pero es mucho mejor usar la variable por el tema de reutilizarla*/
update stand 
set cuit_cliente = '15151515151'
where cuit_cliente = @falumuth
and id_evento in (
select id
from evento 
where fecha_desde >= now());

commit;

/*303.6- Rimuru reemplaza a Clayman. El supervisor Clayman Clown dejará de supervisar eventos, para reemplazarlo se ha contratado
un nuevo empleado: Rimuru Tempest. Darlo de alta en el sistema con los datos que figuran a continuación y asignarlo, con rol de
supervisor, a todos los futuros eventos donde Clayman debería ser supervisor.
Nuevo empleado: cuil: 24242424242 nombre: Rimuru apellido: Tempest telefono: 242424242 direccion: Hidden Cave 242 email: rimuru@jurashinrin.ma 
fecha de nacimiento: 1992-04-24 categoria: daimaou*/
begin;

select cuil into @Clayman
from empleado
where nombre = 'Clayman' and apellido= 'Clown';

insert into empleado
values (24242424242,'Rimuru','Tempest','242424242','Hidden Cave 242','rimuru@jurashinrin.ma','1992-04-24','daimaou');

update encargado_evento 
set cuil_encargado = 24242424242
where cuil_encargado = @Clayman and rol = 'supervisor'
and id_evento in (select id
from evento
where fecha_desde >= now()
);

commit;

/*304.6- Reemplazo de Fuse. El artista Fuse (denominación) sufrió una lesión en su espalda y no podra asistir a ninguna
presentación que tenía asignada durante 2023. En su lugar las realizará Shiro Masamune. Dar de alta el nuevo presentador con
los datos a continuación y reemplazar a Fuse con él para todas sus futuras presentaciones hasta fines de 2023.
Nuevo presentador: cuit: 38383838383 telefono: 3838383838 email: masanoriota@gits.sac denominacion: Shiro Masamune*/
begin;

select id into @Fuse
from presentador
where denominacion = 'Fuse';

insert into presentador (cuit, telefono, email, denominacion)
values (38383838383,'38383838383', 'masanoriota@gits.sac', 'Shiro Masamune' );

select last_insert_id() into @sm;

update presentador_presentacion
set id_presentador = @sm
where id_presentador = @Fuse and fecha_hora_ini >= now();

commit;


/*305.6- Para aumentar la audiencia se contrató a una nueva empleada para desempeñarse como "community manager".
Darla de alta en el sistema con los datos a continuación y sumarla a los encargados asignados a los eventos de tipo convención que aún no
han sucedido con dicho rol a todos los eventos futuros de tipo convención.
Nueva empleada cuil: 25252525252 nombre: Shuna apellido: Kijin telefono: 252525252 dirección: Hidden Cave 242 email: shuna@jurashinrin.ma
fecha de nacimiento: 2002-05-25 categoria: especialista rol en los eventos: community manager*/
begin;

insert into empleado
values ('25252525252', 'Shuna', 'Kijin', '252525252', 'Hidden Cave 242', 'shuna@jurashinrin.ma', '2002-05-25', 'especialista');

insert into encargado_evento
select id, 25252525252,'community manager' 
from evento
where rol = 'convención' 
and id_evento in (select id from evento
where fecha_desde >= now()
);

commit;

/*REC.6- Copia de evento. Dado el éxito del evento 10001 - Shitara Slime, se decidió repetirlo. Crear un nuevo evento "re:Shitara
Slime" con las mismas presentaciones, salas, oferta de stands (sin ser alquilados),y empleados designados como encargados.
Además la copia del evento 10001 se realiza seis meses después y con un 30% más en el valor base de la entrada en el evento, de
las presentaciones y de los stands.*/
begin;

insert into evento(fecha_desde, fecha_hasta, valor_base_entrada, tematica, tipo, nombre)
select TIMESTAMPADD(month, 6, fecha_desde), TIMESTAMPADD(month, 6, fecha_hasta),
valor_base_entrada * 1.3, tematica, tipo, 're:Shitara Slime'
from evento 
where id = 10001;

select last_insert_id() into @ress; /*gurado en la variable @ress el id del nuevo evento*/

insert into presentacion
select @ress, id_locacion, nro_sala, nombre, descripcion, TIMESTAMPADD(month, 6, fecha_hora_ini), TIMESTAMPADD(month, 6, fecha_hora_fin),
costo_entrada * 1.3, tipo
from presentacion
where id_evento = 10001;

insert into stand(id_evento, nro, ubicacion, valor_sugerido, tipo) /*solo estos porque no queremos copiar los alquileres*/
select @ress, nro, ubicacion, valor_sugerido * 1.3, tipo
from stand
where id_evento = 10001;

insert into encargado_evento
select @ress, cuil_encargado, rol
from encargado_evento
where id_evento = 10001;

commit;










































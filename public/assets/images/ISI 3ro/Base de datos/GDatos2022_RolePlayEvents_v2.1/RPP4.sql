use role_play_events;

/*TRANSACTIONS*/

/*Transferir actividades a nueva locación. La empresa ha adquirido una nueva locación para tours para utilizar cierto equipamiento. 
Se deberá dar de alta la nueva locación con los datos que figuran a continuación y transferir todas las actividades de locaciones con
ambientación “SNK” y que utilicen el equipamiento “Equipo de maniobras tridimensionales” a esta nueva locación.
Nueva locación: Nombre: Shiganshina District, Ambientación: SNK, Ubicación GPS: GPS: POINT(25.083333,
-77.333333) Dirección: Paradis 2013  */
begin;

insert into locacion(nombre,ambientacion, ubicacion_gps, direccion)
values ('Shiganshina District', 'SNK',POINT(25.083333,-77.333333),'Paradis 2013');

select last_insert_id() into @sd;

update actividad
set codigo_locacion = @sd
where equipamiento = 'Equipo de maniobras tridimensionales'
and codigo_locacion in (select codigo from locacion
where ambientacion = 'SNK');

commit;

/*Promoción y reemplazo. El encargado “Bertolt Hoover” pasó a ser guía y se contrató un nuevo empleado para reemplazarlo en las escalas. 
Se debe dar de alta el nuevo empleado con los datos que figuran a continuación, reasignar las escalas posteriores al 30 de
noviembre asignadas a “Bertolt Hoover” al nuevo encargado. Cambiar el tipo de “Bertolt Hoover” de encargado a guía y 
asígnarle los tours con temática “SNK” que comiencen posteriores al 30 de noviembre. 
Nuevo empleado: CUIL: 85-85858585-8, Nombre: Armin, Apellido: Arlert, Teléfono: +858-585858585, Categoría: comander, Tipo: encargado*/
begin;

select cuil into @bertolt
from empleado
where nombre = 'Bertolt' and apellido = 'Hoover';

insert into empleado
values (85858585858,'Armin','Arlert','+858-585858585','comander','encargado');

update escala 
set cuil_encargado = 85858585858
where cuil_encargado = @bertolt and fecha_hora_ini > '20221130';

update empleado
set tipo = 'Guia'
where cuil = @bertolt;

update tour 
set cuil_guia = @bertolt, tematica = 'SNK'
where fecha_hora_salida > '20221130';

commit;





















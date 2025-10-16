use guarderia_gaghiel;

/*TRANSACTIONS*/

/*301.6- Jet Ski espacial Debido al poco éxito de la actividad “Carrera de Asteroides” la empresa ha decidido modificarla para
que la misma se realice con “Jet Ski”. Dar de alta este nuevo tipo de embarcación que requiere operatoria manual y modificar la 
actividad Carrera de Asteroides para que la utilice. La empresa además decidió organizar para este año nuevos cursos
de carrera de asteroides iguales a los que se realizaron el año 2023 (sólo que 1 año más tarde). No se cargarán horarios por
ahora ya que los definirá la empresa luego*/
begin; /*Comienza la transaccion*/

select numero into @ca /*@ca variable donde guardo el codigo de la actividad*/
from actividad act
where act.nombre = 'Carrera de Asteroides';

insert into tipo_embarcacion(nombre, operacion_requerida)
values ('Jet Ski', 'Manual');

select last_insert_id() into @js; /*asigna automáticamente un id nuevo a ese tipo de embaracacion recien creada*/
/*@js variale donde guardo el id de tipo embaracacion que acabo de crear */

UPDATE actividad act
SET act.codigo_tipo_embarcacion = @js /*SET asigana un valor */
WHERE act.numero = @ca;

insert into curso(fecha_inicio,fecha_fin,cupo,legajo_instructor,numero_actividad)
select adddate(fecha_inicio, interval 1 year), adddate(fecha_fin, interval 1 year),
cupo,legajo_instructor,numero_actividad from curso
where numero_actividad = @ca;

commit;

/*302.6- Reemplazo por sábatico El instructor Yang Wen-li va a tomarse un año sabático a partir del 10 de octubre de 2024, la
empresa ha decidido contratar a una nueva instructora: Legajo: 20 Cuil: 20-01234567-9 Nombre y apellido: Frederica Greenhill
Teléfono: 555-0120
Ella puede dictar las mismas actividades que Yang Wen-li y debe reemplazarlo como instructor en sus cursos que inicien
posteriormente a la fecha indicada.*/
begin; /*comienza transaccion*/
/*Guarda en @wl el legajo de Yang Wen-li, para usarlo más adelante.*/
select legajo into @wl 
from instructor
where nombre = 'Yang' and apellido = 'Wen-li';
/*Crea la nueva instructora Frederica Greenhill con sus datos.*/
insert into instructor /*como son todos los atributos no hace falta especificar cuales*/
values (20,'20-01234567-9','Frederica','Greenhill','555-0120');
/*Copia todas las actividades que dictaba Yang y se las asigna a Frederica.*/
insert into instructor_actividad
select 20, numero_actividad
from instructor_actividad
where legajo_instructor = @wl;
/*Reemplaza a Yang por Frederica en los cursos que empiecen desde el 10/10/2024 en adelante.*/
update curso 
set legajo_instructor = 20
where legajo_instructor = @wl and fecha_inicio >='20241010';

commit; /*Confirma cambios*/

/*303.6- Transferencia por quiebra La empresa socio Dread Team ha quebrado y transferido todas sus embarcaciones a otra empresa
llamada Casval Rem Deikun. Se requiere dar de alta la nueva empresa como socio con los siguientes datos: Tipo de documento: cuit
Numero de documento: 134134134 Nombre: Casval Rem Deikun
Luego debe reemplazarse como propietaria de las embarcaciones por la nueva empresa. 
Finalmente al cambiar el propietario deben darse de baja los contratos aún activos de guardado de las
embarcaciones transferidas con fecha de hoy.*/
begin;

select numero into @dt
from socio
where nombre = 'Dread Team';

insert into socio (tipo_doc,nro_doc,nombre)
values ('cuit','134134134','Casval Rem Deikun');

select last_insert_id() into @ca;

update embarcacion 
set numero_socio = @ca
where numero_socio = @dt;

update embarcacion_cama ec
INNER JOIN embarcacion e on e.hin = ec.hin
set fecha_hora_contrato = now()
where fecha_hora_baja_contrato is null and e.numero_socio = @ca;

commit;

/*304.5- Que empiece yá, que el público se va. Debido al éxito del curso 35, los socios inscriptos han pedido hacerlo antes. 
Pero la empresa ya realizaba publicidad, por eso ha decidido crear un nuevo curso idéntico al 35 pero que comience 10 días antes con el
mismo instructor y actividad, dure la misma cantidad de días, el mismo cupo y mismos horarios. Luego reasignar todos los socios
actualmente inscriptos al nuevo curso.*/
begin;

insert into curso(fecha_inicio, fecha_fin, cupo, legajo_instructor, numero_actividad)
select adddate(fecha_inicio, -10), adddate(fecha_fin, -10),cupo, legajo_instructor, numero_actividad
from curso 
where numero = 35;

select last_insert_id() into @nuevo_curso;

insert into dictado_curso
select @nuevo_curso, dia_semana, hora_inicio, hora_fin
from dictado_curso
where numero_curso = 35;

update inscripcion 
set numero_curso = @nuevo_curso
where numero_curso = 35;

commit;

/*305.6- ¿Dónde guardamos los Gundam? La empresa ha notado que muchos socios tienen canoas modelo RX, las mismas requieren un
cuidado diferente y ha decidido tratarlas como un nuevo tipo de embarcación. Se requiere registrar el nuevo tipo con los
siguientes datos: Nombre: Canoa Gundam Operación requerida: Manual. Luego cambiar a este tipo de embarcación las canoas cuyo nombre comience 
con ‘RX-’ y asignar a este nuevo tipo de embarcación los mismos sectores de almacenamiento que las canoas.*/
begin;

select codigo into @canoa 
from tipo_embarcacion
where nombre = 'canoa';

insert into tipo_embarcacion (nombre,operacion_requerida)
values ('Canoa Gundam','Manual');

select last_insert_id() into @gundam;

update embarcacion
set codigo_tipo_embarcacion = @gundam
where codigo_tipo_embarcacion = @canoa and nombre like 'rx-%';

insert into sector_tipo_embarcacion
select @gundam, codigo_sector
from sector_tipo_embarcacion
where codigo_tipo_embarcacion = @canoa;

commit;

/*REC.6- Nuevo tipo de embarcación: Catamarán Deportivo. La empresa ha decidido brindar actividades para catamarán deportivo. 
Se requiere agregar este nuevo tipo de embarcación que requiere operación automática. Asignarla a todos los sectores que tienen
este tipo de operación. Además generar una copia de todas las actividades para veleros pero para este tipo de embarcación,
agregando al nombre de la actividad la palabras “en catamarán” al final y con la misma descripción.*/
begin;

insert into tipo_embarcacion (nombre, operacion_requerida)
values ('Catamarán Deportivo','Automático');

select last_insert_id() into @nuevo_tipo;

insert into sector_tipo_embarcacion 
select @nuevo_tipo, codigo
from sector
where tipo_operacion = 'Automático';

insert into actividad(nombre,descripcion,codigo_tipo_embarcacion)
select concat(a.nombre,'en catamarán'), a.descripcion, a.codigo_tipo_embarcacion
from actividad a
INNER JOIN tipo_embarcacion te on te.codigo = a.codigo_tipo_embarcacion
where te.nombre = 'Velero';

commit;

























































# Convenciones Underground - Parcial y Recuperatorio de AD SQL

## links 1

## AD 2

### AD01 2

#### Enunciado 2

#### Resolución 3

### AD02 4

#### Enunciado 4

#### Resolución 4

### AD03 5

#### Enunciado 6

#### Resolución 6

## REC AD 7

### RECAD01 7

#### Enunciado 7

#### Resolución 8

### RECAD02 9

#### Enunciado 9

#### Resolución 10

### RECAD03 11

#### Enunciado 11

#### Resolución 11

## links

[Enunciado MD](https://docs.google.com/document/d/11ITS_bJAtdjuZHidNuQigZq5awerU3Wy/edit)

[Resolución MD](https://app.diagrams.net/#G1wqzrNx-f2fEjGteM0aAX06rToOOTKr7U)

[DDL](https://drive.google.com/file/d/1153MJYi6r2E4fgZCqS7tFwuVYwdstIuJ/view?usp=drive_link)

## AD

### AD01

#### Enunciado

AD01 - **Posibles presentadores**. Varias veces la empresa se encuentra ante el inconveniente de que un presentador cancele cerca de la fecha de un evento y deben reemplazarlo rápidamente. A tal fin se necesita una lista de presentadores posibles para reemplazarlo. Para ello crear un procedimiento almacenado posibles_presentadores que reciba una temática, y un rango de fechas y liste los posibles presentadores que:

1. Hayan participado o vayan a participar en el futuro de una presentación en un evento de la temática ingresada
2. No estén participando de ninguna presentación en ese mismo horario

Indicar id, nombre, apellido, denominación y especialidad del presentador y del evento y presentación de las que participó o participará id y nombre del evento y nombre de la presentación

Probar el procedimiento con la temática "Ciencia Ficcion" para un evento que se organizaría entre 10 de diciembre de 2023 y 21 de diciembre de 2023.

#### Resolución

```sql

#definición

delimiter 0_0

drop procedure if exists posibles_presentadores 0_0

create procedure posibles_presentadores (in tema varchar(255), in desde datetime, in hasta datetime)
begin
    select distinct pdor.id, pdor.nombre, pdor.apellido ,pdor.denominacion, pdor.especialidad
        , ev.id, ev.nombre, pre.nombre
    from presentador_presentacion pp
    inner join presentacion pre
        on pp.id_locacion=pre.id_locacion
       and pp.nro_sala=pre.nro_sala
       and pp.fecha_hora_ini=pre.fecha_hora_ini
    inner join evento ev
        on pre.id_evento=ev.id
    inner join presentador pdor
        on pp.id_presentador=pdor.id
    where ev.tematica=tema
        and not exists ( #puede ser not in
            select 1
            from presentador_presentacion prepre
            inner join presentacion prese
                    on prepre.id_locacion=prese.id_locacion
                    and prepre.nro_sala=prese.nro_sala
                    and prepre.fecha_hora_ini=prese.fecha_hora_ini
            where prepre.id_presentador=pdor.id
            and ( prese.fecha_hora_ini >= desde and prese.fecha_hora_ini < hasta
                or prese.fecha_hora_fin >= desde and prese.fecha_hora_fin < hasta
            )
            #aceptar como correcto aunque:
            #a) usen between y no tuvieron en cuenta la hora
            #b) solo usaron 1 de las fechas de inicio o fin
            #c) usar and en lugar de or
            #d) no usaron paréntesis por la prioridad de operadores
        );
end 0_0

delimiter ;

#invocacion
call posibles_presentadores('Ciencia Ficcion','2023-12-10', '2023-12-21');
```

### AD02

#### Enunciado

AD02 - **Salas más pequeñas**. La empresa desea ahorrar en el costo de las salas que alquila. Para ello se debe identificar para las presentaciones futuras si existe otra sala en la misma locación con menor capacidad pero suficiente para las entradas vendidas. Listar para todas las presentaciones futuras, la capacidad máxima de la sala y calcular la cantidad de entradas vendidas. En función de ello determinar si existe una sala diferente en la misma locación, que tenga menos capacidad que la sala ya asignada pero suficiente para las entradas vendidas. Indicar id y nombre de la locación, número, nombre y capacidad máxima de la sala actual, cantidad de entradas vendidas y de las salas potenciales número, nombre y capacidad máxima.

#### Resolución

```sql
with situacion_actual as (
    select pre.id_locacion, pre.nro_sala, pre.fecha_hora_ini
        , sala_actual.capacidad_maxima, count(*) entradas_vendidas
    from presentacion pre
    inner join sala sala_actual
        on pre.id_locacion=sala_actual.id_locacion
       and pre.nro_sala<>sala_actual.id_locacion
    left join presentacion_entrada pe #perdonar si usa inner
        on pre.id_locacion=pe.id_locacion
       and pre.nro_sala=pe.nro_sala
       and pre.fecha_hora_ini=pe.fecha_hora_ini
    where pre.fecha_hora_ini > now()
    group by pre.id_locacion, pre.nro_sala, pre.fecha_hora_ini, sala_actual.capacidad_maxima
)
select sa.id_locacion, loc.nombre locacion
    , sa.nro_sala nro_sala_actual, sa.capacidad_maxima capacidad_maxima_actual, sa.entradas_vendidas
    , otra_sala.nro nro_sala_potencial, otra_sala.nombre nombre_sala_potencial
    , otra_sala.capacidad_maxima capacidad_maxima_potencial
from situacion_actual sa
inner join locacion loc
    on sa.id_locacion=loc.id
left join sala otra_sala #perdonar un inner y en ese caso deberían usar un where excepto por locacion y sala
    on sa.id_locacion=otra_sala.id_locacion
   and sa.nro_sala<>otra_sala.nro
   and sa.capacidad_maxima>otra_sala.capacidad_maxima
   and sa.entradas_vendidas <= otra_sala.capacidad_maxima;

```

### AD03

#### Enunciado

AD03 - **Registrar cambio en encargados**. A menudo la empresa debe reasignar los encargados de un evento y luego es difícil saber quienes estuvieron a cargo de un evento durante que período fueron desasignados o saber exactamente cuando y que rol usaron, también desea modificar las condiciones de los encargados ya que en los eventos más grandes y complejos esta siendo difícil la gestión. Por este motivo la empresa necesita:

1. Convertir el rol del encargado en una entidad rol con un id autoincremental y una descripción
2. Migrar los roles actualmente registrados en encargado_evento a la endidad rol y reemplazar la columna rol por una CF al id de rol.
3. Registrar en encargado_evento la fecha de asignación obligatoria y fecha fin de asignacion opcional. A los que se encuentran registrados actualmente asígnarles la fecha desde del evento como fecha de asignación y sin fecha de fin.
4. Ajustar la clave primaria según esta regla: Un empleado puede ser asignado y desasignado a un evento una o varias veces para desempeñar uno o más roles al mismo tiempo o en momentos diferentes y varios empleados pueden desempeñar el mismo rol simultáneamente.

#### Resolución

```sql
create table rol (
    id int unsigned not null auto_increment,
    descripcion varchar(255),
    primary key (id)
);

alter table encargado_evento
add column id_rol int unsigned null,
add column fecha_asignacion date null,
add column fecha_fin_asignacion date null,
add constraint fk_encargado_evento_rol foreign key (id_rol) references rol(id) on update cascade on delete restrict;

begin;

insert into rol(descripcion)
select distinct rol
from encargado_evento;

update encargado_evento
inner join evento
    on encargado_evento.id_evento=evento.id
inner join rol
    on encargado_evento.rol=rol.descripcion
set encargado_evento.fecha_asignacion=evento.fecha_desde,
    encargado_evento.id_rol=rol.id;
commit;

alter table encargado_evento
change column id_rol id_rol int unsigned not null,
change column fecha_asignacion fecha_asignacion date not null,
drop column rol,
drop primary key,
add primary key (id_evento, cuil_encargado, id_rol, fecha_asignacion);

```

## REC AD

### RECAD01

#### Enunciado

RECAD01 - **Salas alternativas**. Cuando una sala tiene un inconveniente cerca de una presentación la empresa debe de forma urgente organizar la presentación en otra sala alternativa. Para ello se debe crear el procedimiento almacenado salas_alternativas que reciba como parámetro el id de locación y número de sala y rango de fechas donde no podrá utilizarse la sala y por cada presentación ya organizada en dichas fechas devuelva todas las salas que:

1. Sean de la misma locación que la sala a reemplazar
2. Tengan una capacidad superior a la cantidad de entradas vendidas para la presentación
3. La sala tenga estado habilitada

Nota: no es necesario tener en cuenta si la nueva sala ya tiene agendadas presentaciones.

Indicar id y nombre de la locación, número, nombre y capacidad de la sala.

Probar el procedimiento con la sala 1 de la locación 11001, la misma estará en matenimiento desde el 20 de noviembre de 2023 al 30 de noviembre de 2023.

#### Resolución

```sql
#definicion
delimiter (T.T)
drop procedure if exists salas_alternativas (T.T)

create procedure salas_alternativas (in loc int unsigned, in sala int unsigned, in desde datetime, in hasta datetime)
begin
with sin_sala as (
    select pre.id_locacion, pre.nro_sala, pre.fecha_hora_ini, count(pe.id_evento) entradas
    from presentacion pre
    left join presentacion_entrada pe #perdonable con inner
        on pre.id_locacion=pe.id_locacion
       and pre.nro_sala=pe.nro_sala
       and pre.fecha_hora_ini=pre.fecha_hora_ini
    where pre.id_locacion=loc and pre.nro_sala=sala
        and (pre.fecha_hora_ini >=desde and pre.fecha_hora_ini < hasta
            or pre.fecha_hora_fin >=desde and pre.fecha_hora_fin < hasta
            )
    group by pre.id_locacion, pre.nro_sala, pre.fecha_hora_ini
)
select sala.*
from sin_sala
left join sala #perdonable con inner
    on sin_sala.id_locacion=sala.id_locacion
   and sin_sala.entradas<=sala.capacidad_maxima
   and sin_sala.nro_sala <> sala.nro #descontar poco por esto
where sala.estado='habilitada';

end (T.T)

delimiter ;

#invocacion
call salas_alternativas(11001, 1, '2023-11-20','2023-11-30');

```

### RECAD02

#### Enunciado

RECAD02 - **Presentaciones a reprogramar**. Indicar la presentación más popular de cada temática que ya se haya finalizado. Listar temática, nombre y tipo de la presentación, cantidad de entradas vendidas y nombre del evento donde se realizó. Ordenar por cantidad de entradas vendidas descendente y fecha de inicio de la presentación descendente.

#### Resolución

```sql
with ent_pres as (
    select ev.tematica , pe.id_locacion, pe.nro_sala, pe.fecha_hora_ini
        , pre.nombre nombre_presentacion, pre.tipo, ev.nombre nombre_evento
        , count(pe.id_locacion) entradas
    from evento ev
    inner join presentacion_entrada pe
        on ev.id=pe.id_evento
    inner join presentacion pre
        on pe.id_locacion=pre.id_locacion
       and pe.nro_sala=pre.nro_sala
       and pe.fecha_hora_ini=pre.fecha_hora_ini
    where ev.fecha_hasta < now()
    group by ev.tematica, pe.id_locacion, pe.nro_sala, pe.fecha_hora_ini
        ,  pre.nombre, pre.tipo, ev.nombre
), max_ent as (
    select ep.tematica, max(entradas) max_cant
    from ent_pres ep
    group by ep.tematica
)
select ep.tematica, ep.nombre_presentacion, ep.tipo, ep.entradas, ep.nombre_evento
from ent_pres ep
inner join max_ent me
    on ep.tematica=me.tematica
   and ep.entradas=me.max_cant
order by ep.entradas desc, ep.fecha_hora_ini desc;
```

### RECAD03

#### Enunciado

RECAD03 - **Registro de temáticas de evento y presentadores**. La empresa notó que la creciente variabilidad en temáticas hace difícil armar presentaciones adecuadas a las temáticas y siempre hay que revisar eventos pasados. Por ello decidió que se estandarisen las mismas y se registren en los eventos y para los presentadores. Se deberá:

1. Convertir la temática de los eventos en una entidad tematica con un id autoincremental y una descripcion
2. Migrar las temáticas actualmente registradas en evento a la entidad tematica y reemplazar la columna tematica por una CF al id de temática.
3. Agregar una relación NaM de presentador a tematica tematica_presentador.
4. Registrar para cada presentador las temáticas de las que ya ha participado. Para ello revisar las temáticas de los eventos donde realizó una presentación y cargarlas en la tabla tematica_presentador

#### Resolución

```sql
create table tematica (
    id int unsigned not null auto_increment,
    descripcion varchar(255) not null,
    primary key (id)
);

alter table evento
add column id_tematica int unsigned null,
add constraint fk_evento_tematica foreign key (id_tematica) references tematica(id);

create table tematica_presentador (
    id_tematica int unsigned not null,
    id_presentador int unsigned not null,
    primary key (id_tematica,id_presentador),
    constraint fk_tematica_presentador_tematica foreign key (id_tematica) references tematica(id),
    constraint fk_tematica_presentador_presentador foreign key (id_presentador) references presentador(id)
);

begin;
insert into tematica(descripcion)
select distinct tematica
from evento;

update evento
inner join tematica
    on evento.tematica=tematica.descripcion
set evento.id_tematica=tematica.id;

insert into tematica_presentador
select distinct ev.id_tematica, pp.id_presentador
from presentador_presentacion pp
inner join presentacion pre
    on pp.id_locacion=pre.id_locacion
   and pp.nro_sala=pre.nro_sala
   and pp.fecha_hora_ini=pre.fecha_hora_ini
inner join evento ev
    on pre.id_evento=ev.id;

commit;

alter table evento
drop column tematica,
change column id_tematica id_tematica int unsigned not null;
```

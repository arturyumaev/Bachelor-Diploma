create type "AppointmentStatus" as enum ('Confirmed', 'In Process', 'Done');
create type "Currency" as enum ('РУБ', 'USD');
create type "Gender" as enum ('Male', 'Female', 'Other');
create type "AccessControl" as enum ('Admin', 'Doctor', 'Patient');

create table if not exists "User" (
    "firstName" varchar(50) not null ,
    "lastName" varchar(50) not null ,
    email varchar(50) not null ,
    phone varchar(50) not null ,
    gender "Gender" not null ,
    "birthDate" timestamp not null ,
    address varchar(300) not null ,
    login varchar(50) not null ,
    hashsum varchar(50) not null ,
    "accessControl" "AccessControl" not null
);

create table if not exists "Location" (
    id serial unique,
    "locationName" varchar(50) not null ,
    address varchar(300) not null ,
    phone varchar(50) not null ,

    primary key (id)
);

create table if not exists "Doctor" (
    id serial unique,
    "locationId" int not null ,

    primary key (id),

    constraint fk_locationId
        foreign key ("locationId")
        references "Location"(id)
) inherits ("User");

create table if not exists "Patient" (
    id serial unique,
    "emergencyContactName" varchar(50),
    "emergencyContactPhone" varchar(50),
    "emergencyContactRelation" varchar(50),

    primary key (id)
) inherits ("User");

create table if not exists "Appointment" (
    id serial unique,
    name varchar(100) not null,
    time timestamp not null,
    duration int not null,
    status "AppointmentStatus" not null,
    notes text not null,
    "patientId" int not null,
    "doctorId" int not null,
    "locationId" int not null,

    primary key (id),

    constraint "fk_patientId"
        foreign key ("patientId")
        references "Patient"(id),

    constraint "fk_doctorId"
        foreign key ("doctorId")
        references "Doctor"(id),

    constraint "fk_locationId"
        foreign key ("locationId")
        references "Location"(id)
);

create table if not exists "AppointmentProcedure" (
    id serial unique,
    "appointmentId" int not null,
    "procedureName" varchar(400) not null,
    "doctorId" int not null,
    duration int not null,
    room varchar(50) not null,
    price int not null,
    currency "Currency" not null,

    primary key (id),

    constraint "fk_appointmentId"
      foreign key ("appointmentId")
	  references "Appointment"(id),

	constraint "fk_doctorId"
        foreign key ("doctorId")
        references "Doctor"(id)
);

create table if not exists  "Admin" (
    id serial unique,
    "locationId" int not null ,

    primary key (id),

    constraint fk_locationId
        foreign key ("locationId")
        references "Location"(id)
) inherits ("User");


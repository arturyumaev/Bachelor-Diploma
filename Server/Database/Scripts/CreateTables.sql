create type "AppointmentStatus" as enum ('Created', 'In Process', 'Done', 'Canceled');
create type "AppointmentPaymentStatus" as enum('Paid', 'NotPaid');
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
    username varchar(50) not null ,
    hashsum varchar(50) not null ,
    "accessControl" "AccessControl" not null
);

create table if not exists "Location" (
    id serial unique,
    "locationName" varchar(50) not null ,
    address varchar(300) not null ,
    phone varchar(50) not null ,
    email varchar not null ,

    primary key (id)
);

create table if not exists "Doctor" (
    id serial unique ,
    "locationId" int not null ,
    "departmentId" int not null ,
    "workExperience" int not null ,
    "academicDegree" varchar not null ,
    notes text not null ,

    primary key (id),

    constraint fk_locationId
        foreign key ("locationId")
        references "Location"(id),

    constraint fk_departmentId
        foreign key ("departmentId")
        references "Department"(id)
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
    "scheduledTime" varchar not null,
    "scheduledEndTime" varchar not null,
    created varchar not null,
    status "AppointmentStatus" not null,
    "paymentStatus" "AppointmentPaymentStatus" null,
    notes text not null,

    "patientId" int not null,
    "doctorId" int not null,
    "appointmentProcedureId" int not null, /* Ids from doctor's available */
    "roomId" int not null, /* Sets from app proc */

    primary key (id),

    constraint "fk_patientId"
        foreign key ("patientId")
        references "Patient"(id),

    constraint "fk_doctorId"
        foreign key ("doctorId")
        references "Doctor"(id),

    constraint "fk_locationId"
        foreign key ("locationId")
        references "Location"(id),

    constraint "fk_roomId"
        foreign key ("roomId")
        references "Room"(id),

    constraint "fk_appointmentProcedureId"
        foreign key ("roomId")
        references "AppointmentProcedure"(id)
);

create table if not exists "Room" (
    id serial unique,
    name varchar not null,
    floor int not null,
    notes text not null,
    "locationId" int not null,

    primary key (id),

    constraint "fk_locationId"
        foreign key ("locationId")
        references "Location"(id)
);

create table if not exists "AppointmentProcedure" (
    id serial unique,
    name varchar(400) not null,
    duration int not null,
    price int not null,
    notes text not null,

    "doctorId" int not null,
    "roomId" int not null,
    "departmentId" int not null,
    "locationId" int not null,

    primary key (id),

	constraint "fk_doctorId"
        foreign key ("doctorId")
        references "Doctor"(id),

    constraint "fk_roomId"
        foreign key ("roomId")
        references "Room"(id),

    constraint "fk_departmentId"
        foreign key ("departmentId")
        references "Department"(id),

    constraint "fk_locationId"
        foreign key ("locationId")
        references "Location"(id)
);

create table if not exists "Department" (
    id serial unique ,
    name varchar not null
);

create table if not exists  "Admin" (
    id serial unique,
    "locationId" int not null ,

    primary key (id),

    constraint fk_locationId
        foreign key ("locationId")
        references "Location"(id)
) inherits ("User");

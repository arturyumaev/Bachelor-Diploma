insert into "Location"("locationName", address, phone)
    values
        ('Saint Petersburg Clinic', 'SPB, Lenina Street, 1/1', '+122222222'),
        ('Moscow Clinic', 'Moscow, Test Street, 1/1', '+11111111111');

select * from "Location";

insert into "Admin"("firstName", "lastName", email, phone, gender, "birthDate", address, username, hashsum, "accessControl", "locationId")
    VALUES
        ('admin', 'admin', 'admin@admin.com', '+11111111111', 'Male', '01.01.1970', 'no addr', 'admin', 'admin', 'Admin', 1);

insert into "Patient"("firstName", "lastName", email, phone, gender, "birthDate", address, username, hashsum, "accessControl", "emergencyContactName", "emergencyContactPhone", "emergencyContactRelation")
    values
        ('Artur', 'Yumaev', 'art@ya.ru', '+79671905205', 'Male', date('10.10.1998'), 'Moscow', 'demo', 'demo', 'Patient', 'Sveta', '+79099993344', 'Mother');

select * from "Patient";

select * from "Admin";
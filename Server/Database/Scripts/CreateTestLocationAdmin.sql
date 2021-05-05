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
        ('Artur', 'Yumaev', 'art@ya.ru', '+79671905205', 'Male', date('10.10.1998'), 'Moscow', 'demo', 'demo', 'Patient', 'Sveta', '+79099993344', 'Mother'),
        ('Patient 1', 'Patient 1', 'patient1@ya.ru', '+71111111111', 'Male', '10.10.1998', 'Moscow', 'patient1', 'patient1', 'Patient', 'MotherName', '+79111111111', 'Mother'),
        ('Patient 2', 'Patient 2', 'patient2@ya.ru', '+72111111111', 'Male', '10.10.1998', 'Moscow', 'patient2', 'patient2', 'Patient', 'MotherName', '+79211111111', 'Mother'),
        ('Patient 3', 'Patient 3', 'patient3@ya.ru', '+73111111111', 'Male', '10.10.1998', 'Moscow', 'patient3', 'patient3', 'Patient', 'MotherName', '+79311111111', 'Mother'),
        ('Patient 4', 'Patient 4', 'patient4@ya.ru', '+74111111111', 'Male', '10.10.1998', 'Moscow', 'patient4', 'patient4', 'Patient', 'MotherName', '+79411111111', 'Mother'),
        ('Patient 5', 'Patient 5', 'patient5@ya.ru', '+75111111111', 'Male', '10.10.1998', 'Moscow', 'patient5', 'patient5', 'Patient', 'MotherName', '+79511111111', 'Mother'),
        ('Patient 6', 'Patient 6', 'patient6@ya.ru', '+76111111111', 'Male', '10.10.1998', 'Moscow', 'patient6', 'patient6', 'Patient', 'MotherName', '+79611111111', 'Mother');

insert into "Doctor"("firstName", "lastName", email, phone, gender, "birthDate", address, username, hashsum, "accessControl", "locationId")
    values
        ('Doctor1', 'Doctor1', 'doc1@ya.ru', '+79671905205', 'Male', date('10.10.1998'), 'Moscow', 'doc1', 'doc1', 'Doctor', 1),
        ('Doctor2', 'Doctor2', 'doc2@ya.ru', '+71111111111', 'Male', date('10.10.1998'), 'SPB', 'doc2', 'doc2', 'Doctor', 2);

select * from "Location";

select * from "Patient";

select * from "Admin";

select * from "Doctor";

UPDATE "Patient"
SET "firstName" = 'Acrhi', "lastName" = 'yuma'
WHERE id = 1;

SELECT * FROM "Patient"
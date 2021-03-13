insert into "Location"("locationName", address, phone)
    values
        ('Saint Petersburg Clinic', 'SPB, Lenina Street, 1/1', '+122222222'),
        ('Moscow Clinic', 'Moscow, Test Street, 1/1', '+11111111111');

select * from "Location";

insert into "Admin"("firstName", "lastName", email, phone, gender, "birthDate", address, username, hashsum, "accessControl", "locationId")
    VALUES
        ('admin', 'admin', 'admin@admin.com', '+11111111111', 'Male', '01.01.1970', 'no addr', 'admin', 'admin', 'Admin', 1);

select * from "Admin";

SELECT * FROM "Admin"
      WHERE username = 'admin';

select * from "Admin";
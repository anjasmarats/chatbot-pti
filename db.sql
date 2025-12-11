create table Dosen (
  id serial primary key,
  username varchar(40) not null,
  password varchar(20) not null
);

create table Feedback (
  id serial primary key,
  content text not null,
  analysis text not null,
  category boolean not null
);

create table Mahasiswa (
  id serial primary key,
  username varchar(40) not null,
  password varchar(20) not null
);
create extension if not exists "uuid-ossp";

create type status_type as enum ('ORDERED', 'OPEN', 'IN_PROGRESS');

create table users (
  id uuid not null default uuid_generate_v4() primary key,
  name text,
  password text
);

create table carts (
	id uuid not null default uuid_generate_v4() primary key,
	user_id uuid not null default uuid_generate_v4(),
	created_at date not null,
	updated_at date not null,
	status status_type
);

create table cart_items (
	cart_id uuid,
	product_id uuid default uuid_generate_v4(),
	count numeric,
	foreign key (cart_id) references carts(id) on delete cascade
);

create table orders (
  id uuid not null default uuid_generate_v4() primary key,
  user_id uuid,
  cart_id uuid,
  payment json,
  delivery json,
  comments text,
  status status_type,
  total numeric,
	foreign key (cart_id) references carts(id)
);

insert into carts (created_at, updated_at, status) values
(current_date, current_date, 'OPEN'),
(current_date, current_date, 'ORDERED'),
(current_date, current_date, 'OPEN');

insert into cart_items (cart_id, count) values
('a5705165-5142-48b6-ba38-d5f3cac65285', 1),
('a5705165-5142-48b6-ba38-d5f3cac65285', 2),
('b6072587-5712-42c0-b963-13fa7461fb4c', 3),
('b6072587-5712-42c0-b963-13fa7461fb4c', 4),
('92ee4621-a4b4-4037-8778-450e7a9a909e', 5),
('92ee4621-a4b4-4037-8778-450e7a9a909e', 6);

create table if not exists "opa_data"
(
    id             serial,
    data           jsonb,
    constraint opa_data_pkey
        primary key (id)
);

create table if not exists "opa_rego"
(
    id             serial,
    rego           text,
    constraint opa_rego_pkey
        primary key (id)
);
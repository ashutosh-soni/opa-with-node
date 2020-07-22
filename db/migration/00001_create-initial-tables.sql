create table if not exists "opa_data"
(
    id             serial,
    name            text,
    type           text,
    data           jsonb,
    constraint opa_data_pkey
        primary key (id)
);

create table if not exists "opa_rego"
(
    id             serial,
    name            text,
    type           text,
    rego           text,
    constraint opa_rego_pkey
        primary key (id)
);
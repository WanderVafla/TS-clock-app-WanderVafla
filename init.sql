create table if not exists projects (
    id int generated always as identity primary key,
    name varchar(255) not null check (length(trim(name)) > 0),
    created_at timestamptz not null default current_timestamp
);

create table if not exists time_entries (
    id int generated always as identity primary key,
    start_time timestamptz not null,
    end_time timestamptz check (end_time >= start_time),
    description varchar(255),
    project_id int,
    
    foreign key (project_id) references projects(id) on delete cascade
);

create table if not exists labels (
    id int generated always as identity primary key,
    name varchar(255) not null
);

--for doing many-to-many links --
create table if not exists labels_time_entrie (
    time_entry_id int not null,
    label_id int not null,
    
    foreign key (label_id) references labels(id) on delete cascade,
    foreign key (time_entry_id) references time_entries(id) on delete cascade,

    primary key (label_id, time_entry_id)
);

-- Index --
create index idx_time_entries_project_id on time_entries(project_id);
create index idx_time_entries_start_time on time_entries(start_time);
create index idx_time_entries_end_time on time_entries(end_time);
create index idx_time_entries_label_id on labels_time_entrie(label_id);

-- Predefined list --
INSERT INTO projects (name) VALUES ('General'), ('Work');
INSERT INTO labels (name) VALUES ('Bug'), ('Feature'), ('Meeting');
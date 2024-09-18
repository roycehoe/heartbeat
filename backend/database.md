TABLE user
    id int PK
    username str
    password str
    name str
    phone_number int
    dob int
    address int
    volunteering_frequency list str volunteering_frequency
    skills list int skill
    target_groups list str target_group
    languages_spoken list str language_spoken
    lat float
    lng float
    applied_jobs list int job_id
    created_at timestamp

TABLE matchmaking_fields
    id int PK
    field_group enum [skill, target_group, language_spoken, volunteering_frequency]
    field_name str


TABLE admin
    id int PK
    name str
    description str

TABLE job
    id int PK
    admin_id int FK
    is_open bool
    applicants list int user_id
    successful_applicants list int user_id
    openings int
    description str
    skills list skill
    target_group list target_groups
    volunteering_frequency list volunteering_frequency
    languages_spoken list language_spoken
    lat float
    lng float
    created_at timestamp

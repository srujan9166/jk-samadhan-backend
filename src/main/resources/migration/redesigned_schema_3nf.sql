-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Separate Schema Namespace
CREATE SCHEMA IF NOT EXISTS jks_3nf;
SET search_path TO jks_3nf, public;

-- ==========================================
-- 1. GEOGRAPHICAL REFERENCE TABLES
-- ==========================================

CREATE TABLE divisions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    division_id INTEGER NOT NULL REFERENCES divisions(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    lgd_code INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blocks (
    id SERIAL PRIMARY KEY,
    district_id INTEGER NOT NULL REFERENCES districts(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE panchayats (
    id SERIAL PRIMARY KEY,
    block_id INTEGER NOT NULL REFERENCES blocks(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE municipalities (
    id SERIAL PRIMARY KEY,
    district_id INTEGER NOT NULL REFERENCES districts(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wards (
    id SERIAL PRIMARY KEY,
    municipality_id INTEGER NOT NULL REFERENCES municipalities(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. ORGANIZATIONAL REFERENCE TABLES
-- ==========================================

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    name VARCHAR(500) NOT NULL,
    reminder_days INTEGER DEFAULT 28,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subcategory_level1 (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(500) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subcategory_level2 (
    id SERIAL PRIMARY KEY,
    parent_l1_id INTEGER NOT NULL REFERENCES subcategory_level1(id) ON DELETE CASCADE,
    name VARCHAR(500) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subcategory_level3 (
    id SERIAL PRIMARY KEY,
    parent_l2_id INTEGER NOT NULL REFERENCES subcategory_level2(id) ON DELETE CASCADE,
    name VARCHAR(500) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subcategory_level4 (
    id SERIAL PRIMARY KEY,
    parent_l3_id INTEGER NOT NULL REFERENCES subcategory_level3(id) ON DELETE CASCADE,
    name VARCHAR(500) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 3. USER MANAGEMENT TABLES
-- ==========================================

CREATE TABLE designations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_types (
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL UNIQUE,
    user_level INTEGER NOT NULL,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE NOT NULL,
    user_type_id INTEGER NOT NULL REFERENCES user_types(id) ON DELETE RESTRICT,
    first_name VARCHAR(255),
    middle_name VARCHAR(255),
    last_name VARCHAR(255),
    mobile VARCHAR(100),
    email VARCHAR(255),
    designation_id INTEGER REFERENCES designations(id) ON DELETE SET NULL,
    office_name VARCHAR(150),
    gender VARCHAR(50),
    dob DATE,
    address TEXT,
    pincode VARCHAR(100),
    district_id INTEGER REFERENCES districts(id) ON DELETE SET NULL,
    block_id INTEGER REFERENCES blocks(id) ON DELETE SET NULL,
    panchayat_id INTEGER REFERENCES panchayats(id) ON DELETE SET NULL,
    municipality_id INTEGER REFERENCES municipalities(id) ON DELETE SET NULL,
    ward_id INTEGER REFERENCES wards(id) ON DELETE SET NULL,
    created_by_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attach_user (
    id BIGSERIAL PRIMARY KEY,
    parent_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    child_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_attached BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_parent_child UNIQUE (parent_user_id, child_user_id)
);

CREATE TABLE user_extra_data (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    data_key VARCHAR(100) NOT NULL,
    data_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_key_per_user UNIQUE (user_id, data_key)
);

-- ==========================================
-- 4. GRIEVANCE MANAGEMENT TABLES
-- ==========================================

CREATE TABLE grievance_master (
    id BIGSERIAL PRIMARY KEY,
    uniq_id VARCHAR(50) NOT NULL UNIQUE,
    submitted_by_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    description TEXT NOT NULL,
    latitude VARCHAR(50),
    longitude VARCHAR(50),
    origin VARCHAR(50) DEFAULT 'JKSAMADHAN' NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE RESTRICT,
    sub_cat_l1_id INTEGER REFERENCES subcategory_level1(id) ON DELETE RESTRICT,
    sub_cat_l2_id INTEGER REFERENCES subcategory_level2(id) ON DELETE RESTRICT,
    sub_cat_l3_id INTEGER REFERENCES subcategory_level3(id) ON DELETE RESTRICT,
    sub_cat_l4_id INTEGER REFERENCES subcategory_level4(id) ON DELETE RESTRICT,
    district_id INTEGER NOT NULL REFERENCES districts(id) ON DELETE RESTRICT,
    block_id INTEGER REFERENCES blocks(id) ON DELETE RESTRICT,
    panchayat_id INTEGER REFERENCES panchayats(id) ON DELETE RESTRICT,
    municipality_id INTEGER REFERENCES municipalities(id) ON DELETE RESTRICT,
    ward_id INTEGER REFERENCES wards(id) ON DELETE RESTRICT,
    status VARCHAR(50) NOT NULL DEFAULT 'Registered',
    final_status VARCHAR(50) DEFAULT 'Submitted',
    key_flag VARCHAR(20) DEFAULT 'Normal',
    psga VARCHAR(20) DEFAULT 'NA',
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    file_type VARCHAR(50),
    second_file_name VARCHAR(255),
    second_file_path VARCHAR(500),
    second_file_type VARCHAR(50),
    ack_slip_name VARCHAR(255),
    ack_slip_path VARCHAR(500),
    cpgram_reg_no VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE assigned_users (
    id BIGSERIAL PRIMARY KEY,
    grievance_id BIGINT NOT NULL REFERENCES grievance_master(id) ON DELETE CASCADE,
    assigned_to_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    assigned_by_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    action VARCHAR(50),
    remark TEXT,
    reminder_in_days INTEGER DEFAULT 28,
    enabled BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE grievance_history (
    id BIGSERIAL PRIMARY KEY,
    grievance_id BIGINT NOT NULL REFERENCES grievance_master(id) ON DELETE CASCADE,
    action_taken VARCHAR(500) NOT NULL,
    pre_status VARCHAR(50),
    status VARCHAR(50),
    remarks TEXT,
    action_taken_by_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE grievance_extra_data (
    id BIGSERIAL PRIMARY KEY,
    grievance_id BIGINT NOT NULL REFERENCES grievance_master(id) ON DELETE CASCADE,
    data_key VARCHAR(100) NOT NULL,
    data_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_key_per_grievance UNIQUE (grievance_id, data_key)
);

CREATE TABLE ai_similarity_found (
    id BIGSERIAL PRIMARY KEY,
    grievance_id BIGINT NOT NULL REFERENCES grievance_master(id) ON DELETE CASCADE,
    similarity_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE check_status (
    id BIGSERIAL PRIMARY KEY,
    apk_version VARCHAR(50),
    feedback VARCHAR(255),
    feedback_description TEXT,
    record_inserted_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    record_inserted_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    grievance_id BIGINT REFERENCES grievance_master(id) ON DELETE CASCADE
);

-- ==========================================
-- 5. APPEALS MANAGEMENT TABLES
-- ==========================================

CREATE TABLE appeal_master (
    id BIGSERIAL PRIMARY KEY,
    appeal_uniq_id VARCHAR(50) NOT NULL UNIQUE,
    grievance_id BIGINT NOT NULL REFERENCES grievance_master(id) ON DELETE RESTRICT,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    appealed_to_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    resolved_by_user_id BIGINT REFERENCES users(id) ON DELETE RESTRICT,
    submitted_by_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE appeal_assign_user (
    id BIGSERIAL PRIMARY KEY,
    appeal_id BIGINT NOT NULL REFERENCES appeal_master(id) ON DELETE CASCADE,
    assigned_to_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    assigned_by_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    action VARCHAR(100),
    remark TEXT,
    enabled BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 6. SATISFACTION FEEDBACK TABLES
-- ==========================================

CREATE TABLE feedback (
    id BIGSERIAL PRIMARY KEY,
    grievance_id BIGINT NOT NULL REFERENCES grievance_master(id) ON DELETE CASCADE,
    satisfied VARCHAR(50),
    description TEXT,
    call_received VARCHAR(50),
    overall_experience VARCHAR(50),
    poor_reason TEXT,
    time_satisfaction VARCHAR(50),
    reuse_portal VARCHAR(50),
    rating1 INTEGER,
    rating2 INTEGER,
    feedback_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 7. CPGRAMS INTEGRATION TABLES (ISOLATED - UNCONSTRAINED VARCHARS)
-- ==========================================

CREATE TABLE cpgram_grievance_master (
    id SERIAL PRIMARY KEY,
    aadhaar VARCHAR,
    additional_info1 VARCHAR,
    additional_info2 VARCHAR,
    additional_info3 VARCHAR,
    address1 VARCHAR,
    address2 VARCHAR,
    address3 VARCHAR,
    attach_doc VARCHAR,
    category VARCHAR,
    country VARCHAR,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    date_of_receipt VARCHAR,
    depdocument VARCHAR,
    dept_file_name VARCHAR,
    district VARCHAR,
    dm_pertain INTEGER,
    doesnotpertain_status VARCHAR,
    email_address VARCHAR,
    file_name VARCHAR,
    file_path VARCHAR,
    final_status VARCHAR,
    flag VARCHAR,
    forwarded_department VARCHAR,
    forwarded_flag VARCHAR,
    from_org_code VARCHAR,
    from_org_name VARCHAR,
    gender VARCHAR,
    language VARCHAR,
    letter_date VARCHAR,
    letter_no VARCHAR,
    mobile_no VARCHAR,
    name VARCHAR,
    nodal_officer VARCHAR,
    nodal_officer_designation VARCHAR,
    origin VARCHAR DEFAULT 'CPGRAM' NOT NULL,
    phone_no VARCHAR,
    pincode VARCHAR,
    rcsrno VARCHAR,
    registration_no VARCHAR UNIQUE,
    remark TEXT,
    state VARCHAR,
    status VARCHAR,
    subject_content TEXT,
    trtu VARCHAR,
    type_of_reminder_clarification VARCHAR,
    updated_by VARCHAR,
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedbyid BIGINT,
    userid BIGINT
);

CREATE TABLE cpgram_case_close_grievances (
    id SERIAL PRIMARY KEY,
    currentstatus VARCHAR,
    dateofaction VARCHAR,
    dateofreceipt VARCHAR,
    grievancedetails TEXT,
    grievancedocument VARCHAR,
    name VARCHAR,
    officeraddress TEXT,
    officerdesignation VARCHAR,
    officeremail VARCHAR,
    officername VARCHAR,
    officerphone VARCHAR,
    rating VARCHAR,
    ratintext TEXT,
    reason TEXT,
    receivingorg VARCHAR,
    registrationnumber VARCHAR REFERENCES cpgram_grievance_master(registration_no) ON DELETE CASCADE,
    remark TEXT,
    replydocument VARCHAR,
    toorg VARCHAR
);

CREATE TABLE cpgram_result_status (
    id SERIAL PRIMARY KEY,
    cpgramresponse TEXT,
    registration_no VARCHAR REFERENCES cpgram_grievance_master(registration_no) ON DELETE CASCADE,
    status VARCHAR
);

-- ==========================================
-- 8. PERFORMANCE & AUDIT INDEXES
-- ==========================================

CREATE INDEX idx_gm_uniq_id ON grievance_master(uniq_id);
CREATE INDEX idx_gm_status_final ON grievance_master(status, final_status);
CREATE INDEX idx_gm_origin ON grievance_master(origin);
CREATE INDEX idx_gm_location ON grievance_master(district_id, block_id, panchayat_id);
CREATE INDEX idx_assigned_users_grievance ON assigned_users(grievance_id);
CREATE INDEX idx_assigned_users_assignee ON assigned_users(assigned_to_user_id);
CREATE INDEX idx_assigned_users_created ON assigned_users(created_at DESC);
CREATE INDEX idx_grievance_history_grievance ON grievance_history(grievance_id);
CREATE INDEX idx_grievance_history_date ON grievance_history(created_at DESC);
CREATE INDEX idx_cpgram_reg_no ON cpgram_grievance_master(registration_no);
CREATE INDEX idx_cpgram_status ON cpgram_grievance_master(status);

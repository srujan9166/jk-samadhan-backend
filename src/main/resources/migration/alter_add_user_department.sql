-- ==========================================
-- 3NF ALTER MIGRATION: ADD DIRECT DEPARTMENT_ID TO USERS
-- ==========================================

-- 1. Add direct department_id column to users table
ALTER TABLE jks_3nf.users 
ADD COLUMN IF NOT EXISTS department_id INTEGER REFERENCES jks_3nf.departments(id) ON DELETE SET NULL;

-- 2. Populate department_id in jks_3nf.users from legacy_users
UPDATE jks_3nf.users u
SET department_id = d.id
FROM public.legacy_users lu
JOIN jks_3nf.departments d ON UPPER(TRIM(d.name)) = UPPER(TRIM(lu.department))
WHERE u.id = lu.id;

-- 3. Index the department_id column for fast query execution
CREATE INDEX IF NOT EXISTS idx_users_department ON jks_3nf.users(department_id);

-- 4. Recreate compatibility view public.users to expose department_id and department name
CREATE OR REPLACE VIEW public.users AS
SELECT 
    u.id,
    u.uuid::varchar,
    u.username,
    u.password,
    CASE WHEN u.enabled THEN 1 ELSE 0 END as enabled,
    ut.type_name as user_type,
    u.first_name,
    u.middle_name,
    u.last_name,
    u.mobile,
    u.email,
    desig.name as designation,
    u.office_name,
    u.gender,
    u.dob::varchar as date_of_birth,
    u.address,
    u.pincode,
    dist.name as district,
    blk.name as block,
    panch.name as panchayat,
    mun.name as municipality,
    ward.name as ward,
    u.created_by_id::varchar as createdbyid,
    u.created_at as created_date,
    u.updated_at as updated_date,
    s.name as state,
    u.department_id,
    dept.name as department
FROM jks_3nf.users u
LEFT JOIN jks_3nf.states s ON s.id = u.state_id
LEFT JOIN jks_3nf.departments dept ON dept.id = u.department_id
LEFT JOIN jks_3nf.user_types ut ON ut.id = u.user_type_id
LEFT JOIN jks_3nf.designations desig ON desig.id = u.designation_id
LEFT JOIN jks_3nf.districts dist ON dist.id = u.district_id
LEFT JOIN jks_3nf.blocks blk ON blk.id = u.block_id
LEFT JOIN jks_3nf.panchayats panch ON panch.id = u.panchayat_id
LEFT JOIN jks_3nf.municipalities mun ON mun.id = u.municipality_id
LEFT JOIN jks_3nf.wards ward ON ward.id = u.ward_id;

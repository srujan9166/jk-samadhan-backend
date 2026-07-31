-- ==========================================
-- FIX USER TYPES & MAP OFFICER ROLES
-- ==========================================

-- 1. Populate user_types with Spring Security Roles
INSERT INTO jks_3nf.user_types (type_name, user_level) VALUES
('ROLE_SuperAdmin', 1),
('ROLE_Admin', 2),
('ROLE_Secretary', 3),
('ROLE_Department', 4),
('ROLE_DM', 5),
('ROLE_DealingHand', 6),
('ROLE_Appellate', 7),
('ROLE_Individual', 0)
ON CONFLICT (type_name) DO NOTHING;

-- 2. Update user_type_id in jks_3nf.users from legacy_users
UPDATE jks_3nf.users u
SET user_type_id = ut.id
FROM public.legacy_users lu
JOIN jks_3nf.user_types ut ON UPPER(TRIM(ut.type_name)) = UPPER(TRIM(lu.user_type))
WHERE u.id = lu.id;

-- 3. Update public.users compatibility view to display role
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

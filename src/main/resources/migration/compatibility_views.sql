-- Database View Adapters for JKSamadhan Legacy Application Compatibility

-- 1. users
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
    u.updated_at as updated_date
FROM jks_3nf.users u
LEFT JOIN jks_3nf.user_types ut ON ut.id = u.user_type_id
LEFT JOIN jks_3nf.designations desig ON desig.id = u.designation_id
LEFT JOIN jks_3nf.districts dist ON dist.id = u.district_id
LEFT JOIN jks_3nf.blocks blk ON blk.id = u.block_id
LEFT JOIN jks_3nf.panchayats panch ON panch.id = u.panchayat_id
LEFT JOIN jks_3nf.municipalities mun ON mun.id = u.municipality_id
LEFT JOIN jks_3nf.wards ward ON ward.id = u.ward_id;

-- 2. grievance_master
CREATE OR REPLACE VIEW public.grievance_master AS
SELECT 
    gm.id,
    gm.uniq_id as uniqid,
    gm.submitted_by_user_id as userid,
    gm.description,
    gm.latitude,
    gm.longitude,
    gm.origin,
    cat.name as category,
    sub1.name as sub_category,
    sub2.name as sub_cat_next_level2,
    sub3.name as sub_cat_next_level3,
    sub4.name as sub_cat_next_level4,
    dist.name as district,
    gm.district_id as dist_id,
    gm.block_id,
    gm.panchayat_id,
    gm.municipality_id,
    gm.ward_id,
    gm.status,
    gm.final_status,
    gm.key_flag,
    gm.psga,
    gm.file_name,
    gm.file_path,
    gm.file_type as first_file_type,
    gm.second_file_name,
    gm.second_file_path,
    gm.second_file_type,
    gm.ack_slip_name,
    gm.ack_slip_path,
    gm.cpgram_reg_no,
    gm.created_at as createddate,
    gm.updated_at as updated_on,
    u_up.username as updated_by
FROM jks_3nf.grievance_master gm
LEFT JOIN jks_3nf.categories cat ON cat.id = gm.category_id
LEFT JOIN jks_3nf.subcategory_level1 sub1 ON sub1.id = gm.sub_cat_l1_id
LEFT JOIN jks_3nf.subcategory_level2 sub2 ON sub2.id = gm.sub_cat_l2_id
LEFT JOIN jks_3nf.subcategory_level3 sub3 ON sub3.id = gm.sub_cat_l3_id
LEFT JOIN jks_3nf.subcategory_level4 sub4 ON sub4.id = gm.sub_cat_l4_id
LEFT JOIN jks_3nf.districts dist ON dist.id = gm.district_id
LEFT JOIN jks_3nf.users u_up ON u_up.id = gm.updated_by_user_id;

-- 3. assigned_users
CREATE OR REPLACE VIEW public.assigned_users AS
SELECT 
    au.id,
    gm.uniq_id as grievance_id,
    u_to.username as assigned_to,
    u_by.username as created_by,
    au.action,
    au.remark as rmark,
    au.reminder_in_days as reminderindays,
    CASE WHEN au.enabled THEN 1 ELSE 0 END as enabled,
    au.created_at as created_date,
    au.updated_at as updated_date
FROM jks_3nf.assigned_users au
JOIN jks_3nf.grievance_master gm ON gm.id = au.grievance_id
LEFT JOIN jks_3nf.users u_to ON u_to.id = au.assigned_to_user_id
LEFT JOIN jks_3nf.users u_by ON u_by.id = au.assigned_by_user_id;

-- 4. grievance_history
CREATE OR REPLACE VIEW public.grievance_history AS
SELECT 
    gh.id,
    gm.uniq_id as uniqid,
    gh.action_taken,
    gh.pre_status,
    gh.status,
    gh.remarks,
    u_by.username as action_taken_by,
    gh.file_name,
    gh.file_path,
    gh.created_at as createddate
FROM jks_3nf.grievance_history gh
JOIN jks_3nf.grievance_master gm ON gm.id = gh.grievance_id
LEFT JOIN jks_3nf.users u_by ON u_by.id = gh.action_taken_by_user_id;

-- 5. feedback_data
CREATE OR REPLACE VIEW public.feedback_data AS
SELECT 
    fb.id,
    gm.uniq_id as uniqid,
    fb.satisfied,
    fb.description,
    fb.call_received,
    fb.overall_experience as grv_process,
    fb.poor_reason as reccomendation,
    fb.time_satisfaction,
    fb.reuse_portal,
    fb.rating1,
    fb.rating2,
    fb.feedback_score as feedbackscore,
    fb.created_at as createddate
FROM jks_3nf.feedback fb
JOIN jks_3nf.grievance_master gm ON gm.id = fb.grievance_id;

-- 6. attach_user
CREATE OR REPLACE VIEW public.attach_user AS
SELECT 
    au.id,
    u_parent.username as created_by,
    u_child.username,
    CASE WHEN au.is_attached THEN 'true' ELSE 'false' END as attached,
    au.created_at as created_date,
    au.updated_at as updated_date
FROM jks_3nf.attach_user au
JOIN jks_3nf.users u_parent ON u_parent.id = au.parent_user_id
JOIN jks_3nf.users u_child ON u_child.id = au.child_user_id;

-- 7. appeal_master
CREATE OR REPLACE VIEW public.appeal_master AS
SELECT 
    am.id,
    am.appeal_uniq_id as appeal_id,
    gm.uniq_id as grievance_id,
    am.description,
    am.status,
    am.file_name,
    am.file_path,
    u_to.username as appealed_to,
    u_res.username as resolved_by,
    u_sub.id as submittedbyuserid,
    u_sub.mobile,
    u_sub.first_name as name,
    u_sub.address,
    am.created_at as createddate,
    am.created_at as created_date
FROM jks_3nf.appeal_master am
JOIN jks_3nf.grievance_master gm ON gm.id = am.grievance_id
LEFT JOIN jks_3nf.users u_to ON u_to.id = am.appealed_to_user_id
LEFT JOIN jks_3nf.users u_res ON u_res.id = am.resolved_by_user_id
LEFT JOIN jks_3nf.users u_sub ON u_sub.id = am.submitted_by_user_id;

-- 8. appeal_assign_user
CREATE OR REPLACE VIEW public.appeal_assign_user AS
SELECT 
    aau.id,
    am.appeal_uniq_id as appeal_id,
    u_to.username as assigned_to,
    u_by.username as created_by,
    aau.action,
    aau.remark,
    CASE WHEN aau.enabled THEN 1 ELSE 0 END as enabled,
    aau.created_at as created_date
FROM jks_3nf.appeal_assign_user aau
JOIN jks_3nf.appeal_master am ON am.id = aau.appeal_id
LEFT JOIN jks_3nf.users u_to ON u_to.id = aau.assigned_to_user_id
LEFT JOIN jks_3nf.users u_by ON u_by.id = aau.assigned_by_user_id;

-- 9. masterdata (Unified View for dashboard)
CREATE OR REPLACE VIEW public.masterdata AS
WITH filtered_records AS (
    SELECT au.*
    FROM jks_3nf.assigned_users au
),
ranked_records AS (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY grievance_id ORDER BY created_at DESC) AS rn
    FROM filtered_records
),
latest_records AS (
    SELECT * FROM ranked_records WHERE rn = 1
)
SELECT gm.uniq_id AS uniqid,
       gm.created_at AS createddate,
       gm.updated_at AS actiondate,
       au.created_at AS assigneddate,
       dept.name AS department,
       COALESCE(cat.name, 'NA') AS category,
       COALESCE(sub1.name, 'NA') AS sub_category,
       TRIM(BOTH FROM u_sub.first_name) AS submittedby,
       gm.status,
       COALESCE(gm.final_status, 'NA') AS final_status,
       gm.origin,
       'UT' AS dm_division,
       COALESCE(dist.name, 'NA') AS dm_district,
       gm.district_id AS dist_id,
       gm.municipality_id,
       gm.block_id,
       gm.panchayat_id,
       gm.ward_id,
       COALESCE(au.reminder_in_days, 28) AS aitracking,
       COALESCE(gm.key_flag, 'Normal') AS aiclassification,
       CASE WHEN au.reminder_in_days = 7 THEN 'Urgent' ELSE 'Normal' END AS privilegeassigned,
       COALESCE(au.action, 'Process') AS authorityassigned,
       COALESCE(gm.psga, 'NA') AS psga,
       'web' AS mode,
       COALESCE(u_by.username, 'NA') AS assignedby,
       COALESCE(u_to.username, 'NA') AS assignedto,
       COALESCE(u_up.username, 'NA') AS updatedby,
       COALESCE(u_up.first_name, 'NA') AS actiontakenby,
       COALESCE(u_up.office_name, 'NA') AS actionbyofficename,
       'NA' AS actionbyuserlevel,
       'NA' AS actionbyusertype,
       COALESCE(au.action, 'NA') AS action,
       COALESCE(gm.final_status, 'NA') AS aufinalstatus
FROM jks_3nf.grievance_master gm
LEFT JOIN latest_records au ON au.grievance_id = gm.id
LEFT JOIN jks_3nf.users u_sub ON u_sub.id = gm.submitted_by_user_id
LEFT JOIN jks_3nf.users u_to ON u_to.id = au.assigned_to_user_id
LEFT JOIN jks_3nf.users u_by ON u_by.id = au.assigned_by_user_id
LEFT JOIN jks_3nf.users u_up ON u_up.id = gm.updated_by_user_id
LEFT JOIN jks_3nf.categories cat ON cat.id = gm.category_id
LEFT JOIN jks_3nf.departments dept ON dept.id = cat.department_id
LEFT JOIN jks_3nf.subcategory_level1 sub1 ON sub1.id = gm.sub_cat_l1_id
LEFT JOIN jks_3nf.districts dist ON dist.id = gm.district_id

UNION ALL

SELECT cpgm.registration_no AS uniqid,
       cpgm.created_date AS createddate,
       cpgm.updated_date AS actiondate,
       NULL::timestamp as assigneddate,
       COALESCE(cpgm.forwarded_department, 'DOPG') AS department,
       COALESCE(cpgm.category, 'NA') AS category,
       'NA' AS sub_category,
       TRIM(BOTH FROM cpgm.name) AS submittedby,
       cpgm.status,
       COALESCE(cpgm.final_status, 'NA') AS final_status,
       cpgm.origin,
       'UT' AS dm_division,
       cpgm.district AS dm_district,
       0 AS dist_id,
       0 AS municipality_id,
       0 AS block_id,
       0 AS panchayat_id,
       0 AS ward_id,
       28 AS aitracking,
       'Normal' AS aiclassification,
       'Normal' AS privilegeassigned,
       'Process' AS authorityassigned,
       'NA' AS psga,
       'web' AS mode,
       'NA' AS assignedby,
       COALESCE(cpgm.nodal_officer, 'NA') AS assignedto,
       COALESCE(cpgm.updated_by, 'NA') AS updatedby,
       COALESCE(cpgm.nodal_officer, 'NA') AS actiontakenby,
       'NA' AS actionbyofficename,
       'NA' AS actionbyuserlevel,
       'NA' AS actionbyusertype,
       'NA' AS action,
       COALESCE(cpgm.final_status, 'NA') AS aufinalstatus
FROM jks_3nf.cpgram_grievance_master cpgm;

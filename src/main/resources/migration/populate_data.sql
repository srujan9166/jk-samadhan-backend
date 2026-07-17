-- ==========================================
-- 3NF SCHEMA DATA MIGRATION & TRANSFORM SCRIPT (OPTIMIZED JOINS)
-- ==========================================

-- Set Search Path to target the jks_3nf schema namespace first
SET search_path TO jks_3nf, public;
SET enable_mergejoin = off;
SET enable_nestloop = off;
SET synchronous_commit = off;
SET work_mem = '256MB';
SET maintenance_work_mem = '512MB';

-- 1. divisions
INSERT INTO divisions (id, name)
SELECT DISTINCT id, UPPER(TRIM(division))
FROM public.legacy_division_master
WHERE division IS NOT NULL AND division != ''
ON CONFLICT (id) DO NOTHING;

SELECT setval('divisions_id_seq', COALESCE((SELECT MAX(id) FROM divisions), 1));

-- 2. districts
INSERT INTO districts (id, name, division_id, lgd_code)
SELECT DISTINCT ON (dm.id)
    dm.id,
    TRIM(dm.district_name),
    (SELECT id FROM divisions WHERE name = UPPER(TRIM(dm.division_name)) LIMIT 1),
    district_code
FROM public.legacy_district_master dm
WHERE dm.district_name IS NOT NULL AND dm.district_name != ''
ON CONFLICT (id) DO NOTHING;

SELECT setval('districts_id_seq', COALESCE((SELECT MAX(id) FROM districts), 1));

-- 3. blocks
INSERT INTO blocks (id, name, district_id)
SELECT DISTINCT ON (bm.id)
    bm.id,
    TRIM(bm.block_name),
    (SELECT id FROM districts WHERE UPPER(name) = UPPER(TRIM(bm.district_name)) LIMIT 1)
FROM public.legacy_block_master bm
WHERE bm.block_name IS NOT NULL AND bm.block_name != ''
ON CONFLICT (id) DO NOTHING;

SELECT setval('blocks_id_seq', COALESCE((SELECT MAX(id) FROM blocks), 1));

-- 4. panchayats
INSERT INTO panchayats (id, name, block_id)
SELECT DISTINCT ON (pm.id)
    pm.id,
    TRIM(pm.halqa_panchayat_name),
    (SELECT id FROM blocks WHERE UPPER(name) = UPPER(TRIM(pm.block_name)) LIMIT 1)
FROM public.legacy_panchayat_master pm
WHERE pm.halqa_panchayat_name IS NOT NULL AND pm.halqa_panchayat_name != ''
ON CONFLICT (id) DO NOTHING;

SELECT setval('panchayats_id_seq', COALESCE((SELECT MAX(id) FROM panchayats), 1));

-- 5. municipalities
INSERT INTO municipalities (id, name, district_id)
SELECT DISTINCT ON (mm.id)
    mm.id,
    TRIM(mm.ulb_name),
    (SELECT id FROM districts WHERE UPPER(name) = UPPER(TRIM(mm.district_name)) LIMIT 1)
FROM public.legacy_municipality_master mm
WHERE mm.ulb_name IS NOT NULL AND mm.ulb_name != ''
ON CONFLICT (id) DO NOTHING;

SELECT setval('municipalities_id_seq', COALESCE((SELECT MAX(id) FROM municipalities), 1));

-- 6. wards
INSERT INTO wards (id, name, municipality_id)
SELECT DISTINCT ON (wm.id)
    wm.id,
    TRIM(wm.ward_name),
    (SELECT id FROM municipalities WHERE UPPER(name) = UPPER(TRIM(wm.ulb_name)) LIMIT 1)
FROM public.legacy_ward_master wm
WHERE wm.ward_name IS NOT NULL AND wm.ward_name != ''
ON CONFLICT (id) DO NOTHING;

SELECT setval('wards_id_seq', COALESCE((SELECT MAX(id) FROM wards), 1));

-- 7. departments
INSERT INTO departments (name, type)
SELECT DISTINCT TRIM(department_name), 
       CASE WHEN department_type = 'Administrative' THEN 'Administrative' ELSE 'Line Department' END
FROM public.legacy_department_master
WHERE department_name IS NOT NULL AND department_name != '';

SELECT setval('departments_id_seq', COALESCE((SELECT MAX(id) FROM departments), 1));

-- 8. categories
INSERT INTO categories (name, department_id, reminder_days)
SELECT DISTINCT ON (category_name, dept_id)
    category_name, dept_id, reminder_days
FROM (
    SELECT 
        TRIM(category_name) AS category_name,
        (SELECT id FROM departments WHERE name = TRIM(cm.department_name) LIMIT 1) AS dept_id,
        COALESCE(CAST(reminderindays AS INTEGER), 28) AS reminder_days
    FROM public.legacy_category_master cm
    WHERE category_name IS NOT NULL AND category_name != ''
) sub
WHERE dept_id IS NOT NULL;

SELECT setval('categories_id_seq', COALESCE((SELECT MAX(id) FROM categories), 1));

-- 9. subcategory_level1
INSERT INTO subcategory_level1 (name, category_id)
SELECT DISTINCT ON (sub_category_name, cat_id)
    sub_category_name, cat_id
FROM (
    SELECT 
        TRIM(sub_category_name) AS sub_category_name,
        (SELECT id FROM categories WHERE name = TRIM(scm.category_name) LIMIT 1) AS cat_id
    FROM public.legacy_sub_category_master_level4 scm
    WHERE sub_category_name IS NOT NULL AND sub_category_name != ''
) sub
WHERE cat_id IS NOT NULL;

SELECT setval('subcategory_level1_id_seq', COALESCE((SELECT MAX(id) FROM subcategory_level1), 1));

-- 10. subcategory_level2
INSERT INTO subcategory_level2 (name, parent_l1_id)
SELECT DISTINCT ON (sub_category_level2_name, l1_id)
    sub_category_level2_name, l1_id
FROM (
    SELECT 
        TRIM(sub_category_level2_name) AS sub_category_level2_name,
        (SELECT id FROM subcategory_level1 WHERE name = TRIM(scm.sub_category_name) AND category_id = (SELECT id FROM categories WHERE name = TRIM(scm.category_name) LIMIT 1) LIMIT 1) AS l1_id
    FROM public.legacy_sub_category_master_level4 scm
    WHERE sub_category_level2_name IS NOT NULL AND sub_category_level2_name != ''
) sub
WHERE l1_id IS NOT NULL;

SELECT setval('subcategory_level2_id_seq', COALESCE((SELECT MAX(id) FROM subcategory_level2), 1));

-- 11. subcategory_level3
INSERT INTO subcategory_level3 (name, parent_l2_id)
SELECT DISTINCT ON (sub_category_level3_name, l2_id)
    sub_category_level3_name, l2_id
FROM (
    SELECT 
        TRIM(sub_category_level3_name) AS sub_category_level3_name,
        (SELECT id FROM subcategory_level2 WHERE name = TRIM(scm.sub_category_level2_name) AND parent_l1_id = (SELECT id FROM subcategory_level1 WHERE name = TRIM(scm.sub_category_name) AND category_id = (SELECT id FROM categories WHERE name = TRIM(scm.category_name) LIMIT 1) LIMIT 1) LIMIT 1) AS l2_id
    FROM public.legacy_sub_category_master_level4 scm
    WHERE sub_category_level3_name IS NOT NULL AND sub_category_level3_name != ''
) sub
WHERE l2_id IS NOT NULL;

SELECT setval('subcategory_level3_id_seq', COALESCE((SELECT MAX(id) FROM subcategory_level3), 1));

-- 12. subcategory_level4
INSERT INTO subcategory_level4 (name, parent_l3_id)
SELECT DISTINCT ON (sub_category_level4_name, l3_id)
    sub_category_level4_name, l3_id
FROM (
    SELECT 
        TRIM(sub_category_level4_name) AS sub_category_level4_name,
        (SELECT id FROM subcategory_level3 WHERE name = TRIM(scm.sub_category_level3_name) AND parent_l2_id = (SELECT id FROM subcategory_level2 WHERE name = TRIM(scm.sub_category_level2_name) AND parent_l1_id = (SELECT id FROM subcategory_level1 WHERE name = TRIM(scm.sub_category_name) AND category_id = (SELECT id FROM categories WHERE name = TRIM(scm.category_name) LIMIT 1) LIMIT 1) LIMIT 1) LIMIT 1) AS l3_id
    FROM public.legacy_sub_category_master_level4 scm
    WHERE sub_category_level4_name IS NOT NULL AND sub_category_level4_name != ''
) sub
WHERE l3_id IS NOT NULL;

SELECT setval('subcategory_level4_id_seq', COALESCE((SELECT MAX(id) FROM subcategory_level4), 1));

-- 13. designations
INSERT INTO designations (name)
SELECT DISTINCT TRIM(designation)
FROM public.legacy_users
WHERE designation IS NOT NULL AND designation != ''
UNION
SELECT DISTINCT TRIM(designation)
FROM public.legacy_designations_of_users
WHERE designation IS NOT NULL AND designation != ''
ON CONFLICT (name) DO NOTHING;

SELECT setval('designations_id_seq', COALESCE((SELECT MAX(id) FROM designations), 1));

-- 14. user_types
INSERT INTO user_types (type_name, user_level, department_id)
SELECT DISTINCT ON (type_name)
    type_name, usr_level, dept_id
FROM (
    SELECT 
        TRIM(user_type) AS type_name,
        COALESCE(CASE WHEN level ~ '^\d+$' THEN CAST(level AS INTEGER) ELSE NULL END, 0) AS usr_level,
        (SELECT id FROM departments WHERE name = TRIM(department) LIMIT 1) AS dept_id
    FROM public.legacy_designations_of_users
    WHERE user_type IS NOT NULL AND user_type != ''
) sub
ON CONFLICT (type_name) DO NOTHING;

INSERT INTO user_types (type_name, user_level)
VALUES ('ROLE_Individual', 0)
ON CONFLICT (type_name) DO NOTHING;

SELECT setval('user_types_id_seq', COALESCE((SELECT MAX(id) FROM user_types), 1));

-- 15. users (Admin & Nodal Staff Users)
INSERT INTO users (
    id, uuid, username, password, enabled, user_type_id, first_name, middle_name, last_name, 
    mobile, email, designation_id, office_name, gender, dob, address, pincode, 
    district_id, block_id, panchayat_id, municipality_id, ward_id, created_by_id, created_at, updated_at
)
SELECT 
    lu.id,
    COALESCE(lu.uuid, gen_random_uuid()),
    lu.username,
    lu.password,
    CASE WHEN lu.enabled = 1 THEN TRUE ELSE FALSE END,
    COALESCE(ut.id, ut_indiv.id),
    lu.first_name,
    lu.middle_name,
    lu.last_name,
    lu.mobile,
    lu.email,
    desig.id,
    lu.office_name,
    CASE 
        WHEN UPPER(TRIM(lu.gender)) = 'MALE' THEN 'Male'
        WHEN UPPER(TRIM(lu.gender)) = 'FEMALE' THEN 'Female'
        WHEN UPPER(TRIM(lu.gender)) IN ('TRANSGENDER', 'TRANS') THEN 'Transgender'
        WHEN lu.gender IS NOT NULL AND lu.gender != '' AND UPPER(TRIM(lu.gender)) != 'NA' THEN 'Other'
        ELSE NULL 
    END,
    CASE 
        WHEN lu.date_of_birth ~ '^\d{4}-\d{2}-\d{2}$' THEN CAST(lu.date_of_birth AS DATE) 
        WHEN lu.date_of_birth ~ '^\d{2}-\d{2}-\d{4}$' THEN TO_DATE(lu.date_of_birth, 'DD-MM-YYYY')
        ELSE NULL 
    END,
    lu.address,
    lu.pincode,
    dist.id,
    blk.id,
    panch.id,
    mun.id,
    ward.id,
    u_creator.id,
    COALESCE(lu.created_date, NOW()),
    NOW()
FROM public.legacy_users lu
LEFT JOIN user_types ut ON ut.type_name = lu.user_type
LEFT JOIN user_types ut_indiv ON ut_indiv.type_name = 'ROLE_Individual'
LEFT JOIN designations desig ON desig.name = lu.designation
LEFT JOIN districts dist ON UPPER(dist.name) = UPPER(TRIM(lu.district))
LEFT JOIN blocks blk ON UPPER(blk.name) = UPPER(TRIM(lu.block)) AND blk.district_id = dist.id
LEFT JOIN panchayats panch ON UPPER(panch.name) = UPPER(TRIM(lu.panchayat)) AND panch.block_id = blk.id
LEFT JOIN municipalities mun ON UPPER(mun.name) = UPPER(TRIM(lu.municipality)) AND mun.district_id = dist.id
LEFT JOIN wards ward ON UPPER(ward.name) = UPPER(TRIM(lu.ward)) AND ward.municipality_id = mun.id
LEFT JOIN public.legacy_users u_creator 
  ON u_creator.id = CASE WHEN TRIM(lu.createdbyid) ~ '^\d+$' AND TRIM(lu.createdbyid) != '0' THEN CAST(TRIM(lu.createdbyid) AS BIGINT) ELSE NULL END
ON CONFLICT (id) DO NOTHING;

SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1));

-- 16. Extract Citizens
INSERT INTO users (username, password, enabled, user_type_id, first_name, mobile, email, address, pincode, gender, created_at, updated_at)
SELECT DISTINCT ON (TRIM(gm.mobile))
    TRIM(gm.mobile),
    '$2a$12$Aq5nlR2TL5VUd0R65S6JWeyozYSXEJjA2jmVjni2B5POPiS/4k/72', 
    TRUE,
    (SELECT id FROM user_types WHERE type_name = 'ROLE_Individual' LIMIT 1),
    TRIM(gm.name),
    TRIM(gm.mobile),
    TRIM(gm.email),
    TRIM(gm.address),
    TRIM(gm.pincode),
    CASE 
        WHEN UPPER(TRIM(gm.gender)) = 'MALE' THEN 'Male'
        WHEN UPPER(TRIM(gm.gender)) = 'FEMALE' THEN 'Female'
        WHEN UPPER(TRIM(gm.gender)) IN ('TRANSGENDER', 'TRANS') THEN 'Transgender'
        WHEN gm.gender IS NOT NULL AND gm.gender != '' AND UPPER(TRIM(gm.gender)) != 'NA' THEN 'Other'
        ELSE NULL 
    END,
    COALESCE(gm.createddate, NOW()),
    NOW()
FROM public.legacy_grievance_master gm
LEFT JOIN users u ON u.username = TRIM(gm.mobile)
WHERE gm.mobile IS NOT NULL AND gm.mobile != '' AND u.username IS NULL;

SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1));

-- 17. grievance_master
INSERT INTO grievance_master (
    id, uniq_id, submitted_by_user_id, description, latitude, longitude, origin, 
    category_id, sub_cat_l1_id, sub_cat_l2_id, sub_cat_l3_id, sub_cat_l4_id, 
    district_id, block_id, panchayat_id, municipality_id, ward_id, 
    status, final_status, key_flag, psga, file_name, file_path, file_type, 
    second_file_name, second_file_path, second_file_type, ack_slip_name, ack_slip_path, 
    cpgram_reg_no, created_at, updated_at, updated_by_user_id
)
SELECT 
    gm.id,
    gm.uniqid,
    COALESCE(u_by_id.id, u_by_mobile.id, 2),
    gm.description,
    gm.latitude,
    gm.longitude,
    COALESCE(UPPER(TRIM(gm.origin)), 'JKSAMADHAN'),
    cat.id,
    sub1.id,
    sub2.id,
    sub3.id,
    sub4.id,
    COALESCE(dist.id, 1),
    CASE WHEN EXISTS (SELECT 1 FROM blocks WHERE id = gm.block_id) THEN gm.block_id ELSE NULL END, 
    CASE WHEN EXISTS (SELECT 1 FROM panchayats WHERE id = gm.panchayat_id) THEN gm.panchayat_id ELSE NULL END,
    CASE WHEN EXISTS (SELECT 1 FROM municipalities WHERE id = gm.municipality_id) THEN gm.municipality_id ELSE NULL END,
    CASE WHEN EXISTS (SELECT 1 FROM wards WHERE id = gm.ward_id) THEN gm.ward_id ELSE NULL END,
    COALESCE(gm.status, 'Registered'),
    COALESCE(gm.final_status, 'Submitted'),
    COALESCE(gm.key_flag, 'Normal'),
    COALESCE(gm.psga, 'NA'),
    gm.file_name,
    gm.file_path,
    gm.first_file_type,
    gm.second_file_name,
    gm.second_file_path,
    gm.second_file_type,
    gm.ack_slip_name,
    gm.ack_slip_path,
    gm.cpgram_reg_no,
    COALESCE(gm.createddate, NOW()),
    COALESCE(gm.updated_on, NOW()),
    u_update.id
FROM public.legacy_grievance_master gm
LEFT JOIN users u_by_id ON u_by_id.id = gm.userid
LEFT JOIN users u_by_mobile ON u_by_mobile.username = TRIM(gm.mobile)
LEFT JOIN categories cat ON cat.name = TRIM(gm.category)
LEFT JOIN subcategory_level1 sub1 ON sub1.name = TRIM(gm.sub_category)
LEFT JOIN subcategory_level2 sub2 ON sub2.name = TRIM(gm.sub_cat_next_level2)
LEFT JOIN subcategory_level3 sub3 ON sub3.name = TRIM(gm.sub_cat_next_level3)
LEFT JOIN subcategory_level4 sub4 ON sub4.name = TRIM(gm.sub_cat_next_level4)
LEFT JOIN districts dist ON UPPER(dist.name) = UPPER(TRIM(gm.district))
LEFT JOIN users u_update ON u_update.username = TRIM(gm.updated_by)
ON CONFLICT (id) DO NOTHING;

SELECT setval('grievance_master_id_seq', COALESCE((SELECT MAX(id) FROM grievance_master), 1));

-- 18. assigned_users
INSERT INTO assigned_users (id, grievance_id, assigned_to_user_id, assigned_by_user_id, action, remark, reminder_in_days, enabled, created_at, updated_at)
SELECT 
    au.id,
    gm.id,
    COALESCE(u_to.id, 2),
    COALESCE(u_by.id, 2),
    au.action,
    au.rmark,
    COALESCE(CAST(au.reminderindays AS INTEGER), 28),
    CASE WHEN au.enabled = 1 THEN TRUE ELSE FALSE END,
    COALESCE(au.created_date, NOW()),
    NOW()
FROM public.legacy_assigned_users au
JOIN grievance_master gm ON gm.uniq_id = au.grievance_id
LEFT JOIN users u_to ON u_to.username = au.assigned_to
LEFT JOIN users u_by ON u_by.username = au.created_by
ON CONFLICT (id) DO NOTHING;

SELECT setval('assigned_users_id_seq', COALESCE((SELECT MAX(id) FROM assigned_users), 1));

-- 19. grievance_history
INSERT INTO grievance_history (id, grievance_id, action_taken, pre_status, status, remarks, action_taken_by_user_id, file_name, file_path, created_at)
SELECT 
    gh.id,
    gm.id,
    COALESCE(gh.action_taken, 'Action'),
    gh.pre_status,
    gh.status,
    gh.remarks,
    COALESCE(u_by.id, 2),
    gh.file_name,
    gh.file_path,
    COALESCE(gh.createddate, NOW())
FROM public.legacy_grievance_history gh
JOIN grievance_master gm ON gm.uniq_id = gh.uniqid
LEFT JOIN users u_by ON u_by.username = gh.action_taken_by
ON CONFLICT (id) DO NOTHING;

SELECT setval('grievance_history_id_seq', COALESCE((SELECT MAX(id) FROM grievance_history), 1));

-- 20. feedback
INSERT INTO feedback (id, grievance_id, satisfied, description, call_received, overall_experience, poor_reason, time_satisfaction, reuse_portal, rating1, rating2, feedback_score, created_at)
SELECT 
    fb.id,
    gm.id,
    fb.satisfied,
    fb.description,
    fb.call_received,
    COALESCE(fb.grv_process, 'Good'),
    fb.reccomendation,
    fb.satisfied,
    fb.satisfied,
    fb.rating1,
    fb.rating2,
    fb.feedbackscore,
    COALESCE(fb.createddate, NOW())
FROM public.legacy_feedback_data fb
JOIN grievance_master gm ON gm.uniq_id = fb.uniqid
ON CONFLICT (id) DO NOTHING;

SELECT setval('feedback_id_seq', COALESCE((SELECT MAX(id) FROM feedback), 1));

-- 21. attach_user
INSERT INTO attach_user (id, parent_user_id, child_user_id, is_attached, created_at, updated_at)
SELECT DISTINCT ON (u_parent.id, u_child.id)
    au.id,
    COALESCE(u_parent.id, 2),
    u_child.id,
    CASE WHEN au.attached = 'true' OR au.attached = '1' THEN TRUE ELSE FALSE END,
    COALESCE(au.created_date, NOW()),
    COALESCE(au.updated_date, NOW())
FROM public.legacy_attach_user au
JOIN users u_child ON u_child.username = au.username
LEFT JOIN users u_parent ON u_parent.username = au.created_by
ON CONFLICT (parent_user_id, child_user_id) DO NOTHING;

SELECT setval('attach_user_id_seq', COALESCE((SELECT MAX(id) FROM attach_user), 1));

-- 22. ai_similarity_found
INSERT INTO ai_similarity_found (id, grievance_id, similarity_value, created_at)
SELECT 
    ai.id,
    gm.id,
    COALESCE(ai.value, '0.0'),
    COALESCE(ai.insertedon, NOW())
FROM public.legacy_ai_similarity_found ai
JOIN grievance_master gm ON gm.uniq_id = ai.uniqid
ON CONFLICT (id) DO NOTHING;

SELECT setval('ai_similarity_found_id_seq', COALESCE((SELECT MAX(id) FROM ai_similarity_found), 1));

-- 23. appeal_master
INSERT INTO appeal_master (id, appeal_uniq_id, grievance_id, description, status, file_name, file_path, appealed_to_user_id, resolved_by_user_id, submitted_by_user_id, created_at, updated_at)
SELECT 
    am.id,
    am.appeal_id,
    gm.id,
    am.description,
    am.status,
    am.file_name,
    am.file_path,
    COALESCE(u_to.id, 2),
    u_res.id,
    COALESCE(u_sub.id, u_sub_mob.id, 2),
    COALESCE(am.createddate, am.created_date, NOW()),
    NOW()
FROM public.legacy_appeal_master am
JOIN grievance_master gm ON gm.uniq_id = am.grievance_id
LEFT JOIN users u_to ON u_to.username = am.appealed_to
LEFT JOIN users u_res ON u_res.username = am.resolved_by
LEFT JOIN users u_sub ON u_sub.id = am.submittedbyuserid
LEFT JOIN users u_sub_mob ON u_sub_mob.username = TRIM(am.mobile)
ON CONFLICT (id) DO NOTHING;

SELECT setval('appeal_master_id_seq', COALESCE((SELECT MAX(id) FROM appeal_master), 1));

-- 24. appeal_assign_user
INSERT INTO appeal_assign_user (id, appeal_id, assigned_to_user_id, assigned_by_user_id, action, remark, enabled, created_at)
SELECT 
    aau.id,
    ap.id,
    COALESCE(u_to.id, 2),
    COALESCE(u_by.id, 2),
    aau.action,
    aau.remark,
    CASE WHEN aau.enabled = 1 THEN TRUE ELSE FALSE END,
    COALESCE(aau.created_date, NOW())
FROM public.legacy_appeal_assign_user aau
JOIN appeal_master ap ON ap.appeal_uniq_id = aau.appeal_id
LEFT JOIN users u_to ON u_to.username = aau.assigned_to
LEFT JOIN users u_by ON u_by.username = aau.created_by
ON CONFLICT (id) DO NOTHING;

SELECT setval('appeal_assign_user_id_seq', COALESCE((SELECT MAX(id) FROM appeal_assign_user), 1));

-- ==========================================
-- 25. CPGRAMS DATA MIGRATION BLOCKS
-- ==========================================

-- A. cpgram_grievance_master
INSERT INTO cpgram_grievance_master (
    id, aadhaar, additional_info1, additional_info2, additional_info3, address1, address2, address3, 
    attach_doc, category, country, created_date, date_of_receipt, depdocument, dept_file_name, 
    district, dm_pertain, doesnotpertain_status, email_address, file_name, file_path, final_status, 
    flag, forwarded_department, forwarded_flag, from_org_code, from_org_name, gender, language, 
    letter_date, letter_no, mobile_no, name, nodal_officer, nodal_officer_designation, origin, 
    phone_no, pincode, rcsrno, registration_no, remark, state, status, subject_content, 
    trtu, type_of_reminder_clarification, updated_by, updated_date, updatedbyid, userid
)
SELECT 
    id, aadhaar, additional_info1, additional_info2, additional_info3, address1, address2, address3, 
    attach_doc, category, country, COALESCE(created_date, NOW()), date_of_receipt, depdocument, dept_file_name, 
    district, dm_pertain, doesnotpertain_status, email_address, file_name, file_path, final_status, 
    flag, forwarded_department, forwarded_flag, from_org_code, from_org_name, gender, language, 
    letter_date, letter_no, mobile_no, name, nodal_officer, nodal_officer_designation, 
    COALESCE(UPPER(TRIM(origin)), 'CPGRAM'), 
    phone_no, pincode, rcsrno, registration_no, remark, state, status, subject_content, 
    trtu, type_of_reminder_clarification, updated_by, COALESCE(updated_date, NOW()), updatedbyid, userid
FROM public.legacy_cpgram_grievance_master
ON CONFLICT (registration_no) DO NOTHING;

SELECT setval('cpgram_grievance_master_id_seq', COALESCE((SELECT MAX(id) FROM cpgram_grievance_master), 1));

-- B. cpgram_case_close_grievances
INSERT INTO cpgram_case_close_grievances (
    id, currentstatus, dateofaction, dateofreceipt, grievancedetails, grievancedocument, name, 
    officeraddress, officerdesignation, officeremail, officername, officerphone, rating, 
    ratintext, reason, receivingorg, registrationnumber, remark, replydocument, toorg
)
SELECT DISTINCT ON (id)
    id, currentstatus, dateofaction, dateofreceipt, grievancedetails, grievancedocument, name, 
    officeraddress, officerdesignation, officeremail, officername, officerphone, rating, 
    ratintext, reason, receivingorg, registrationnumber, remark, replydocument, toorg
FROM public.legacy_cpgram_case_close_grievances
WHERE registrationnumber IN (SELECT registration_no FROM cpgram_grievance_master)
ON CONFLICT (id) DO NOTHING;

SELECT setval('cpgram_case_close_grievances_id_seq', COALESCE((SELECT MAX(id) FROM cpgram_case_close_grievances), 1));

-- C. cpgram_result_status
INSERT INTO cpgram_result_status (
    id, cpgramresponse, registration_no, status
)
SELECT DISTINCT ON (id)
    id, cpgramresponse, registration_no, status
FROM public.legacy_cpgram_result_status
WHERE registration_no IN (SELECT registration_no FROM cpgram_grievance_master)
ON CONFLICT (id) DO NOTHING;

SELECT setval('cpgram_result_status_id_seq', COALESCE((SELECT MAX(id) FROM cpgram_result_status), 1));

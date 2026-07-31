-- ==========================================
-- 3NF ALTER MIGRATION: IMPLEMENTING STATES TABLE
-- ==========================================

-- 1. Create states lookup table
CREATE TABLE IF NOT EXISTS jks_3nf.states (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    lgd_code INTEGER
);

-- 2. Insert standard India states & UTs
INSERT INTO jks_3nf.states (name) VALUES
('Jammu & Kashmir'),
('Ladakh'),
('Andaman & Nicobar Islands'),
('Andhra Pradesh'),
('Arunachal Pradesh'),
('Assam'),
('Bihar'),
('Chandigarh'),
('Chhattisgarh'),
('Dadra & Nagar Haveli and Daman & Diu'),
('Delhi'),
('Goa'),
('Gujarat'),
('Haryana'),
('Himachal Pradesh'),
('Jharkhand'),
('Karnataka'),
('Kerala'),
('Lakshadweep'),
('Madhya Pradesh'),
('Maharashtra'),
('Manipur'),
('Meghalaya'),
('Mizoram'),
('Nagaland'),
('Odisha'),
('Puducherry'),
('Punjab'),
('Rajasthan'),
('Sikkim'),
('Tamil Nadu'),
('Telangana'),
('Tripura'),
('Uttar Pradesh'),
('Uttarakhand'),
('West Bengal')
ON CONFLICT (name) DO NOTHING;

-- 3. Add state_id to divisions
ALTER TABLE jks_3nf.divisions ADD COLUMN IF NOT EXISTS state_id INTEGER REFERENCES jks_3nf.states(id) ON DELETE RESTRICT;

UPDATE jks_3nf.divisions
SET state_id = (SELECT id FROM jks_3nf.states WHERE name = 'Jammu & Kashmir' LIMIT 1)
WHERE state_id IS NULL;

-- 4. Add state_id to users
ALTER TABLE jks_3nf.users ADD COLUMN IF NOT EXISTS state_id INTEGER REFERENCES jks_3nf.states(id) ON DELETE RESTRICT;

-- 5. Dynamic block to safely migrate data if 'state' column exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'jks_3nf' 
          AND table_name = 'users' 
          AND column_name = 'state'
    ) THEN
        -- Link existing users by matching text name
        UPDATE jks_3nf.users u
        SET state_id = s.id
        FROM jks_3nf.states s
        WHERE u.state IS NOT NULL AND u.state != '' AND UPPER(TRIM(u.state)) = UPPER(TRIM(s.name));

        -- Insert any missing custom state names typed in users to prevent data loss
        INSERT INTO jks_3nf.states (name)
        SELECT DISTINCT TRIM(state) 
        FROM jks_3nf.users u
        WHERE u.state IS NOT NULL AND u.state != '' AND UPPER(TRIM(u.state)) NOT IN (SELECT UPPER(name) FROM jks_3nf.states)
        ON CONFLICT (name) DO NOTHING;

        -- Update again for custom states
        UPDATE jks_3nf.users u
        SET state_id = s.id
        FROM jks_3nf.states s
        WHERE u.state IS NOT NULL AND u.state != '' AND UPPER(TRIM(u.state)) = UPPER(TRIM(s.name)) AND u.state_id IS NULL;

        -- Drop legacy text column from physical users table
        ALTER TABLE jks_3nf.users DROP COLUMN state;
    END IF;
END $$;

-- 6. Fallback default state for null users to J&K
UPDATE jks_3nf.users
SET state_id = (SELECT id FROM jks_3nf.states WHERE name = 'Jammu & Kashmir' LIMIT 1)
WHERE state_id IS NULL;

-- 7. Recreate the public user compatibility view to resolve state reference using JOIN
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
    s.name as state
FROM jks_3nf.users u
LEFT JOIN jks_3nf.states s ON s.id = u.state_id
LEFT JOIN jks_3nf.user_types ut ON ut.id = u.user_type_id
LEFT JOIN jks_3nf.designations desig ON desig.id = u.designation_id
LEFT JOIN jks_3nf.districts dist ON dist.id = u.district_id
LEFT JOIN jks_3nf.blocks blk ON blk.id = u.block_id
LEFT JOIN jks_3nf.panchayats panch ON panch.id = u.panchayat_id
LEFT JOIN jks_3nf.municipalities mun ON mun.id = u.municipality_id
LEFT JOIN jks_3nf.wards ward ON ward.id = u.ward_id;

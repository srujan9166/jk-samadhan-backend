package com.example.jk_samadhan_backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class JkSamadhanBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(JkSamadhanBackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner initRmcRolesAndUsers(JdbcTemplate jdbcTemplate) {
		return args -> {
			try {
				// 1. Ensure ROLE_RAABITA_HEAD exists in jks_3nf.user_types
				jdbcTemplate.execute("""
					INSERT INTO jks_3nf.user_types (type_name)
					SELECT 'ROLE_RAABITA_HEAD'
					WHERE NOT EXISTS (
						SELECT 1 FROM jks_3nf.user_types WHERE type_name = 'ROLE_RAABITA_HEAD'
					);
				""");

				// 2. Ensure ROLE_DealingHand exists
				jdbcTemplate.execute("""
					INSERT INTO jks_3nf.user_types (type_name)
					SELECT 'ROLE_DealingHand'
					WHERE NOT EXISTS (
						SELECT 1 FROM jks_3nf.user_types WHERE type_name = 'ROLE_DealingHand'
					);
				""");

				// 3. Fix any user whose username/email contains 'rmc' or 'raabita'
				jdbcTemplate.execute("""
					UPDATE jks_3nf.users
					SET role = 'ROLE_RAABITA_HEAD',
					    user_type_id = (SELECT id FROM jks_3nf.user_types WHERE type_name = 'ROLE_RAABITA_HEAD' LIMIT 1)
					WHERE (LOWER(username) LIKE '%rmc%' OR LOWER(email) LIKE '%rmc%' OR LOWER(username) LIKE '%raabita%' OR LOWER(email) LIKE '%raabita%')
					  AND (role = 'DM' OR role = 'ROLE_DM' OR role = 'ADMIN' OR role IS NULL);
				""");
			} catch (Exception e) {
				System.err.println("Database init warning: " + e.getMessage());
			}
		};
	}
}


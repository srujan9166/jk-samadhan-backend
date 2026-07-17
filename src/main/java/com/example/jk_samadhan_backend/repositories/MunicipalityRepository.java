package com.example.jk_samadhan_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.jk_samadhan_backend.models.Municipality;
import java.util.List;

@Repository
public interface MunicipalityRepository extends JpaRepository<Municipality, Integer> {
    List<Municipality> findByDistrictId(Integer districtId);
}

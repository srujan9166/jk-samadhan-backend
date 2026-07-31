package com.example.jk_samadhan_backend.services;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.jk_samadhan_backend.dto.*;
import com.example.jk_samadhan_backend.models.*;
import com.example.jk_samadhan_backend.repositories.*;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MasterDataService {

    private final DepartmentRepository departmentRepository;
    private final CategoryRepository categoryRepository;
    private final SubCategoryLevel1Repository subCategoryLevel1Repository;
    private final DivisionRepository divisionRepository;
    private final DistrictRepository districtRepository;
    private final BlockRepository blockRepository;
    private final MunicipalityRepository municipalityRepository;
    private final PanchayatRepository panchayatRepository;
    private final WardRepository wardRepository;
    private final DesignationRepository designationRepository;
    private final UserTypeRepository userTypeRepository;
    private final UserRepository userRepository;

    public MasterDataService(DepartmentRepository departmentRepository,
                             CategoryRepository categoryRepository,
                             SubCategoryLevel1Repository subCategoryLevel1Repository,
                             DivisionRepository divisionRepository,
                             DistrictRepository districtRepository,
                             BlockRepository blockRepository,
                             MunicipalityRepository municipalityRepository,
                             PanchayatRepository panchayatRepository,
                             WardRepository wardRepository,
                             DesignationRepository designationRepository,
                             UserTypeRepository userTypeRepository,
                             UserRepository userRepository) {
        this.departmentRepository = departmentRepository;
        this.categoryRepository = categoryRepository;
        this.subCategoryLevel1Repository = subCategoryLevel1Repository;
        this.divisionRepository = divisionRepository;
        this.districtRepository = districtRepository;
        this.blockRepository = blockRepository;
        this.municipalityRepository = municipalityRepository;
        this.panchayatRepository = panchayatRepository;
        this.wardRepository = wardRepository;
        this.designationRepository = designationRepository;
        this.userTypeRepository = userTypeRepository;
        this.userRepository = userRepository;
    }

    // ==========================================
    // Administrative Master Data: Department
    // ==========================================

    private String getCreatorName(Department d) {
        if (d.getCreatedBy() == null) {
            return null;
        }
        String name = d.getCreatedBy().getName();
        if (name == null || name.isBlank()) {
            return d.getCreatedBy().getUsername();
        }
        return name;
    }

    @Cacheable(value = "departments")
    @Transactional(readOnly = true)
    public List<DepartmentDTO> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(d -> DepartmentDTO.builder()
                        .id(d.getId())
                        .name(d.getName())
                        .type(d.getType())
                        .createdAt(d.getCreatedAt())
                        .createdBy(getCreatorName(d))
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DepartmentDTO getDepartmentById(Integer id) {
        Department d = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with ID: " + id));
        return DepartmentDTO.builder()
                .id(d.getId())
                .name(d.getName())
                .type(d.getType())
                .createdAt(d.getCreatedAt())
                .createdBy(getCreatorName(d))
                .build();
    }

    @CacheEvict(value = "departments", allEntries = true)
    public DepartmentDTO createDepartment(CreateDepartmentRequest request) {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        Users creator = null;
        if (auth != null && auth.isAuthenticated()) {
            String username = auth.getName();
            creator = userRepository.findByIdentifier(username).orElse(null);
        }

        Department department = Department.builder()
                .name(request.getName())
                .type(request.getType() != null ? request.getType() : "GOVERNMENT")
                .createdBy(creator)
                .build();
        Department saved = departmentRepository.save(department);
        return DepartmentDTO.builder()
                .id(saved.getId())
                .name(saved.getName())
                .type(saved.getType())
                .createdAt(saved.getCreatedAt())
                .createdBy(getCreatorName(saved))
                .build();
    }

    @CacheEvict(value = "departments", allEntries = true)
    public DepartmentDTO updateDepartment(Integer id, CreateDepartmentRequest request) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with ID: " + id));
        if (request.getName()                          != null && !request.getName().isBlank()) {
            department.setName(request.getName());
        }
        if (request.getType() != null && !request.getType().isBlank()) {
            department.setType(request.getType());
        }
        Department updated = departmentRepository.save(department);
        return DepartmentDTO.builder()
                .id(updated.getId())
                .name(updated.getName())
                .type(updated.getType())
                .createdAt(updated.getCreatedAt())
                .createdBy(getCreatorName(updated))
                .build();
    }

    @CacheEvict(value = "departments", allEntries = true)
    public void deleteDepartment(Integer id) {
        departmentRepository.deleteById(id);
    }

    // ==========================================
    // Administrative Master Data: Category
    // ==========================================

    @Cacheable(value = "categories", key = "#deptId != null ? #deptId : 'all'")
    @Transactional(readOnly = true)
    public List<CategoryDTO> getCategories(Integer deptId) {
        List<Category> list = (deptId != null) 
                ? categoryRepository.findByDepartmentId(deptId)
                : categoryRepository.findAll();

        return list.stream().map(c -> CategoryDTO.builder()
                .id(c.getId())
                .departmentId(c.getDepartment() != null ? c.getDepartment().getId() : null)
                .departmentName(c.getDepartment() != null ? c.getDepartment().getName() : null)
                .name(c.getName())
                .reminderDays(c.getReminderDays())
                .build())
                .collect(Collectors.toList());
    }

    @CacheEvict(value = "categories", allEntries = true)
    public CategoryDTO createCategory(Integer departmentId, String name, Integer reminderDays) {
        Department dept = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found with ID: " + departmentId));
        Category category = Category.builder()
                .department(dept)
                .name(name)
                .reminderDays(reminderDays != null ? reminderDays : 7)
                .build();
        Category saved = categoryRepository.save(category);
        return CategoryDTO.builder()
                .id(saved.getId())
                .departmentId(dept.getId())
                .departmentName(dept.getName())
                .name(saved.getName())
                .reminderDays(saved.getReminderDays())
                .build();
    }

    // ==========================================
    // Administrative Master Data: SubCategory
    // ==========================================

    @Cacheable(value = "subcategories", key = "#categoryId != null ? #categoryId : 'all'")
    @Transactional(readOnly = true)
    public List<SubCategoryDTO> getSubCategories(Integer categoryId) {
        List<SubCategoryLevel1> list = (categoryId != null)
                ? subCategoryLevel1Repository.findByCategoryId(categoryId)
                : subCategoryLevel1Repository.findAll();

        return list.stream().map(sc -> SubCategoryDTO.builder()
                .id(sc.getId())
                .categoryId(sc.getCategory() != null ? sc.getCategory().getId() : null)
                .categoryName(sc.getCategory() != null ? sc.getCategory().getName() : null)
                .name(sc.getName())
                .build())
                .collect(Collectors.toList());
    }

    @CacheEvict(value = "subcategories", allEntries = true)
    public SubCategoryDTO createSubCategory(Integer categoryId, String name) {
        Category cat = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + categoryId));
        SubCategoryLevel1 subCat = SubCategoryLevel1.builder()
                .category(cat)
                .name(name)
                .build();
        SubCategoryLevel1 saved = subCategoryLevel1Repository.save(subCat);
        return SubCategoryDTO.builder()
                .id(saved.getId())
                .categoryId(cat.getId())
                .categoryName(cat.getName())
                .name(saved.getName())
                .build();
    }

    // ==========================================
    // Spatial / Territorial Master Data
    // ==========================================

    @Cacheable(value = "divisions")
    @Transactional(readOnly = true)
    public List<GeoLookupDTO> getAllDivisions() {
        return divisionRepository.findAll().stream()
                .map(d -> new GeoLookupDTO(d.getId(), d.getName()))
                .collect(Collectors.toList());
    }

    @Cacheable(value = "districts", key = "#divisionId != null ? #divisionId : 'all'")
    @Transactional(readOnly = true)
    public List<DistrictDTO> getDistricts(Integer divisionId) {
        List<District> list = (divisionId != null)
                ? districtRepository.findByDivisionId(divisionId)
                : districtRepository.findAll();

        return list.stream()
                .map(d -> new DistrictDTO(d.getId(), d.getName(), d.getLgdCode()))
                .collect(Collectors.toList());
    }

    @Cacheable(value = "blocks", key = "#districtId != null ? #districtId : 'all'")
    @Transactional(readOnly = true)
    public List<GeoLookupDTO> getBlocks(Integer districtId) {
        List<Block> list = (districtId != null)
                ? blockRepository.findByDistrictId(districtId)
                : blockRepository.findAll();

        return list.stream()
                .map(b -> new GeoLookupDTO(b.getId(), b.getName()))
                .collect(Collectors.toList());
    }

    @Cacheable(value = "municipalities", key = "#districtId != null ? #districtId : 'all'")
    @Transactional(readOnly = true)
    public List<GeoLookupDTO> getMunicipalities(Integer districtId) {
        List<Municipality> list = (districtId != null)
                ? municipalityRepository.findByDistrictId(districtId)
                : municipalityRepository.findAll();

        return list.stream()
                .map(m -> new GeoLookupDTO(m.getId(), m.getName()))
                .collect(Collectors.toList());
    }

    @Cacheable(value = "panchayats", key = "#blockId != null ? #blockId : 'all'")
    @Transactional(readOnly = true)
    public List<GeoLookupDTO> getPanchayats(Integer blockId) {
        List<Panchayat> list = (blockId != null)
                ? panchayatRepository.findByBlockId(blockId)
                : panchayatRepository.findAll();

        return list.stream()
                .map(p -> new GeoLookupDTO(p.getId(), p.getName()))
                .collect(Collectors.toList());
    }

    @Cacheable(value = "wards", key = "#municipalityId != null ? #municipalityId : 'all'")
    @Transactional(readOnly = true)
    public List<GeoLookupDTO> getWards(Integer municipalityId) {
        List<Ward> list = (municipalityId != null)
                ? wardRepository.findByMunicipalityId(municipalityId)
                : wardRepository.findAll();

        return list.stream()
                .map(w -> new GeoLookupDTO(w.getId(), w.getName()))
                .collect(Collectors.toList());
    }

    // ==========================================
    // Organizational Master Data
    // ==========================================

    @Cacheable(value = "designations")
    @Transactional(readOnly = true)
    public List<DesignationDTO> getAllDesignations() {
        return designationRepository.findAll().stream()
                .map(d -> new DesignationDTO(d.getId(), d.getName()))
                .collect(Collectors.toList());
    }

    @CacheEvict(value = "designations", allEntries = true)
    public DesignationDTO createDesignation(String name) {
        Designation designation = Designation.builder()
                .name(name)
                .build();
        Designation saved = designationRepository.save(designation);
        return new DesignationDTO(saved.getId(), saved.getName());
    }

    @Cacheable(value = "userTypes")
    @Transactional(readOnly = true)
    public List<UserType> getAllUserTypes() {
        return userTypeRepository.findAll();
    }
}

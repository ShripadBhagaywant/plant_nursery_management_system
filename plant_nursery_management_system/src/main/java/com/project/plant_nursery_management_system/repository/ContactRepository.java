package com.project.plant_nursery_management_system.repository;

import com.project.plant_nursery_management_system.model.Contact;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact,Long> {
    List<Contact> findByUserId(Long userId);
    Page<Contact> findByResolved(boolean resolved, Pageable pageable);

}

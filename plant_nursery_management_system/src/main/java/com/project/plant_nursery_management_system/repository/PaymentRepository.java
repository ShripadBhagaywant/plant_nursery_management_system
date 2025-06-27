package com.project.plant_nursery_management_system.repository;

import com.project.plant_nursery_management_system.model.Order;
import com.project.plant_nursery_management_system.model.Payment;
import com.project.plant_nursery_management_system.model.onlyenums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment,Long> {

    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);

    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);

    Optional<Payment> findByOrder(Order order);

    List<Payment> findByStatus(PaymentStatus status);


}

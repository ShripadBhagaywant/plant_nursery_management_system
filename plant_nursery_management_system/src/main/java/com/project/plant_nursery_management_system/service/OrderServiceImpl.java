package com.project.plant_nursery_management_system.service;

import com.project.plant_nursery_management_system.dto.EmailDetails;
import com.project.plant_nursery_management_system.dto.OrderDto;
import com.project.plant_nursery_management_system.dto.OrderItemDto;
import com.project.plant_nursery_management_system.exception.*;
import com.project.plant_nursery_management_system.model.*;
import com.project.plant_nursery_management_system.model.onlyenums.OrderStatus;
import com.project.plant_nursery_management_system.repository.*;
import com.project.plant_nursery_management_system.service.serviceInterface.EmailService;
import com.project.plant_nursery_management_system.service.serviceInterface.OrderService;
import com.project.plant_nursery_management_system.util.HtmlTemplateUtil;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class OrderServiceImpl implements OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderServiceImpl.class);

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final PlantRepository plantRepository;
    private final EmailService emailService;
    private final HtmlTemplateUtil htmlTemplateUtil;
    private final InventoryRepository inventoryRepository;

    public OrderServiceImpl(OrderRepository orderRepository, OrderItemRepository orderItemRepository, UserRepository userRepository,
                            PlantRepository plantRepository, EmailService emailService,
                            HtmlTemplateUtil htmlTemplateUtil, InventoryRepository inventoryRepository,
                            PaymentRepository  paymentRepository
    ) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.userRepository = userRepository;
        this.plantRepository = plantRepository;
        this.emailService = emailService;
        this.htmlTemplateUtil = htmlTemplateUtil;
        this.inventoryRepository = inventoryRepository;
        this.paymentRepository = paymentRepository;
    }

    @Override
    public Order placeOrder(OrderDto orderDTO) {
        User user = userRepository.findById(orderDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.isBlocked()) {
            throw new BlockedUserException("Your account is blocked. You cannot perform this operation.");
        }

        Order order = new Order();
        order.setUser(user);
        order.setPhoneNumber(orderDTO.getPhoneNumber());
        order.setShippingAddress(orderDTO.getShippingAddress());
        order.setCity(orderDTO.getCity());
        order.setState(orderDTO.getState());
        order.setZipCode(orderDTO.getZipCode());
        order.setRecipientName(orderDTO.getRecipientName());
        order.setCountry(orderDTO.getCountry());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        order.getStatusHistory().add(new StatusEntry(OrderStatus.PENDING,LocalDateTime.now()));

        List<OrderItem> itemList = new ArrayList<>();
        double itemTotal = 0;

        for (OrderItemDto itemDTO : orderDTO.getItems()) {
            OrderItem orderItem = createOrderItem(itemDTO, order);
            itemList.add(orderItem);
            itemTotal += orderItem.getPrice();
        }

        // 💡 Example calculations (adjust these values as per business logic)
        double shippingCharge = itemTotal > 1000 ? 0 : 50; // Free shipping over ₹1000
        double tax = itemTotal * 0.18; // 18% GST

        double totalAmount = itemTotal + shippingCharge + tax;

        // Set breakdown fields
        order.setItemTotal(itemTotal);
        order.setShippingCharge(shippingCharge);
        order.setTax(tax);
        order.setTotalAmount(totalAmount);
        order.setOrderItems(itemList);

        Order savedOrder = orderRepository.save(order);
        orderItemRepository.saveAll(itemList);

        sendOrderPlacedEmail(user, savedOrder);

        return savedOrder;
    }


    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    @Transactional
    @Override
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Order cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.CANCELLED) {
            throw new OrderAlreadyDeliveredException("Order with ID " + orderId + " has already been delivered and cannot be canceled.");
        }

        // Restore inventory
        for (OrderItem item : order.getOrderItems()) {
            Inventory inventory = item.getPlant().getInventory();
            if (inventory != null) {
                inventory.setQuantity(inventory.getQuantity() + item.getQuantity());
                inventoryRepository.save(inventory);
            }
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.getStatusHistory().add(new StatusEntry(OrderStatus.CANCELLED, LocalDateTime.now()));
        return orderRepository.save(order);
    }

    @Transactional
    @Override
    public Order updateOrder(Long orderId, OrderDto updatedOrderDTO) {
        Order existingOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        if (existingOrder.getStatus() != OrderStatus.PENDING) {
            throw new IllegalStateException("Only PENDING orders can be updated.");
        }

        if (existingOrder.getStatus() == OrderStatus.SHIPPED || existingOrder.getStatus() == OrderStatus.DELIVERED) {
            throw new OrderModificationNotAllowedException("Cannot modify order as it is already " + existingOrder.getStatus());
        }


        if (updatedOrderDTO.getItems() == null || updatedOrderDTO.getItems().isEmpty()) {
            throw new BadRequestException("Order must contain at least one item");
        }

        // Restore previous inventory
        for (OrderItem item : existingOrder.getOrderItems()) {
            Inventory inventory = item.getPlant().getInventory();
            inventory.setQuantity(inventory.getQuantity() + item.getQuantity());
            inventoryRepository.save(inventory);
        }

        orderItemRepository.deleteAll(existingOrder.getOrderItems());
        existingOrder.getOrderItems().clear();

        double totalAmount = 0;
        List<OrderItem> updatedItems = new ArrayList<>();

        for (OrderItemDto itemDTO : updatedOrderDTO.getItems()) {
            OrderItem orderItem = createOrderItem(itemDTO, existingOrder);
            updatedItems.add(orderItem);
            totalAmount += orderItem.getPrice();
        }

        existingOrder.setOrderItems(updatedItems);
        existingOrder.setTotalAmount(totalAmount);

        orderItemRepository.saveAll(updatedItems);
        return orderRepository.save(existingOrder);
    }

    @Override
    @Transactional
    public void deleteOrder(Long orderId, Long currentUserId, boolean isAdmin) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        // ✅ Only admin can delete DELIVERED orders
        if (order.getStatus() == OrderStatus.DELIVERED && !isAdmin) {
            throw new IllegalStateException("Only admin can delete a delivered order.");
        }

        // ✅ Only the user who placed the order OR admin can delete it
        if (!isAdmin && !order.getUser().getId().equals(currentUserId)) {
            throw new UnauthorizedAccessException("You are not allowed to delete this order.");
        }

        // Restore inventory
        for (OrderItem item : order.getOrderItems()) {
            Inventory inventory = item.getPlant().getInventory();
            if (inventory != null) {
                inventory.setQuantity(inventory.getQuantity() + item.getQuantity());
                inventoryRepository.save(inventory);
            }
        }

        Optional<Payment> paymentOpt = paymentRepository.findByOrder(order);
        paymentOpt.ifPresent(paymentRepository::delete);

        orderItemRepository.deleteAll(order.getOrderItems());
        order.getOrderItems().clear();
        orderRepository.save(order); // Optional save for clearing orderItems

        orderRepository.delete(order);
    }



    @Override
    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        if (order.getStatus() == OrderStatus.CANCELLED || order.getStatus() == OrderStatus.DELIVERED) {
            throw new IllegalStateException("Cannot update status. Order is already " + order.getStatus());
        }

        order.setStatus(status);
        order.getStatusHistory().add(new StatusEntry(status, LocalDateTime.now()));
        return orderRepository.save(order);
    }

    // ---------- Helper Methods ----------

    private OrderItem createOrderItem(OrderItemDto dto, Order order) {
        Plant plant = plantRepository.findById(dto.getPlantId())
                .orElseThrow(() -> new ResourceNotFoundException("Plant not found"));

        Inventory inventory = plant.getInventory();
        if (inventory == null) {
            throw new ResourceNotFoundException("Inventory not found for plant: " + plant.getName());
        }

        if (inventory.getQuantity() < dto.getQuantity()) {
            throw new InsufficientStockException("Plant " + plant.getName() + " has insufficient stock.");
        }

        inventory.setQuantity(inventory.getQuantity() - dto.getQuantity());
        inventoryRepository.save(inventory);

        OrderItem item = new OrderItem();
        item.setPlant(plant);
        item.setQuantity(dto.getQuantity());
        item.setPrice(plant.getPrice() * dto.getQuantity());
        item.setOrder(order);

        return item;
    }

    private void sendOrderPlacedEmail(User user, Order order) {
        try {
            EmailDetails details = new EmailDetails();
            details.setRecipient(user.getEmail());
            details.setSubject("Order Placed");
            details.setTemplateName("order-placed.html");

            Map<String, String> placeholders = new HashMap<>();
            placeholders.put("username", user.getName());
            placeholders.put("orderId", String.valueOf(order.getId()));
            placeholders.put("orderDate", String.valueOf(order.getOrderDate()));

            String template = htmlTemplateUtil.loadTemplate(details.getTemplateName());
            String body = htmlTemplateUtil.replacePlaceholders(template, placeholders);
            details.setBody(body);

            emailService.sendEmailAsync(details);

        } catch (Exception e) {
            log.error("Failed to send order confirmation email for order ID {}", order.getId(), e);
        }
    }
}

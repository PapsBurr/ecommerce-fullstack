package com.practiceproject.ecommerce.dto;

import com.practiceproject.ecommerce.entity.Address;
import com.practiceproject.ecommerce.entity.Customer;
import com.practiceproject.ecommerce.entity.Order;
import com.practiceproject.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;

}

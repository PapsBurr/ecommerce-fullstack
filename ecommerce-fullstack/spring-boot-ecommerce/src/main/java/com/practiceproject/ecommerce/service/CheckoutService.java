package com.practiceproject.ecommerce.service;

import com.practiceproject.ecommerce.dto.Purchase;
import com.practiceproject.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);

}

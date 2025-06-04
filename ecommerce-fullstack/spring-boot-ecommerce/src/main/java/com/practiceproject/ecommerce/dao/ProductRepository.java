package com.practiceproject.ecommerce.dao;

import com.practiceproject.ecommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

@CrossOrigin("http://localhost:4200")
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Query method to search database by the category "id"
    // Performs:
    // SELECT * FROM product WHERE category_id=?
    // Returns:
    // http://localhost:8080/api/products/search/findByCategoryId?id=...
    Page<Product> findByCategoryId(@Param("id") Long id, Pageable pageable);

    // Containing is similar to SQL "LIKE"
    // SELECT * FROM Product p
    // WHERE
    // p.name LIKE CONCAT('%' :name , '%')
    // test with "http://localhost:8080/api/products/search/findByNameContaining?name=Python"
    Page<Product> findByNameContaining(@Param("name") String name, Pageable pageable);



}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';

  private httpClient = inject(HttpClient)

  getProductList(theCategoryId: number): Observable<Product[]> {

    // Creates Url to call findByCategoryId in Spring ProductRepository
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`

    // Feeds search url to call findByCategoryId in Spring ProductRepository through getProducts()
    return this.getProducts(searchUrl);
  }

  getProductListPaginate(thePage: number,
                         thePageSize: number,
                         theCategoryId: number): Observable<GetResponseProducts> {

    // Creates Url to call findByCategoryId in Spring ProductRepository, page and size added.
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                    + `&page=${thePage}&size=${thePageSize}`;

    // Feeds search url to call findByCategoryId in Spring ProductRepository through getProducts()
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  // Returns an observable
  // Map the JSON data from Spring Data REST to ProductCategory array
  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    // build the url based on the keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thePage: number,
                            thePageSize: number,
                            theKeyword: string): Observable<GetResponseProducts> {

    // Creates Url to call findByNameContaining in Spring ProductRepository, page and size added.
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
    + `&page=${thePage}&size=${thePageSize}`;

    // Feeds search url to call findByCategoryId in Spring ProductRepository through getProducts()
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProduct(theProductId: number): Observable<Product> {

    // need to build URL based on product id
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }
}

// Unwraps the JSON from Spring Data REST _embedded entry
// unwraps page info for pagination
interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
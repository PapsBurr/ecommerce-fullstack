import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // Pagination properties
  thePageNumber: number = 0;
  thePageSize: number = 8;
  theTotalElements: number = 0;

  previousKeyword: String = "";

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }


  listProducts() {

    // passed in from search component
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
  
  }

  handleSearchProducts() {

    // checked if keyword is not null in listProducts()
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    // if we have a different keyword than previous
    // then set thePageNumber to 1
    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`Keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`)

    // search for products with keyword
    // keyword is passed in from the search component through angular routing
    /*
    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      }
    )
    */
    this.productService.searchProductsPaginate(this.thePageNumber - 1,
                                               this.thePageSize,
                                              theKeyword).subscribe(this.processResult());

  }

  handleListProducts() {

    // check if "id" param is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the 'id' param string. convert to number with +
      // ! tells that 'id' is not null
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else {
      // set default category to 1
      this.currentCategoryId = 1;
    }

    // 
    // Check if we have a different category than previous
    // Note: Angular will reuse a component if it is currently being viewed
    //

    // if we have a different category id than previous
    // then set thePageNumber back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    // now get the products for the given id
    /*
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
        console.log(this.products);
      }
    )
    */

    // Pagination product service call replaces above code to include pagination
    // pages begin at 1 in angular, pages begin at 0 in spring backend
    this.productService.getProductListPaginate(this.thePageNumber - 1,
                                               this.thePageSize,
                                               this.currentCategoryId).subscribe(this.processResult());

  }

  updatePageSize(updatedPageSize: string) {
    this.thePageSize = +updatedPageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }
  
  addToCart(theProduct: Product) {
    
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`)

    // Creates cart item and passes it onto the cart service
    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);

  }

}

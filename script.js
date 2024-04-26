document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab");
    const productsContainers = document.querySelectorAll(".products");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const category = tab.getAttribute("data-category");
        tabs.forEach(t => t.classList.remove('active-tab'));
        tab.classList.add('active-tab');
        productsContainers.forEach((container) => {
          if (container.id === category) {
            container.style.display = "flex";
            fetchProducts(category, container);
          } else {
            container.style.display = "none";
          }
        });
      });
    });

    function fetchProducts(category, container) {
      fetch(
        "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json"
      )
        .then((response) => response.json())
        .then((data) => {
          const categoryData = data.categories.find(
            (cat) =>
              cat.category_name.toLowerCase() === category.toLowerCase()
          );
          if (categoryData) {
            renderProducts(categoryData.category_products, container);
          } else {
            console.error(`No data found for category: ${category}`);
          }
        })
        .catch((error) => console.error("Error fetching products:", error));
    }

    function renderProducts(products, container) {
      container.innerHTML = "";

      products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        const productImage = document.createElement("div");
        productImage.classList.add("productImage");

        if (product.badge_text) {
            const badge = document.createElement("div");
            badge.classList.add("product-badge");
            badge.textContent = product.badge_text;
            productImage.appendChild(badge);
          } 

        const image = document.createElement("img");
        image.src = product.image;
        productImage.appendChild(image);

        productCard.appendChild(productImage)

        const heading = document.createElement("div");
        heading.classList.add("heading");

        const title = document.createElement("div");
        title.classList.add("product-title");
        title.textContent = product.title;
        heading.appendChild(title);

        const vendor = document.createElement("div");
        vendor.classList.add("product-details");
        vendor.textContent = ` ${product.vendor}`;
        heading.appendChild(vendor);

        productCard.appendChild(heading)

        const pricing = document.createElement("div");
        pricing.classList.add("pricing");

        const price = document.createElement("div");
        price.classList.add("product-price");
        price.textContent = `Rs ${product.price}`;
        pricing.appendChild(price);

        const compare = document.createElement("div");
        compare.classList.add("product-compare");
        compare.textContent = `${product.compare_at_price}`;
        pricing.appendChild(compare);

        const discount = document.createElement("div");
        discount.classList.add("product-discount");
        const discountValue = calculateDiscount(
          product.price,
          product.compare_at_price
        );
        discount.textContent = `${discountValue}% Off`;
        pricing.appendChild(discount);

        productCard.appendChild(pricing)

        const addToCart = document.createElement("button");
        addToCart.classList.add("add-to-cart");
        addToCart.textContent = "Add to Cart";
        productCard.appendChild(addToCart);

        container.appendChild(productCard);
      });
    }

    function calculateDiscount(price, compare) {
      const discount = ((compare - price) / compare) * 100;
      return Math.round(discount);
    }
  });
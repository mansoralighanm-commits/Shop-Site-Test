let cart = document.querySelector(".cart")
let cartOpen = document.querySelector("#open-cart")
let cartclose = document.querySelector(".close-cart")
let productContent = document.querySelector(".product-content")
let container = document.querySelector(".container")

cartOpen.addEventListener("click" , () => {
    cart.classList.add("active")
});

cartclose.addEventListener("click" , () => {
    cart.classList.remove("active")
});

function update(){
    updateTotal()
}

// add Products To HTML Page
let productData = null;

fetch('productsData.json')
.then(response => response.json())
.then(data => {
    productData = data
    showDataProducts()
})

// let itemsAdded = []
let itemsAdded = []
function showDataProducts(){
    productData.forEach(element => {
        let productBox = document.createElement("div")
        productBox.classList.add("product-box")
        productBox.innerHTML = `
        <img src="${element.mainImage}" class="image">
            <p class="title">${element.title}</p>
            <p class="price">${element.price}</p>
            <div class="buttons">
               <i class='bx bx-cart add-cart'></i>
            </div>
        `

        productContent.appendChild(productBox)
    });

    let buttons = document.querySelectorAll(".add-cart")
buttons.forEach(ele => {
    ele.addEventListener("click" , () => {
        
        let dad = ele.parentElement.parentElement
        let price = dad.querySelector(".price").innerHTML
        let title = dad.querySelector(".title").innerHTML
        let imgSRC = dad.querySelector(".image").src

        let newToAdd = {
            title,
            price,
            imgSRC
        }

if(itemsAdded.some(item => item.title == newToAdd.title)){
    alert("this Item Is Exist")
            return;
}
else{
     itemsAdded.push(newToAdd)
}

        let cartComponentDiv = cartComponent(title , price, imgSRC) 
        let newContent = document.createElement("div")
        newContent.classList.add("cart-content")
        newContent.innerHTML = cartComponentDiv

        const quantityInput = newContent.querySelector(".cart-quantity")
        quantityInput.addEventListener("change" , function (){
            if(this.value < 1) this.value =1
            updateTotal()
        })
        cart.appendChild(newContent)
        updateTotal(price)

    })
})
}



// change total innerHTML

function updateTotal(price){

    let total = 0 ;
    
    const cartItems = document.querySelectorAll(".cart-content")
    const totalPriceElement = document.querySelector(".total-price")

    cartItems.forEach(item => {
        const priceElement = item.querySelector(".price")
        const price = parseFloat(priceElement.innerHTML.replace("$" , ""))

        const quantityElement = item.querySelector(".cart-quantity")
        const quantity = parseInt(quantityElement.value);

        total += price * quantity
        console.log(total);
        
    })

    totalPriceElement.innerHTML = total.toFixed(2) + "$"

}

function cartComponent(title , price , imgSRC){
    return `
    
    <div class="image">
                <img src="${imgSRC} " >
            </div>
            <div class="info">
                <p class="title">${title}</p>
                <p class="price">${price}</p>
                <input class="quantity cart-quantity" type="number" value="1" min="1" >
            </div>
            <div class="remove">
            <i class='bx bxs-trash remove-btns' onclick="removeItem(this)" ></i>
            </div>
            
    `
}

function removeItem(button){

    const cartContent = button.closest(".cart-content")
    cartContent.remove()

       let price = cartContent.querySelector(".price").innerHTML
       let totalPriceElement = document.querySelector(".total-price")
       let total = Number(totalPriceElement.innerHTML.replace("$" , ""))
       let nprice = parseFloat(price.replace("$" , ""))
       totalPriceElement.innerHTML = total - nprice + "$"
       
       let cartTitle = cartContent.querySelector(".title").innerHTML

       itemsAdded = itemsAdded.filter(item => {
        item.title !== cartTitle
       })

       updateTotal()
}
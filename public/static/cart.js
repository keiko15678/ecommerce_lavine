if(document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded', ready)
} else{
    ready()
}

function printToPage(){
    const storageItem = localStorage.getItem('purchase');
    const toArr = JSON.parse(storageItem);
    toArr.forEach(element => {
        const { name, price, quantity } = element;
        let appendLocation = document.getElementById('cart-checkout');
        let cartContainer = document.createElement('div')
        cartContainer.setAttribute('class', 'cart-child')
        
        let description = document.createElement('div')
        description.setAttribute('class', 'cart-child-description')
        
        let descriptionTitle = document.createElement('div')
        descriptionTitle.setAttribute('class', 'cart-title')
        descriptionTitle.innerText = name;

        let descriptionQty = document.createElement('input')
        descriptionQty.setAttribute('class', 'cart-quantity')
        descriptionQty.setAttribute('value', quantity)
        let textQty = document.createTextNode('Qty: ')


        let descriptionPrice = document.createElement('p')
        descriptionPrice.setAttribute('class', 'cart-price')
        let priceTag = document.createElement('span')
        priceTag.setAttribute('class', 'price-item')

        // dollar sign
        let priceSymbol = document.createTextNode('$ ')
        descriptionPrice.appendChild(priceSymbol)
        descriptionPrice.appendChild(priceTag)
        priceTag.innerText = price

        let descriptionBtn = document.createElement('a')
        descriptionBtn.setAttribute('href', '#')
        descriptionBtn.setAttribute('id', 'remove-item')
        descriptionBtn.setAttribute('class', 'btn cart-btn remove-btn')
        descriptionBtn.innerText = 'Remove Item'

        cartContainer.appendChild(description)
        description.appendChild(descriptionTitle)
        description.appendChild(textQty)
        description.appendChild(descriptionQty)
        description.appendChild(descriptionPrice)
        description.appendChild(descriptionBtn)
        appendLocation.after(cartContainer)
    });
}

function ready(){
    if(localStorage.hasOwnProperty('purchase')){
        printToPage()
    }
    // remove item
    updateTotal()
    let removeBtn = document.getElementsByClassName('remove-btn')
    let itemName = document.getElementsByClassName('cart-title')
    let quantityInput = document.getElementsByClassName('cart-quantity')
    let itemPrice = document.getElementsByClassName('price-item')
    for(let i = 0; i < removeBtn.length; i++){
        let btn = removeBtn[i]
        let quantity = quantityInput[i]
        let item = itemName[i].innerText
        let price = itemPrice[i].innerText
        btn.addEventListener('click', (event) =>{
            let btnClicked = event.target
            btnClicked.parentElement.parentElement.remove() 

            removeItemFromStorage(item)
            updateTotal()
        })
        quantity.addEventListener('input', (event) =>{
            let inputChange = event.target;
            let newQuantity = event.target.value;
            if(isNaN(newQuantity) || newQuantity <= 0 || newQuantity == ""){
                newQuantity = 1;
                updateQuantity(item, newQuantity)
            }else{
                updateQuantity(item, newQuantity)
                updateTotal() 
            }
        })
    }
}

function removeItemFromStorage(itemName){
    if(localStorage.hasOwnProperty('purchase')){
        const toArr = JSON.parse(localStorage.getItem('purchase'));
        let count = 0;
        toArr.forEach(element =>{
            if(element.name === itemName){
                toArr.splice(toArr.indexOf(element), 1);
            }
            count += 1;
        })
        localStorage.setItem('purchase', JSON.stringify(toArr));
    }
}

function updateQuantity(itemName, newQuantity){
    if(localStorage.hasOwnProperty('purchase')){
        const toArr = JSON.parse(localStorage.getItem('purchase'));
        let count = 0;
        toArr.forEach(element =>{
            if(element.name === itemName){
                element.quantity = newQuantity;
            }
            count += 1;
        })
        localStorage.setItem('purchase', JSON.stringify(toArr));
    }
}

function updateTotal(){
    let price = document.getElementsByClassName('price-item');
    let qty = document.getElementsByClassName('cart-quantity');
    let count = 0;   
    for(let i = 0; i < price.length; i++){
        let tag = parseFloat(price[i].innerText);
        let qtyTag = parseFloat(qty[i].value);   
        count += (tag * qtyTag);
        count;
    }
    document.getElementById('cart-subtotal').innerText = count.toFixed(2);
    localStorage.setItem('subtotal', count.toFixed(2));

    if(count.toFixed(2) == 0.00){
        const checkoutBtn = document.getElementById('checkoutBtn');
        checkoutBtn.addEventListener('click', (event) =>{
            checkoutBtn.href = "#";
            const popUp = document.getElementById('pop-up')
            popUp.setAttribute('style', 'display:block;');
                setTimeout(() =>{
                    popUp.setAttribute('style', 'display:none;');
                }, 1000);
        })
    }
    else{
        checkoutBtn.href = "checkout.html";
    }
}


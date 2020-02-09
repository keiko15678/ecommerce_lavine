const itemId = localStorage.getItem('current');

axios.get(`/items/${itemId}`)
    .then((response) =>{
        const item = response.data;
        const { _id, name, price, imgURL, describe, productDetails, delivery, specifications, reviews, questions, slideshow, rating, gender} = item;
        writeTitle(name)
        writeBody(price, rating, describe, delivery, specifications, reviews, questions, slideshow, rating)
        attachFunctions()
        backBtn(gender)
        // detectInCartOnload(name)
    })
    .catch(() => {
        console.log('error');
    });

function writeTitle(name){
    const title = document.getElementsByTagName('h3');
    title[0].innerText = name;
}
function writeBody(price, rating, describe, delivery, specifications, reviews, questions, slideshow, rating){
    const slideshowSelect = document.querySelector('.item-slideshow');
    
    for(let i = 0; i < slideshow.length; i++){
        let slideshowImg = document.createElement('img');
        
        slideshowImg.className = 'item-child-img';
        
        slideshowImg.src = slideshow[i];
        slideshowSelect.appendChild(slideshowImg);
        
    }
    
    const priceTag = document.querySelector('.price-tag');
    priceTag.innerText = price;

    
    if(rating.length > 0){  
        const itemRating = document.createElement('div');
        itemRating.className = 'item-rating';
        itemRating.innerText = '$ ';
        const ratingNum = document.createElement('span');
        ratingNum.innerText = rating;
    }
    else{
        const itemRating = document.querySelector('.item-rating');
        itemRating.innerText = 'Not rated yet';
    }

    const itemDesc = document.querySelector('.item-desc');
    itemDesc.innerText = describe;

    const deliveryItem = document.getElementById('delivery');
    deliveryItem.innerText = delivery;
    
    const specificationsItem = document.getElementById('specifications')
    specificationsItem.innerText = specifications;

}

function backBtn(gender){
    let backBtn = document.getElementById('returnBtn');
    let backBtnText = document.getElementById('label-name');
    if(gender === 'male'){
        backBtn.href = "/men";
        backBtnText.innerText = "Men's";
    } else if (gender === 'female'){
        backBtn.href = "/women";
        backBtnText.innerText = "Women's";
    }
}

function attachFunctions(){
    let addToCartBtn = document.getElementsByClassName('add-to-cart');
    let price = document.getElementsByClassName('price-tag');
    let popUp = document.getElementById('pop-up');
    let popUp2 = document.getElementById('pop-up2');
    addToCartBtn[0].addEventListener('click', (event) => {
        let itemName = document.getElementById("itemName").innerText;

        const item = {
            name: itemName,
            price: price[0].innerText,
            quantity: 1
        };
        const itemList = [];
        itemList.push(item);
        if(localStorage.getItem('purchase')){
            const toArr = JSON.parse(localStorage.getItem('purchase'));
            let inCart = false;
            toArr.forEach(element =>{
                let { name } = element;
                if(name === itemName){
                    inCart = true;
                }
            })
            if(!inCart){
                toArr.push(item);
                const toJSON = JSON.stringify(toArr);
                localStorage.setItem('purchase', toJSON);
                const popWindow = document.getElementById('pop-window');
                    popWindow.setAttribute('style', 'background: #e8fcde; border: 2px solid #e8fcde; color: #42c700;');
                popUp.setAttribute('style', 'display:block;');
                setTimeout(() =>{
                    popUp.setAttribute('style', 'display:none;');
                }, 1000);
                // addToCartBtn[0].innerText = 'In Cart';
            }
            else{
                popUp2.setAttribute('style', 'display:block;');
                setTimeout(() =>{
                    popUp2.setAttribute('style', 'display:none;');
                }, 1000);
            }
        }
        else{
            localStorage.setItem('purchase', JSON.stringify(itemList));
            popUp.setAttribute('style', 'display:block;');
            setTimeout(() =>{
                popUp.setAttribute('style', 'display:none;');
            }, 1000);
            // addToCartBtn[0].innerText = 'In Cart';
        }
    })
}

// function inCartOnload(itemName){
//     let inCart = false;
//     if(localStorage.hasOwnProperty('purchase')){
//         const toArr = JSON.parse(localStorage.getItem('purchase'));      
//         toArr.forEach(element =>{
//             let { name } = element;
//             if(name === itemName){
//                 inCart = true;
//             }
//         })
//     }
//     return inCart;
// }

// function detectInCartOnload(name){
//     if(inCartOnload(name)){
//         let addToCartBtn = document.getElementsByClassName('add-to-cart');
//         addToCartBtn[0].innerText = 'In Cart';
//     }
// }



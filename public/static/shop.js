if(document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded', ready)
} else{
    ready()
}
function ready(){
axios.get('/items')
    .then((response) =>{
        const items = response.data;
        const maleOnly = items.filter(item => {
             return item.gender === "male"           
        });
        const femaleOnly = items.filter(item => {
            return item.gender !== "male"           
       });
        if(window.location.href.includes('shop-men')){
            maleOnly.forEach(element => {
                const { _id, name, price, imgURL, describe} = element;
                createItemCard(_id, name, imgURL, price, describe);
                detectInCartOnload(name, _id)
            });
        }
        else{
            femaleOnly.forEach(element => {
                const { _id, name, price, imgURL, describe} = element;
                createItemCard(_id, name, imgURL, price, describe);
            });
        }
        attachCartFunction()
        attachDetailsFunction()
    })
    .catch(() => {
        console.log('error');
    });
}
function attachCartFunction(){
    let addToCartBtn = document.getElementsByClassName('add-to-cart');
    let price = document.getElementsByClassName('price-tag');
    let popUp = document.getElementById('pop-up');
    let popUp2 = document.getElementById('pop-up2');
    for(let i = 0; i < addToCartBtn.length; i++){
        addToCartBtn[i].addEventListener('click', (event) => {
            let itemName = addToCartBtn[i].parentElement.parentElement.previousElementSibling.previousElementSibling.innerText;
            const item = {
                name: itemName,
                price: price[i].innerText,
                quantity: 1
            };
            const itemList = [];
            itemList.push(item);
            if(localStorage.hasOwnProperty('purchase')){            
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
                    addToCartBtn[i].innerText = 'In Cart';
                    // addToCartBtn[i].disabled = true;
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
                addToCartBtn[i].innerText = 'In Cart';
                // addToCartBtn[i].disabled = true;
                popUp.setAttribute('style', 'display:block;');
                setTimeout(() =>{
                    popUp.setAttribute('style', 'display:none;');
                }, 1000);
            }     
        })
    }
}

function inCartOnload(itemName){
    let inCart = false;
    if(localStorage.hasOwnProperty('purchase')){
        const toArr = JSON.parse(localStorage.getItem('purchase'));      
        toArr.forEach(element =>{
            let { name } = element;
            if(name === itemName){
                inCart = true;
            }
        })
    }
    return inCart;
}

function detectInCartOnload(name, _id){
    if(inCartOnload(name)){
        let addToCartBtn = document.getElementById(_id);
        // addToCartBtn.disabled = true;
        addToCartBtn.innerText = 'In Cart';
    }
}
function attachDetailsFunction(){
    const detailsBtn = document.getElementsByClassName('cards-detail')
    for(let i = 0; i < detailsBtn.length; i++){
        detailsBtn[i].addEventListener('click', (event) =>{
            localStorage.setItem('current' , detailsBtn[i].id);
        })
    }
}


function createItemCard(_id, name, imgURL, price, describe){
    const container = document.createElement('div');
        container.className = 'cards-child';

    const title = document.createElement('div');
        title.className = 'cards-title';
        title.innerText = name;

        const img = document.createElement('img');
        img.className = 'cards-child-img';
        img.src = imgURL;

        const description = document.createElement('div');
        description.className = 'cards-child-description';

        const descP = document.createElement('p');
        descP.className = 'cards-desc';
        descP.innerText = describe;

        const cardsBtn = document.createElement('div');
        cardsBtn.className = 'cards-btn';

        const cardsBtnP = document.createElement('p');
        cardsBtnP.className = 'cards-price';
        cardsBtnP.innerText = '$ ';

        const priceTag = document.createElement('span');
        priceTag.className = 'price-tag';
        priceTag.innerText = price;

        const addToCart = document.createElement('button');
        addToCart.className = 'btn btn-cards add-to-cart';
        addToCart.innerText = '+ Cart';
        addToCart.id = _id;

        const details = document.createElement('a');
        details.href = 'item_details.html';
        details.className = 'btn btn-cards cards-detail';
        details.innerText = 'Details';
        details.id = _id;

        const locationInsert = document.querySelector('.cards');
        locationInsert.appendChild(container)
        container.appendChild(title);
        container.appendChild(img);
        container.appendChild(description);
        description.appendChild(descP);
        description.appendChild(cardsBtn);
        cardsBtn.appendChild(cardsBtnP);
        cardsBtn.appendChild(addToCart);
        cardsBtn.appendChild(details);
        cardsBtnP.appendChild(priceTag);
}


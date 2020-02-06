const stripe = Stripe('pk_test_53f3grnbUOTmSf2BwoBzSSLa00Y29ZY5Mi');


const createOrderObject = {}

const subtotal = localStorage.getItem('subtotal');
document.getElementById('checkout-subtotal').innerText = subtotal;

const paymentBtns = document.getElementsByClassName('payment-btn');
if(localStorage.hasOwnProperty('purchase')){
  const storageItem = localStorage.getItem('purchase');
  const itemsforPaypal = document.getElementsByName('itemsforPaypal');
  itemsforPaypal[0].value = storageItem;
  createOrderObject.item = storageItem;

  if(storageItem.length <= 2 || !localStorage.hasOwnProperty('purchase')){   
    for(let i = 0; i < paymentBtns.length; i++){
      paymentBtns[i].disabled = true;
    } 
  }
}
else{
  for(let i = 0; i < paymentBtns.length; i++){
    paymentBtns[i].disabled = true;
  } 
}

const subtotalForPaypal = document.getElementsByName('subtotalforPaypal');
subtotalForPaypal[0].value = subtotal;

// const subtotalForStripe = document.getElementsByName('subtotalforStripe');
// subtotalForStripe[0].value = subtotal;

createOrderObject.subtotal = subtotal;

const stripeBtn = document.getElementById('stripe-btn');
stripeBtn.addEventListener('click', event =>{
  axios.post('/pay/stripe', createOrderObject)
        .then(response =>{
          const sessionId = response.data;
          stripe.redirectToCheckout({
            sessionId: sessionId
          })
          .then(result => {
            console.log(result.error.message)
          });
        });  
})
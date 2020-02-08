const popUp = document.getElementById('pop-up');
const popUpContent = document.getElementById('pop-up-content');
document.forms['register'].addEventListener('submit', (event) => {
    event.preventDefault();
    let formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        country: document.getElementById('country').value,
        postal: document.getElementById('postal').value
    };
    axios.post('/register', formData)
        .then(response => {
            if(response.data === 'user_registered'){
                popUpContent.innerText = 'Register Success! You may now proceed to login.';
                popUp.setAttribute('style', 'display:block;');
                setTimeout(() =>{
                    popUp.setAttribute('style', 'display:none;');
                }, 2000);
                location.href = "/redirlogin"
            }
            else{
                for(let i = 0; i < response.data.length; i++){
                    popUpContent.innerText = response.data[i];
                }
                popUp.setAttribute('style', 'display:block;');
                setTimeout(() =>{
                    popUp.setAttribute('style', 'display:none;');
                }, 3000);
            }
        })
});
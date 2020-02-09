document.getElementById('logout').addEventListener('click', event =>{
    deleteCookie('authorization');
})
let emailFromCookie = getCookie('authorization').split('!')[1];
let email = emailFromCookie.split('_')[0] + '@' + emailFromCookie.split('_')[1];
document.getElementById('user-name').innerText = email;

function deleteCookie(cname) {
    var d = new Date();
    d.setTime(d.getTime() - (1000*60*60*24));
    var expires = "expires=" + d.toGMTString();
    window.document.cookie = cname+"="+"; "+expires;
 
}

function getCookie(cname) {
    let name = cname + "="; 
    let cArr = window.document.cookie.split(';'); 
    for(let i=0; i<cArr.length; i++) {
        let c = cArr[i].trim();
        if (c.indexOf(name) == 0) 
            return c.substring(name.length, c.length);
    }
    return "";
}

axios.get('/users')
    .then(response => {
        let count = 0;
        if(response.data.length > 0){
            response.data.forEach(user => count += 1)
            document.getElementById('total-users').innerText = count;
        }
        else{
            document.getElementById('total-users').innerText = 0;
        }
        
    })

axios.get('/orders')
    .then(response => {
        let count = 0;
        if(response.data.length > 0){
            response.data.forEach(order => count += 1)
            document.getElementById('active-orders').innerText = count;
        }
        else{
            document.getElementById('active-orders').innerText = 0;
        }
    })

axios.get('/items')
    .then(response => {
        let count = 0;
        if(response.data.length > 0){
            response.data.forEach(item => count += 1)
            document.getElementById('total-items').innerText = count;
        }
        else{
            document.getElementById('total-items').innerText = 0;
        }
    })

axios.get('/users/latest')
    .then(response =>{
        console.log(response.data)
        for(let i = 0; i < response.data.length; i++){
            document.getElementsByClassName('firstName')[i].innerText = response.data[i].firstName;
            document.getElementsByClassName('lastName')[i].innerText = response.data[i].lastName;
            document.getElementsByClassName('email')[i].innerText = response.data[i].email;
        }
    })

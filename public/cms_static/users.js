let emailFromCookie = getCookie('authorization').split('!')[1];
let email = emailFromCookie.split('_')[0] + '@' + emailFromCookie.split('_')[1];
document.getElementById('user-name').innerText = email;

let appendLocation = document.getElementById('incomplete-order-data');
axios.get('/users/valid')
    .then(response =>{
        const items = response.data;
        console.log(items)
        for(let i = 0; i < items.length; i++){
            let tr = document.createElement('tr');
            let th = document.createElement('th');
            th.scope = 'row'
            th.innerText = i+1;
            let itemId = document.createElement('td');
            let name = document.createElement('td');
            let price = document.createElement('td');
            let btn = document.createElement('td');
            let a = document.createElement('a');
            a.href= "/users/deactivate/" + items[i]._id;
            a.style.color="#fff";
            a.className="btn btn-info btn-sm";
            a.innerText = "Disable";
            btn.appendChild(a);

            a = document.createElement('a');
            a.href= "/users/remove/" + items[i]._id;
            a.style.color="#fff";
            a.style.marginLeft="10px";
            a.className="btn btn-danger btn-sm";
            a.innerText = "Remove";
            btn.appendChild(a);

            itemId.innerText = items[i]._id;
            name.innerText = items[i].firstName + " "+ items[i].lastName;
            price.innerText = items[i].email;
            tr.appendChild(th);
            tr.appendChild(itemId);
            tr.appendChild(name);
            tr.appendChild(price);
            tr.appendChild(btn);;
            appendLocation.appendChild(tr);
        }     
    })

let appendLocation2 = document.getElementById('complete-order-data');
axios.get('/users/invalid')
    .then(response =>{
        const items = response.data;
        console.log(items)
        for(let i = 0; i < items.length; i++){
            let tr = document.createElement('tr');
            let th = document.createElement('th');
            th.scope = 'row'
            th.innerText = i+1;
            let itemId = document.createElement('td');
            let name = document.createElement('td');
            let price = document.createElement('td');
            let stock = document.createElement('td');

            let btn = document.createElement('td');
            let a = document.createElement('a');
            a.href= "/users/activate/" + items[i]._id;
            a.style.color="#fff";
            a.className="btn btn-info btn-sm";
            a.innerText = "Enable";
            btn.appendChild(a);

            a = document.createElement('a');
            a.href= "/users/remove/" + items[i]._id;
            a.style.color="#fff";
            a.style.marginLeft="10px";
            a.className="btn btn-danger btn-sm";
            a.innerText = "Remove";
            btn.appendChild(a);

            itemId.innerText = items[i]._id;
            name.innerText = items[i].firstName + " "+ items[i].lastName;
            price.innerText = items[i].email;
            tr.appendChild(th);
            tr.appendChild(itemId);
            tr.appendChild(name);
            tr.appendChild(price);
            tr.appendChild(btn);;
            appendLocation2.appendChild(tr);
        }     
    })

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
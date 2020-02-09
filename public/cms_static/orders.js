let emailFromCookie = getCookie('authorization').split('!')[1];
let email = emailFromCookie.split('_')[0] + '@' + emailFromCookie.split('_')[1];
document.getElementById('user-name').innerText = email;

let appendLocation = document.getElementById('incomplete-order-data');
axios.get('/orders/incomplete')
    .then(response =>{
        const orders = response.data;
        console.log(orders)
        for(let i = 0; i < orders.length; i++){
            let tr = document.createElement('tr');
            let th = document.createElement('th');
            th.scope = 'row'
            th.innerText = i+1;
            let orderId = document.createElement('td');
            let details = document.createElement('td');
            let name = document.createElement('td');
            let shipping = document.createElement('td');
            let btn = document.createElement('td');
            let a = document.createElement('a');
            a.href= "/orders/complete/" + orders[i]._id;
            a.style.color="#fff";
            a.className="btn btn-primary btn-sm";
            a.innerText = "Complete";
            btn.appendChild(a);
            orderId.innerText = orders[i]._id;
            name.innerText = orders[i].firstName + ' ' + orders[i].lastName;
            shipping.innerText = orders[i].shipping;
            orders[i].detail.map(order => {
                let tag = document.createElement('p');
                tag.style.fontWeight = '600'
                let sorted = ['product: ' + order.name, ' quantity: *'+order.quantity+ '    ']
                tag.innerText += sorted;
                details.appendChild(tag);
            })
            tr.appendChild(th);
            tr.appendChild(orderId);
            tr.appendChild(details);
            tr.appendChild(name);
            tr.appendChild(shipping);
            tr.appendChild(btn);
            appendLocation.appendChild(tr);
        }     
    })

let appendLocation2 = document.getElementById('complete-order-data');
axios.get('/orders/complete')
    .then(response =>{
        const orders = response.data;
        console.log(orders)
        for(let i = 0; i < orders.length; i++){
            let tr = document.createElement('tr');
            let th = document.createElement('th');
            th.scope = 'row'
            th.innerText = i+1;
            let orderId = document.createElement('td');
            let details = document.createElement('td');
            let name = document.createElement('td');
            let shipping = document.createElement('td');
            let btn = document.createElement('td');
            let a = document.createElement('a');
            a.href= "/orders/incomplete/" + orders[i]._id;
            a.style.color="#fff";
            a.className="btn btn-warning btn-sm";
            a.innerText = "Incomplete";
            btn.appendChild(a);
            orderId.innerText = orders[i]._id;
            name.innerText = orders[i].firstName + ' ' + orders[i].lastName;
            shipping.innerText = orders[i].shipping;
            orders[i].detail.map(order => {
                let tag = document.createElement('p');
                tag.style.fontWeight = '600'
                let sorted = ['product: ' + order.name, ' quantity: *'+order.quantity+ '    ']
                tag.innerText += sorted;
                details.appendChild(tag);
            })
            tr.appendChild(th);
            tr.appendChild(orderId);
            tr.appendChild(details);
            tr.appendChild(name);
            tr.appendChild(shipping);
            tr.appendChild(btn);
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
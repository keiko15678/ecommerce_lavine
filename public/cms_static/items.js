let emailFromCookie = getCookie('authorization').split('!')[1];
let email = emailFromCookie.split('_')[0] + '@' + emailFromCookie.split('_')[1];
document.getElementById('user-name').innerText = email;

let appendLocation = document.getElementById('incomplete-order-data');
axios.get('/items/active')
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
            // let imageUrl = document.createElement('td');
            // let type = document.createElement('td');
            // let gender = document.createElement('td');
            // let description = document.createElement('td');
            // let details = document.createElement('td');
            // let specifications = document.createElement('td');
            // let delivery = document.createElement('td');
            let btn = document.createElement('td');
            let a = document.createElement('a');
            a.href= "/items/inactive/" + items[i]._id;
            a.style.color="#fff";
            a.className="btn btn-info btn-sm";
            a.innerText = "Disable";
            btn.appendChild(a);

            let btn2 = document.createElement('td');
            a = document.createElement('button');
            a.type="button";
            // a.href= "/items/edit/" + items[i]._id;
            a.setAttribute('data-toggle',"modal");
            a.setAttribute('data-target',"#editItemModal");
            a.style.color="#fff";
            a.style.marginLeft="10px";
            a.className="btn btn-primary btn-sm";
            a.innerText = "Edit";
            btn.appendChild(a);

            let btn3 = document.createElement('td');
            a = document.createElement('a');
            a.href= "/items/remove/" + items[i]._id;
            a.style.color="#fff";
            a.style.marginLeft="10px";
            a.className="btn btn-danger btn-sm";
            a.innerText = "Remove";
            btn.appendChild(a);

            // let submit = document.querySelector('#editItemBtn');

            
            itemId.innerText = items[i]._id;
            name.innerText = items[i].name;
            price.innerText = items[i].price;
            stock.innerText = items[i].stock;
            tr.appendChild(th);
            // tr.appendChild(itemId);
            tr.appendChild(name);
            tr.appendChild(price);
            tr.appendChild(stock);
            // tr.appendChild(imageUrl);
            // tr.appendChild(type);
            // tr.appendChild(gender);
            // tr.appendChild(description);
            // tr.appendChild(details);
            // tr.appendChild(specifications);
            // tr.appendChild(delivery);
            tr.appendChild(btn);
            appendLocation.appendChild(tr);
        }     
    })

let appendLocation2 = document.getElementById('complete-order-data');
axios.get('/items/inactive')
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
            // let imageUrl = document.createElement('td');
            // let type = document.createElement('td');
            // let gender = document.createElement('td');
            // let description = document.createElement('td');
            // let details = document.createElement('td');
            // let specifications = document.createElement('td');
            // let delivery = document.createElement('td');
            let btn = document.createElement('td');
            let a = document.createElement('a');
            a.href= "/items/active/" + items[i]._id;
            a.style.color="#fff";
            a.className="btn btn-info btn-sm";
            a.innerText = "Enable";
            btn.appendChild(a);

            let btn2 = document.createElement('td');
            a = document.createElement('a');
            a.href= "/items/edit/" + items[i]._id;
            a.style.color="#fff";
            a.style.marginLeft="10px";
            a.className="btn btn-primary btn-sm";
            a.innerText = "Edit";
            btn.appendChild(a);

            let btn3 = document.createElement('td');
            a = document.createElement('a');
            a.href= "/items/remove/" + items[i]._id;
            a.style.color="#fff";
            a.style.marginLeft="10px";
            a.className="btn btn-danger btn-sm";
            a.innerText = "Remove";
            btn.appendChild(a);

            itemId.innerText = items[i]._id;
            name.innerText = items[i].name;
            price.innerText = items[i].price;
            stock.innerText = items[i].stock;
            tr.appendChild(th);
            // tr.appendChild(itemId);
            tr.appendChild(name);
            tr.appendChild(price);
            tr.appendChild(stock);
            // tr.appendChild(imageUrl);
            // tr.appendChild(type);
            // tr.appendChild(gender);
            // tr.appendChild(description);
            // tr.appendChild(details);
            // tr.appendChild(specifications);
            // tr.appendChild(delivery);
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

document.getElementById('stock-value').innerText = document.getElementById('stock').value;
document.getElementById('stock').oninput = () =>{
    document.getElementById('stock-value').innerText = document.getElementById('stock').value;
}
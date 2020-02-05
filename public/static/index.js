modalActivate('login-modal', 'login-close', 'login-btn')
modalActivate('signup-modal', 'signup-close', 'signup')

let modal = document.getElementsByClassName('modal')
window.onclick = (event) => {
    for(let i = 0; i < modal.length; i++){
        if (event.target == modal[i]) {
            modal[i].style.display = "none";
        }
    }        
}

function closeLogin(){
    let modal = document.getElementById('login-modal')
    modal.setAttribute('style', 'display:none;')
}
function modalActivate(modalName, closeName, btnName){
    let btn = document.getElementById(btnName)
    let modal = document.getElementById(modalName)
    let helpClose = document.getElementById(closeName)
    btn.addEventListener('click', (event) =>{
        modal.setAttribute('style', 'display:block;')
    })   
    helpClose.onclick = () => {
        modal.setAttribute('style', 'display:none;')
    }
}

function showmenu(){
    let nav = document.getElementById("dropdown")
    let menu = document.getElementById("dropdown-menu")
    let sales = document.getElementById("sales")
    let cond = menu.getAttribute("style")
    if(cond.includes("block")){        
        menu.setAttribute("style", "display: none;")
        sales.setAttribute("style", "display: block;")
    }
    else{
        menu.setAttribute("style", "display: block;")
        sales.setAttribute("style", "display: none;")
    }
}

function getUrlParameter(url, parameter){
    parameter = parameter.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?|&]' + parameter.toLowerCase() + '=([^&#]*)');
    var results = regex.exec('?' + url.toLowerCase().split('?')[1]);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g,''));
}

function setUrlParameter(url, key, value) {
    var key = encodeURIComponent(key),
        value = encodeURIComponent(value);

    var baseUrl = url.split('?')[0],
        newParam = key + '=' + value,
        params = '?' + newParam;

    if (url.split('?')[1] === undefined){ // if there are no query strings, make urlQueryString empty
        urlQueryString = '';
    } else {
        urlQueryString = '?' + url.split('?')[1];
    }

    // If the "search" string exists, then build params from it
    if (urlQueryString) {
        var updateRegex = new RegExp('([\?&])' + key + '=[^&]*');
        var removeRegex = new RegExp('([\?&])' + key + '=[^&;]+[&;]?');

        if (value === undefined || value === null || value === '') { // Remove param if value is empty
            params = urlQueryString.replace(removeRegex, "$1");
            params = params.replace(/[&;]$/, "");
    
        } else if (urlQueryString.match(updateRegex) !== null) { // If param exists already, update it
            params = urlQueryString.replace(updateRegex, "$1" + newParam);
    
        } else if (urlQueryString == '') { // If there are no query strings
            params = '?' + newParam;
        } else { // Otherwise, add it to end of query string
            params = urlQueryString + '&' + newParam;
        }
    }

    // no parameter was set so we don't need the question mark
    params = params === '?' ? '' : params;

    return baseUrl + params;
}

// function getAllItemsInSession(){
//     // load all items added to cart from localStorage
//     const allItems = {}
//     for(let i = 0; i < Object.keys(localStorage).length; i++){
//         console.log(Object.keys(localStorage)[i])
//         if(Object.keys(localStorage)[i].includes('buy*')){
//             allItems[Object.keys(localStorage)[i]] = Object.values(localStorage)[i]
//         }
//     }
//     return allItems
// }


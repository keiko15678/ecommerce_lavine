function showmenu(){
    let nav = document.getElementById("dropdown")
    let menu = document.getElementById("dropdown-menu")
    let sales = document.getElementById("sales")
    let cond = menu.getAttribute("style")
    if(cond.includes("block")){        
        menu.setAttribute("style", "display: none;")
        // sales.setAttribute("style", "display: block;")
    }
    else{
        menu.setAttribute("style", "display: block;")
        // sales.setAttribute("style", "display: none;")
    }
}


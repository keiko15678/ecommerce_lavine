const nav = document.getElementById("dropdown");
nav.addEventListener('click', event =>{ 
    let menu = document.getElementById("dropdown-menu");
    const cond = menu.getAttribute("style");
    if(cond.includes("block")){        
        menu.setAttribute("style", "display: none;");
        // sales.setAttribute("style", "display: block;")
    }
    else{
        menu.setAttribute("style", "display: block;");
        // sales.setAttribute("style", "display: none;")
    }
})


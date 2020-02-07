modalActivate('guide-modal', 'guide-close', 'links-first-child')
modalActivate('faq-modal', 'faq-close', 'faq')
modalActivate('help-modal', 'help-close', 'help-desk')

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

document.getElementById('signup-form').addEventListener('submit', event =>{
    
})
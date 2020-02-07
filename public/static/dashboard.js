axios.get('/getUserInfo')
    .then(user => {
        const { address, email, firstName, lastName, postal, state } = user.data;
        document.getElementById('user-name').innerText = firstName;
        document.getElementById('firstName').innerText = firstName;
        document.getElementById('lastName').innerText = lastName;
        document.getElementById('address').innerText = address;
        document.getElementById('state').innerText = state;
        document.getElementById('zipcode').innerText = postal;
        document.getElementById('edit-firstName').addEventListener('click', event =>{
            document.getElementById('help-modal').style = 'display: block';
            document.getElementById('label-name').innerText += ' First Name';
            document.getElementById('dataType').value = 'firstName';
        })
    });


document.getElementById('help-close').addEventListener('click', event =>{
    document.getElementById('help-modal').style = 'display: none';
})
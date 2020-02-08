axios.get('/getUserInfo')
    .then(user => {
        const { address, email, firstName, lastName, city, postal, state, country } = user.data;
        document.getElementById('user-name').innerText = firstName;
        document.getElementById('firstName').innerText = firstName;
        document.getElementById('email').innerText = email;
        document.getElementById('lastName').innerText = lastName;
        document.getElementById('address').innerText = address;
        document.getElementById('city').innerText = city;
        document.getElementById('state').innerText = state;
        document.getElementById('country').innerText = country;
        document.getElementById('zipcode').innerText = postal;
        document.getElementById('edit-firstName').addEventListener('click', event =>{
            document.getElementById('help-modal').style = 'display: block';
            document.getElementById('label-name').innerText = 'First Name';
            document.getElementById('updateField').value = 'firstName';
        })
        document.getElementById('edit-lastName').addEventListener('click', event =>{
            document.getElementById('help-modal').style = 'display: block';
            document.getElementById('label-name').innerText = 'Last Name';
            document.getElementById('updateField').value = 'lastName';
        })
        document.getElementById('edit-email').addEventListener('click', event =>{
            document.getElementById('help-modal').style = 'display: block';
            document.getElementById('label-name').innerText = 'Email';
            document.getElementById('updateField').value = 'email';
        })
        document.getElementById('edit-address').addEventListener('click', event =>{
            document.getElementById('help-modal').style = 'display: block';
            document.getElementById('label-name').innerText = 'Address';
            document.getElementById('updateField').value = 'address';
        })
        document.getElementById('edit-city').addEventListener('click', event =>{
            document.getElementById('help-modal').style = 'display: block';
            document.getElementById('label-name').innerText = 'City';
            document.getElementById('updateField').value = 'city';
        })
        document.getElementById('edit-state').addEventListener('click', event =>{
            document.getElementById('help-modal').style = 'display: block';
            document.getElementById('label-name').innerText = 'State';
            document.getElementById('updateField').value = 'state';
        })
        document.getElementById('edit-country').addEventListener('click', event =>{
            document.getElementById('help-modal').style = 'display: block';
            document.getElementById('label-name').innerText = 'Country';
            document.getElementById('updateField').value = 'country';
        })
        document.getElementById('edit-zipcode').addEventListener('click', event =>{
            document.getElementById('help-modal').style = 'display: block';
            document.getElementById('label-name').innerText = 'Zipcode';
            document.getElementById('updateField').value = 'postal';
        })      
    });

document.getElementById('help-close').addEventListener('click', event =>{
    document.getElementById('help-modal').style = 'display: none';
})
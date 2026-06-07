import { supabase } from './supabase.js';

const form =
document.getElementById('registrationForm');

form.addEventListener(
'submit',
async (e) => {

e.preventDefault();

const nama =
document.getElementById('fullName').value;

const username =
document.getElementById('username').value;

const email =
document.getElementById('email').value;

const password =
document.getElementById('password').value;

const confirmPassword =
document.getElementById('confirmPassword').value;

if(password !== confirmPassword){

    alert('Password tidak sama');

    return;
}

if(password.length < 6){

    alert('Password minimal 6 karakter');

    return;
}

const { data, error } =
await supabase.auth.signUp({

    email,
    password

});

if(error){

    alert(error.message);

    return;
}

const { error: profileError } =
await supabase
.from('profiles')
.insert([
{
    id: data.user.id,
    nama: nama,
    username: username,
    email: email,
    role: 'user'
}
]);

if(profileError){

    alert(profileError.message);

    return;
}

alert('Registrasi berhasil');

window.location.href =
'login.html';

});
import { supabase } from './supabase.js';

const {
    data:{user}
}
=
await supabase.auth.getUser();

if(!user){

    window.location.href =
    'login.html';

}

document
.getElementById('passwordForm')
.addEventListener(
'submit',
async(e)=>{

e.preventDefault();

const password =
document.getElementById('newPassword').value;

const confirm =
document.getElementById('confirmPassword').value;

if(password !== confirm){

    alert(
        'Konfirmasi password tidak sama'
    );

    return;
}

if(password.length < 6){

    alert(
        'Password minimal 6 karakter'
    );

    return;
}

const { error } =
await supabase.auth.updateUser({

    password: password

});

if(error){

    alert(error.message);

    return;
}

alert(
'Password berhasil diubah'
);

window.location.href =
'profile.html';

});
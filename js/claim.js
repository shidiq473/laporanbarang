import { supabase } from './supabase.js';

const {
    data: { user }
}
=
await supabase.auth.getUser();

if(!user){

    window.location.href =
    'login.html';

}

const params =
new URLSearchParams(
window.location.search
);

const reportId =
params.get('id');

document
.getElementById('claimForm')
.addEventListener(
'submit',
async(e)=>{

e.preventDefault();

const alasan =
document.getElementById('alasan').value;

const bukti =
document.getElementById('bukti').value;

const { error } =
await supabase
.from('claims')
.insert([{

    report_id: reportId,

    claimant_id: user.id,

    alasan,

    bukti_kepemilikan: bukti

}]);

if(error){

    alert(error.message);

    return;
}

alert(
'Klaim berhasil dikirim'
);

window.location.href =
'dashboard.html';

});
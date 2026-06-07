import { supabase } from './supabase.js';

// =======================
// CEK LOGIN
// =======================

const {
    data:{user}
}
=
await supabase.auth.getUser();

if(!user){

    window.location.href =
    'login.html';

}

// =======================
// AMBIL PROFILE
// =======================

const {
    data: profile,
    error
}
=
await supabase
.from('profiles')
.select('*')
.eq('id', user.id)
.single();

if(error){

    console.log(error);

}

// =======================
// TOTAL REPORT
// =======================

const {
    data: reports
}
=
await supabase
.from('reports')
.select('id')
.eq('user_id', user.id);

// =======================
// TAMPILKAN DATA
// =======================

// safe fallbacks if profile or reports are missing
const displayName = profile?.username || profile?.nama || 'Nama Tidak Diketahui';
const displayEmail = profile?.email || '-';
const displayUsername = profile?.username || '-';
const displayRole = profile?.role || '-';
const displayCreatedAt = profile?.created_at ? new Date(profile.created_at).toLocaleDateString('id-ID') : '-';
const totalReports = Array.isArray(reports?.data ?? reports) ? (reports.data ?? reports).length : (reports?.length ?? 0);

const elNama = document.getElementById('nama');
const elEmail = document.getElementById('email');
const elUsername = document.getElementById('username');
const elRole = document.getElementById('role');
const elCreatedAt = document.getElementById('createdAt');
const elTotalReports = document.getElementById('totalReports');

if(elNama) elNama.textContent = displayName;
if(elEmail) elEmail.textContent = displayEmail;
if(elUsername) elUsername.textContent = displayUsername;
if(elRole) elRole.textContent = displayRole;
if(elCreatedAt) elCreatedAt.textContent = displayCreatedAt;
if(elTotalReports) elTotalReports.textContent = totalReports;

// =======================
// AVATAR
// =======================

const elAvatar = document.getElementById('avatar');
if(elAvatar){
    const initial = profile?.nama?.charAt(0)?.toUpperCase() || profile?.username?.charAt(0)?.toUpperCase() || '';
    elAvatar.textContent = initial;
}

// =======================
// GANTI PASSWORD
// =======================

const passwordBtn = document.getElementById('passwordBtn');
if(passwordBtn) passwordBtn.addEventListener('click', ()=>{
    window.location.href = 'change-password.html';
});
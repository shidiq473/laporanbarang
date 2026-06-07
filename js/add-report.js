import { supabase } from './supabase.js';

// Ambil user login
const {
    data: { user }
}
=
await supabase.auth.getUser();

if(!user){

    window.location.href =
    'login.html';

}

// Load kategori dari database

const {
    data: categories,
    error: categoryError
}
=
await supabase
.from('categories')
.select('*')
.order('nama_kategori');

const kategoriSelect =
document.getElementById('kategori');

kategoriSelect.innerHTML =
'<option value="">Pilih Kategori Barang</option>';

if(categoryError){

    console.log(categoryError);

}else{

    categories.forEach(category => {

        kategoriSelect.innerHTML += `
        <option value="${category.id}">
            ${category.nama_kategori}
        </option>
        `;

    });

}

// Simpan laporan
document
.getElementById('reportForm')
.addEventListener('submit',
async(e)=>{

e.preventDefault();

const report = {

    user_id: user.id,

    category_id:
    document.getElementById('kategori').value,

    nama_barang:
    document.getElementById('nama_barang').value,

    deskripsi:
    document.getElementById('deskripsi').value,

    lokasi:
    document.getElementById('lokasi').value,

    tanggal_kejadian:
    document.getElementById('tanggal').value,

    tipe_laporan:
    document.getElementById('tipe').value

};

const {
    error
}
=
await supabase
.from('reports')
.insert([report]);

if(error){

    alert(error.message);

    return;
}

alert(
'Laporan berhasil dibuat'
);

window.location.href =
'dashboard.html';

});
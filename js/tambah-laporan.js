import { supabase } from './supabase.js';

const {
    data: { user }
} = await supabase.auth.getUser();

if(!user){

    window.location.href =
    'login.html';
}

// Load kategori
const { data: categories } =
await supabase
.from('categories')
.select('*');

const select =
document.getElementById('category');

categories.forEach(cat=>{

    select.innerHTML += `
    <option value="${cat.id}">
        ${cat.nama_kategori}
    </option>
    `;
});

// Submit laporan
document
.getElementById('reportForm')
.addEventListener('submit', async(e)=>{

    e.preventDefault();

    const { error } =
    await supabase
    .from('reports')
    .insert([{

        user_id: user.id,

        category_id:
        document.getElementById('category').value,

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

    }]);

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
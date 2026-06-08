import { supabase } from './supabase.js';

// ==========================
// CEK LOGIN
// ==========================

const {
    data: { user }
} = await supabase.auth.getUser();

if (!user) {
    window.location.href = 'login.html';
}

// ==========================
// LOGOUT
// ==========================

document
.getElementById('logoutBtn')
?.addEventListener('click', async () => {

    await supabase.auth.signOut();

    window.location.href = 'login.html';

});

// ==========================
// LOAD KATEGORI
// ==========================

async function loadCategories() {

    const {
        data,
        error
    } = await supabase
        .from('categories')
        .select('*')
        .order('nama_kategori');

    if (error) {

        console.log(error);

        return;
    }

    const select =
    document.getElementById('category');

    select.innerHTML =
    '<option value="">Pilih Kategori</option>';

    data.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${item.nama_kategori}
            </option>
        `;

    });

}

// ==========================
// CEK MODE EDIT
// ==========================

const params =
new URLSearchParams(
    window.location.search
);

const reportId =
params.get('id');

if (reportId) {

    document.getElementById('pageTitle').textContent =
    'Edit Laporan';

    document.getElementById('submitBtn').textContent =
    'Update Laporan';

}

// ==========================
// LOAD DATA LAPORAN
// ==========================

async function loadReportData() {

    if (!reportId) return;

    const {
        data,
        error
    } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .single();

    if (error) {

        console.log(error);

        alert('Gagal mengambil data laporan');

        return;

    }

    document.getElementById('namaBarang').value =
    data.nama_barang || '';

    document.getElementById('deskripsi').value =
    data.deskripsi || '';

    document.getElementById('lokasi').value =
    data.lokasi || '';

    document.getElementById('tipeLaporan').value =
    data.tipe_laporan || '';

    document.getElementById('category').value =
    data.category_id || '';

}

// ==========================
// SUBMIT FORM
// ==========================

document
.getElementById('reportForm')
.addEventListener(
'submit',
async(e)=>{

    e.preventDefault();

    const nama_barang =
    document.getElementById('namaBarang').value;

    const deskripsi =
    document.getElementById('deskripsi').value;

    const lokasi =
    document.getElementById('lokasi').value;

    const tipe_laporan =
    document.getElementById('tipeLaporan').value;

    const category_id =
    document.getElementById('category').value;

    // ======================
    // MODE EDIT
    // ======================

    if(reportId){

        const {
            error
        }
        =
        await supabase
        .from('reports')
        .update({

            nama_barang,
            deskripsi,
            lokasi,
            tipe_laporan,
            category_id

        })
        .eq('id', reportId);

        if(error){

            console.log(error);

            alert(
                'Gagal mengupdate laporan'
            );

            return;
        }

        alert(
            'Laporan berhasil diperbarui'
        );

        window.location.href =
        'dashboard.html';

        return;

    }

    // ======================
    // MODE TAMBAH
    // ======================

    const {
        error
    }
    =
    await supabase
    .from('reports')
    .insert([{

        nama_barang,
        deskripsi,
        lokasi,
        tipe_laporan,
        category_id,

        user_id:
        user.id,

        status:
        'aktif'

    }]);

    if(error){

        console.log(error);

        alert(
            'Gagal menambahkan laporan'
        );

        return;

    }

    alert(
        'Laporan berhasil ditambahkan'
    );

    window.location.href =
    'dashboard.html';

});

// ==========================
// INIT
// ==========================

await loadCategories();

await loadReportData();
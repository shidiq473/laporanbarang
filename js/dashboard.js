import { supabase } from './supabase.js';

// =========================
// CEK LOGIN
// =========================

const {
    data: { user }
} = await supabase.auth.getUser();

if (!user) {

    window.location.href = 'login.html';

}

// =========================
// LOGOUT
// =========================

document
.getElementById('logoutBtn')
?.addEventListener('click', async () => {

    await supabase.auth.signOut();

    window.location.href = 'login.html';

});

// =========================
// AMBIL SEMUA LAPORAN
// =========================

const {
    data: reports,
    error
}
=
await supabase
.from('reports')
.select(`
    *,
    categories (
        nama_kategori
    )
`)
.order(
    'created_at',
    {
        ascending: false
    }
);

if (error) {

    console.log(error);

    alert(
        'Gagal mengambil data laporan'
    );

}

// =========================
// STATISTIK
// =========================

const total =
reports?.length || 0;

const lost =
reports?.filter(
    r => r.tipe_laporan === 'hilang'
).length || 0;

const found =
reports?.filter(
    r => r.tipe_laporan === 'ditemukan'
).length || 0;

const completed =
reports?.filter(
    r => r.status === 'selesai'
).length || 0;

// isi statistik jika elemennya ada

document.getElementById('totalReports')
&& (
    document.getElementById('totalReports').textContent = total
);

document.getElementById('lostReports')
&& (
    document.getElementById('lostReports').textContent = lost
);

document.getElementById('foundReports')
&& (
    document.getElementById('foundReports').textContent = found
);

document.getElementById('completedReports')
&& (
    document.getElementById('completedReports').textContent = completed
);

// =========================
// TABEL LAPORAN
// =========================

const table =
document.getElementById('reportTable');

if (table) {

    table.innerHTML = '';

    if (!reports || reports.length === 0) {

        table.innerHTML = `

        <tr>

            <td
            colspan="6"
            class="text-center p-8 text-gray-500">

                Belum ada laporan

            </td>

        </tr>

        `;

    } else {

        reports.forEach(report => {

            let aksiButton = '';

            // =========================
            // MILIK SENDIRI
            // =========================

            if (report.user_id === user.id) {

                aksiButton = `

                    <button
                        onclick="editReport('${report.id}')"
                        class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">

                        Edit

                    </button>

                    <button
                        onclick="deleteReport('${report.id}')"
                        class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded ml-2">

                        Hapus

                    </button>

                `;

            }

            // =========================
            // MILIK ORANG LAIN
            // =========================

            else {

                aksiButton = `

                    <button
                        onclick="claimItem('${report.id}')"
                        class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">

                        Klaim Barang

                    </button>

                `;

            }

            table.innerHTML += `

            <tr class="border-b hover:bg-gray-50">

                <td class="p-4">

                    ${report.nama_barang}

                </td>

                <td class="p-4">

                    ${report.categories?.nama_kategori ?? '-'}

                </td>

                <td class="p-4 capitalize">

                    ${report.tipe_laporan}

                </td>

                <td class="p-4">

                    ${report.lokasi}

                </td>

                <td class="p-4">

                    <span class="
                        px-3 py-1 rounded-full text-sm

                        ${
                            report.status === 'aktif'
                            ? 'bg-yellow-100 text-yellow-700'
                            : report.status === 'diproses'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }
                    ">

                        ${report.status}

                    </span>

                </td>

                <td class="p-4">

                    ${aksiButton}

                </td>

            </tr>

            `;

        });

    }

}

// =========================
// EDIT LAPORAN
// =========================

window.editReport = function(id){

    window.location.href =
    `create-report.html?id=${id}`;

};

// =========================
// HAPUS LAPORAN
// =========================

window.deleteReport = async function(id){

    const konfirmasi =
    confirm(
        'Yakin ingin menghapus laporan ini?'
    );

    if(!konfirmasi) return;

    const {
        error
    }
    =
    await supabase
    .from('reports')
    .delete()
    .eq('id', id);

    if(error){

        alert(error.message);

        return;

    }

    alert(
        'Laporan berhasil dihapus'
    );

    location.reload();

};

// =========================
// KLAIM BARANG
// =========================

window.claimItem = function(id){

    window.location.href =
    `claim.html?id=${id}`;

};
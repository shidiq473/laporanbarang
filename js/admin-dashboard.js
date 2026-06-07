import { supabase } from './supabase.js';

// ==========================
// CEK LOGIN + ROLE ADMIN
// ==========================
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
    window.location.href = 'login.html';
}

// cek apakah user admin
const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

if (!profile || profile.role !== 'admin') {
    alert('Akses ditolak: hanya admin');
    window.location.href = 'dashboard.html';
}

// ==========================
// LOGOUT
// ==========================
document.getElementById('logoutBtn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
});

// ==========================
// LOAD ALL REPORTS
// ==========================
async function loadReports() {

    const { data: reports, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    renderTable(reports);
    renderStats(reports);
}

// ==========================
// RENDER STATISTIK
// ==========================
function renderStats(reports) {

    const total = reports.length;

    const lost = reports.filter(r => r.tipe_laporan === 'hilang').length;

    const found = reports.filter(r => r.tipe_laporan === 'ditemukan').length;

    const completed = reports.filter(r => r.status === 'selesai').length;

    document.getElementById('totalReports').textContent = total;
    document.getElementById('lostReports').textContent = lost;
    document.getElementById('foundReports').textContent = found;
    document.getElementById('completedReports').textContent = completed;
}

// ==========================
// RENDER TABLE
// ==========================
function renderTable(reports) {

    const table = document.getElementById('reportTable');

    table.innerHTML = '';

    reports.forEach(report => {

        table.innerHTML += `
        <tr class="border-b hover:bg-slate-50">

            <td class="p-4 font-semibold">
                ${report.nama_barang}
            </td>

            <td class="p-4 capitalize">
                ${report.tipe_laporan}
            </td>

            <td class="p-4">
                ${report.user_id}
            </td>

            <td class="p-4">
                ${report.lokasi}
            </td>

            <td class="p-4">
                <span class="
                    px-3 py-1 rounded-full text-sm
                    ${statusColor(report.status)}
                ">
                    ${report.status}
                </span>
            </td>

            <td class="p-4 flex gap-2">

                <!-- KLAIM / PROSES -->
                <button onclick="processReport('${report.id}', '${report.status}')"
                    class="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">

                    Proses

                </button>

                <!-- SELESAI -->
                <button onclick="finishReport('${report.id}')"
                    class="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">

                    Selesai

                </button>

            </td>

        </tr>
        `;
    });
}

// ==========================
// STATUS COLOR
// ==========================
function statusColor(status) {

    if (status === 'aktif') return 'bg-yellow-100 text-yellow-700';

    if (status === 'diproses') return 'bg-blue-100 text-blue-700';

    if (status === 'selesai') return 'bg-green-100 text-green-700';

    return 'bg-gray-100 text-gray-600';
}

// ==========================
// PROSES REPORT (CLAIM ADMIN)
// ==========================
window.processReport = async function (id, currentStatus) {

    let newStatus = 'diproses';

    if (currentStatus === 'diproses') {
        newStatus = 'diproses';
    }

    const { error } = await supabase
        .from('reports')
        .update({ status: newStatus })
        .eq('id', id);

    if (error) {
        alert('Gagal update status');
        return;
    }

    loadReports();
};

// ==========================
// SELESAIKAN REPORT
// ==========================
window.finishReport = async function (id) {

    const { error } = await supabase
        .from('reports')
        .update({ status: 'selesai' })
        .eq('id', id);

    if (error) {
        alert('Gagal menyelesaikan laporan');
        return;
    }

    loadReports();
};

// ==========================
// INIT
// ==========================
loadReports();
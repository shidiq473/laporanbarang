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
// CEK ROLE ADMIN
// ==========================
const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

if (!profile || profile.role !== 'admin') {
    alert('Akses ditolak');
    window.location.href = 'dashboard.html';
}

// ==========================
// LOGOUT
// ==========================
const logoutBtn = document.getElementById('logoutBtn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = 'login.html';
    });
}

// ==========================
// WARNA STATUS
// ==========================
const statusColor = (status) => {
    switch (status) {
        case 'aktif':
            return 'bg-yellow-100 text-yellow-700';

        case 'diproses':
            return 'bg-blue-100 text-blue-700';

        case 'selesai':
            return 'bg-green-100 text-green-700';

        default:
            return 'bg-gray-100 text-gray-700';
    }
};

// ==========================
// LOAD REPORTS
// ==========================
async function loadReports() {
    const { data: reports, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Supabase Error:', error);
        return;
    }

    console.log('DATA REPORT:', reports);

    renderStats(reports || []);
    renderTable(reports || []);
}

// ==========================
// STATISTIK
// ==========================
function renderStats(reports) {
    document.getElementById('totalReports').textContent =
        reports.length;

    document.getElementById('lostReports').textContent =
        reports.filter(r => r.tipe_laporan === 'hilang').length;

    document.getElementById('foundReports').textContent =
        reports.filter(r => r.tipe_laporan === 'ditemukan').length;

    document.getElementById('completedReports').textContent =
        reports.filter(r => r.status === 'selesai').length;
}

// ==========================
// TAMPILKAN REPORT
// ==========================
function renderTable(reports) {

    const table = document.getElementById('reportTable');

    if (!table) {
        console.error('Element #reportTable tidak ditemukan');
        return;
    }

    if (!reports.length) {
        table.innerHTML = `
            <div class="col-span-full text-center text-gray-500 py-10">
                Belum ada laporan
            </div>
        `;
        return;
    }

    let html = '';

    reports.forEach(report => {

        html += `
        <div class="border rounded-xl p-5 shadow hover:shadow-lg transition">

            <h3 class="text-lg font-bold mb-3">
                ${report.nama_barang || '-'}
            </h3>

            <div class="space-y-2 text-sm">

                <p>
                    <strong>Tipe:</strong>
                    ${report.tipe_laporan || '-'}
                </p>

                <p>
                    <strong>Lokasi:</strong>
                    ${report.lokasi || '-'}
                </p>

                <p>
                    <strong>Status:</strong>

                    <span class="px-3 py-1 rounded-full text-sm ${statusColor(report.status)}">
                        ${report.status || '-'}
                    </span>
                </p>

            </div>

            <div class="flex gap-2 mt-4">

                <button
                    onclick="processReport('${report.id}')"
                    class="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">
                    Proses
                </button>

                <button
                    onclick="finishReport('${report.id}')"
                    class="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600">
                    Selesai
                </button>

            </div>

        </div>
        `;
    });

    table.innerHTML = html;
}

// ==========================
// PROSES REPORT
// ==========================
window.processReport = async (id) => {

    const { error } = await supabase
        .from('reports')
        .update({
            status: 'diproses'
        })
        .eq('id', id);

    if (error) {
        console.error(error);
        alert('Gagal update status');
        return;
    }

    await loadReports();
};

// ==========================
// SELESAIKAN REPORT
// ==========================
window.finishReport = async (id) => {

    const { error } = await supabase
        .from('reports')
        .update({
            status: 'selesai'
        })
        .eq('id', id);

    if (error) {
        console.error(error);
        alert('Gagal update status');
        return;
    }

    await loadReports();
};

// ==========================
// INIT
// ==========================
loadReports();
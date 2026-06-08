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
        <div class="bg-white border rounded-xl p-5 shadow hover:shadow-lg transition">

            <h3 class="text-lg font-bold mb-3">
                ${report.nama_barang}
            </h3>

            <div class="space-y-2 text-sm">

                <p>
                    <strong>Tipe:</strong>
                    ${report.tipe_laporan}
                </p>

                <p>
                    <strong>User:</strong>
                    ${report.user_id}
                </p>

                <p>
                    <strong>Lokasi:</strong>
                    ${report.lokasi}
                </p>

                <p>
                    <strong>Status:</strong>

                    <span class="
                        px-3 py-1 rounded-full text-sm
                        ${statusColor(report.status)}
                    ">
                        ${report.status}
                    </span>
                </p>

            </div>

            <div class="flex gap-2 mt-4">

                <button
                    onclick="processReport('${report.id}','${report.status}')"
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
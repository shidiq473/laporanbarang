import { supabase } from './supabase.js';

// ====================
// CEK LOGIN ADMIN
// ====================

const {
    data:{user}
}
=
await supabase.auth.getUser();

if(!user){

    window.location.href =
    'login.html';

}

const {
    data: profile
}
=
await supabase
.from('profiles')
.select('role')
.eq('id', user.id)
.single();

if(profile?.role !== 'admin'){

    alert(
        'Akses ditolak'
    );

    window.location.href =
    'dashboard.html';

}

// ====================
// LOAD REPORTS
// ====================

async function loadReports(){

    const {
        data: reports,
        error
    }
    =
    await supabase
    .from('reports')
    .select(`
        *,
        categories(
            nama_kategori
        )
    `)
    .order(
        'created_at',
        {
            ascending:false
        }
    );

    if(error){

        console.log(error);

        return;

    }

    renderReports(reports);

}

// ====================
// RENDER TABLE
// ====================

function renderReports(reports){

    const table =
    document.getElementById('reportTable');

    table.innerHTML = '';

    if(reports.length === 0){

        table.innerHTML = `
        <tr>
            <td colspan="4" class="p-10 text-center text-gray-500">
                Belum ada laporan
            </td>
        </tr>
        `;

        return;
    }

    reports.forEach(report=>{

        table.innerHTML += `

        <tr class="border-b hover:bg-slate-50">

            <td class="p-4">

                <div>

                    <p class="font-semibold">
                        ${report.nama_barang}
                    </p>

                    <p class="text-sm text-gray-500">
                        ${report.categories?.nama_kategori || '-'}
                    </p>

                </div>

            </td>

            <td class="p-4">
                ${report.lokasi}
            </td>

            <td class="p-4">
                ${report.tanggal_kejadian}
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

        </tr>

        `;

    });

}
// ====================
// DETAIL
// ====================

window.viewDetail = function(id){

    window.location.href =
    `report-detail.html?id=${id}`;

}

// ====================
// SEARCH
// ====================

document
.getElementById('searchInput')
.addEventListener(
'input',
(e)=>{

    const keyword =
    e.target.value.toLowerCase();

    document
    .querySelectorAll(
        '#reportTable tr'
    )
    .forEach(row=>{

        row.style.display =
        row.innerText
        .toLowerCase()
        .includes(keyword)
        ? ''
        : 'none';

    });

});

// ====================
// FILTER STATUS
// ====================

document
.getElementById('statusFilter')
.addEventListener(
'change',
(e)=>{

    const status =
    e.target.value;

    document
    .querySelectorAll(
        '#reportTable tr'
    )
    .forEach(row=>{

        if(
            status === 'all'
        ){

            row.style.display='';

            return;

        }

        row.style.display =
        row.innerText
        .toLowerCase()
        .includes(status)
        ? ''
        : 'none';

    });

});

// ====================

loadReports();
document.getElementById('reportCount').textContent =
`${reports.length} laporan ditemukan`;
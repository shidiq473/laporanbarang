import { supabase } from './supabase.js';

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
.eq('user_id', user.id)
.order('created_at',{
ascending:false
});

if(error){

console.log(error);

}

const table =
document.getElementById('reportTable');

reports.forEach(report=>{

table.innerHTML += `

<tr class="border-b">

    <td class="p-4">

        <a
        href="report-detail.html?id=${report.id}"
        class="text-blue-700 hover:underline">

            ${report.nama_barang}

        </a>

    </td>

    <td class="p-4">

        ${report.categories?.nama_kategori || '-'}

    </td>

    <td class="p-4 capitalize">

        ${report.tipe_laporan}

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

        <button
        onclick="editReport(${report.id})"
        class="bg-blue-500 text-white px-3 py-1 rounded">

            Edit

        </button>

        <button
        onclick="deleteReport(${report.id})"
        class="bg-red-500 text-white px-3 py-1 rounded ml-2">

            Hapus

        </button>

    </td>

</tr>

`;

});

// SEARCH

document
.getElementById('searchInput')
.addEventListener(
'input',
(e)=>{

const keyword =
e.target.value.toLowerCase();

document
.querySelectorAll('#reportTable tr')
.forEach(row=>{

row.style.display =
row.innerText
.toLowerCase()
.includes(keyword)
? ''
: 'none';

});

});

// EDIT

window.editReport = function(id){

window.location.href =
`edit-report.html?id=${id}`;

}

// DELETE

window.deleteReport = async function(id){

const yakin =
confirm(
'Hapus laporan ini?'
);

if(!yakin) return;

const { error } =
await supabase
.from('reports')
.delete()
.eq('id', id);

if(error){

alert(error.message);

return;

}

location.reload();

}
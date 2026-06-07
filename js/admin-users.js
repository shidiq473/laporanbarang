import { supabase } from './supabase.js';

// =====================
// CEK ADMIN
// =====================

const {
    data: { user }
} = await supabase.auth.getUser();

if (!user) {

    window.location.href = 'login.html';

}

const {
    data: profile
} = await supabase
.from('profiles')
.select('role')
.eq('id', user.id)
.single();

if (!profile || profile.role !== 'admin') {

    alert('Akses ditolak');

    window.location.href = 'dashboard.html';

}

// =====================
// LOGOUT
// =====================

document
.getElementById('logoutBtn')
.addEventListener(
'click',
async () => {

    await supabase.auth.signOut();

    window.location.href = 'login.html';

});

// =====================
// LOAD USER
// =====================

async function loadUsers() {

    const {
        data: users,
        error
    } =
    await supabase
    .from('profiles')
    .select('*')
    .order('created_at', {
        ascending: false
    });

    if (error) {

        console.log(error);

        return;

    }

    console.log('DATA USER:', users);

    renderUsers(users);

}

// =====================
// FORMAT AKTIVITAS
// =====================

function formatLastLogin(lastLogin) {

    if (!lastLogin) {

        return 'Belum pernah login';

    }

    return new Date(lastLogin)
.toLocaleString('id-ID', {

    timeZone: 'Asia/Jakarta',

    day: '2-digit',
    month: 'short',
    year: 'numeric',

    hour: '2-digit',
    minute: '2-digit'

});

}

// =====================
// RENDER USER
// =====================

function renderUsers(users) {

    const table =
    document.getElementById('userTable');

    table.innerHTML = '';

    if (!users || users.length === 0) {

        table.innerHTML = `

        <tr>

            <td
            colspan="5"
            class="p-8 text-center text-gray-500">

                Tidak ada data pengguna

            </td>

        </tr>

        `;

        return;

    }

    users.forEach(item => {

        table.innerHTML += `

        <tr class="border-b hover:bg-slate-50">

            <td class="p-4">
                ${item.nama || '-'}
            </td>

            <td class="p-4">
                ${item.email}
            </td>

            <td class="p-4">

                <span class="
                px-3 py-1 rounded-full text-sm

                ${
                    item.role === 'admin'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                }">

                    ${item.role}

                </span>

            </td>

            <td class="p-4">

                ${
                    item.created_at
                    ?
                    new Date(item.created_at)
                    .toLocaleDateString('id-ID')
                    :
                    '-'
                }

            </td>

            <td class="p-4 text-gray-600">

                ${formatLastLogin(item.last_login)}

            </td>

        </tr>

        `;

    });

}

// =====================
// INIT
// =====================

loadUsers();
import { supabase } from './supabase.js';

console.log("login.js berhasil dimuat");

const form = document.getElementById('loginForm');

form.addEventListener('submit', async (e) => {

    e.preventDefault();

    const identifier =
        document.getElementById('identifier').value.trim();

    const password =
        document.getElementById('password').value;

    let email = identifier;

    // Login menggunakan username
    if (!identifier.includes('@')) {

        const {
            data: profile,
            error: profileError
        } = await supabase
            .from('profiles')
            .select('email')
            .eq('username', identifier)
            .maybeSingle();

        if (profileError || !profile) {

            alert('Username tidak ditemukan');

            console.log(profileError);

            return;
        }

        email = profile.email;
    }

    // LOGIN AUTH
    const {
        data,
        error
    } = await supabase.auth.signInWithPassword({

        email,
        password

    });

    console.log("LOGIN DATA:", data);
    console.log("LOGIN ERROR:", error);

    if (error) {

        alert(error.message);

        return;
    }

    // UPDATE LAST LOGIN
    const {
        error: loginUpdateError
    } = await supabase
        .from('profiles')
        .update({
            last_login: new Date().toISOString()
        })
        .eq('id', data.user.id);

    if (loginUpdateError) {

        console.log(
            'Gagal update last_login:',
            loginUpdateError
        );

    }

    // AMBIL ROLE USER
    const {
        data: userProfile,
        error: roleError
    } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

    console.log("PROFILE:", userProfile);
    console.log("ROLE ERROR:", roleError);

    if (roleError) {

        alert('Gagal mengambil role user');

        return;
    }

    if (!userProfile) {

        alert('Data profile tidak ditemukan');

        return;
    }

    // REDIRECT BERDASARKAN ROLE

    if (userProfile.role === 'admin') {

        window.location.href =
            'admin-dashboard.html';

    } else {

        window.location.href =
            'dashboard.html';

    }

});
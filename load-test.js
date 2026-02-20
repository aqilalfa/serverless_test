import http from 'k6/http';
import { check, sleep } from 'k6';

// -------------------------------------------------------------
// KONFIGURASI SKENARIO PENGUJIAN
// -------------------------------------------------------------
export const options = {
    scenarios: {
        // Skenario A: Sequential Load (Satu persatu menambah stok/order secara berurutan)
        scenario_a_sequential: {
            executor: 'shared-iterations',
            vus: 1, // 1 Virtual User
            iterations: 10, // Melakukan 10 requests total
            maxDuration: '1m', // Batas waktu maksimal
        },

        // Skenario B: Race Condition / Concurrency (Banyak pengguna mengakses bersamaan)
        scenario_b_concurrency: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '30s', target: 50 }, // Naik perlahan ke 50 User dalam 30 detik
                { duration: '1m', target: 50 },  // Bertahan di 50 User selama 1 menit (Stress Test)
                { duration: '30s', target: 0 },  // Turun perlahan
            ],
            gracefulRampDown: '30s',
        },
    },
};

// -------------------------------------------------------------
// VARIABEL PENGUJIAN
// -------------------------------------------------------------
// NANTI: Ganti URL ini dengan URL produksimu di Vercel, 
// contoh: 'https://spice-inventory.vercel.app/api/orders'
const BASE_URL = __ENV.API_URL || 'http://localhost:3000/api/orders';

export default function () {
    // 1. Mensimulasikan Skenario "Tambah Order (Transaksi)" - Method POST
    const payload = JSON.stringify({
        customer: `Test Customer ${__VU}-${__ITER}`,
        product: 'Gamis Kerah Motif', // Tembak produk spesifik
        quantity: Math.floor(Math.random() * 10) + 1, // Kuantitas acak 1-10
        deadline: '2026-12-31',
        notes: 'Load Testing Automated Request'
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Kirim POST Request
    const postRes = http.post(BASE_URL, payload, params);

    // Verifikasi response dari Serverless API
    check(postRes, {
        'POST status is 201': (r) => r.status === 201,
        'POST Transaction Time < 500ms': (r) => r.timings.duration < 500,
        'POST Transaction Time < 1000ms': (r) => r.timings.duration < 1000,
    });

    // Jeda acak antar request pengguna untuk mensimulasikan "Think Time" operator
    sleep(Math.random() * 2);

    // 2. Mensimulasikan Skenario "Tarik Laporan Dashboard" - Method GET
    const getRes = http.get(BASE_URL);

    check(getRes, {
        'GET status is 200': (r) => r.status === 200,
        'GET Transaction Time < 300ms': (r) => r.timings.duration < 300,
    });

    sleep(1);
}

const axios = require('axios');

async function createDeFiProject(slug, data, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(`https://api.defidex.com/projects/${slug}`, data);
      console.log(`✔️ Berhasil membuat proyek: ${slug}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          console.log(`✖️ Proyek ${slug} tidak ditemukan. Tidak akan retry.`);
          return null; // STOP di sini kalau 404
        } else {
          console.log(`⚠️ Gagal membuat proyek ${slug} (Percobaan ke-${attempt}): ${error.response.status}`);
        }
      } else {
        console.log(`⚠️ Error jaringan (Percobaan ke-${attempt}): ${error.message}`);
      }

      // Tunggu sebelum retry
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  console.log(`✖️ Gagal total buat proyek ${slug} setelah ${retries} kali.`);
  return null;
}

module.exports = { createDeFiProject };

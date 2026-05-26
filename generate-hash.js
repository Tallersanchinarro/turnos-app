const bcrypt = require('bcryptjs');

async function generate() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nCopia este hash a Neon:');
  console.log(`UPDATE usuarios SET password = '${hash}' WHERE email = 'admin@turnos.com';`);
}

generate();
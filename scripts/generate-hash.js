const bcrypt = require('bcryptjs');

const passwords = [
  { email: 'admin@turnos.com', password: 'admin123', rol: 'admin' },
  { email: 'ana@turnos.com', password: 'empleado123', rol: 'empleado' },
  { email: 'carlos@turnos.com', password: 'empleado123', rol: 'empleado' },
  { email: 'maria@turnos.com', password: 'empleado123', rol: 'supervisor' }
];

async function generateHashes() {
  console.log('=== GENERANDO HASHES PARA BCYPT ===\n');
  
  for (const user of passwords) {
    const hash = await bcrypt.hash(user.password, 10);
    console.log(`Email: ${user.email}`);
    console.log(`Password: ${user.password}`);
    console.log(`Hash: ${hash}`);
    console.log('---');
  }
  
  console.log('\n=== COPIA ESTOS HASHES A NEON ===');
}

generateHashes();
const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('❌ Error: Please provide a password as an argument');
  console.log('\nUsage:');
  console.log('  node scripts/hash-password.js yourPasswordHere');
  process.exit(1);
}

if (password.length < 8) {
  console.warn('⚠️  Warning: Password is less than 8 characters. Consider using a stronger password.');
}

const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('❌ Error generating hash:', err);
    process.exit(1);
  }

  console.log('\n✅ Password hash generated successfully!');
  console.log('\nAdd this to your .env.local file:');
  console.log(`\nADMIN_PASSWORD_HASH=${hash}`);
  console.log('\nYou can now remove ADMIN_PASSWORD from your .env.local\n');
});

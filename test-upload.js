const { put } = require('@vercel/blob');
require('dotenv').config();

async function test() {
  try {
    const blob = await put('test.txt', 'hello', {
      access: 'private', // Let's test with no access param first, or 'private'
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
    console.log(blob);
  } catch (e) {
    console.error(e);
  }
}
test();

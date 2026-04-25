import { eq } from 'drizzle-orm';
import { db } from './db/index.js';
import { demoUsers } from './db/schema/index.js';

async function main() {
  try {
    console.log('Performing CRUD operations...');

    // CREATE
    const newUserResult = await db
      .insert(demoUsers)
      .values({ name: 'Admin User', email: `admin-${Date.now()}@example.com` }) // unique email
      .returning();

    const newUser = newUserResult[0]!;
    console.log('✅ CREATE:', newUser);

    // READ
    const [foundUser] = await db.select().from(demoUsers).where(eq(demoUsers.id, newUser.id));
    console.log('✅ READ:', foundUser);

    // UPDATE
    const [updatedUser] = await db
      .update(demoUsers)
      .set({ name: 'Super Admin' })
      .where(eq(demoUsers.id, newUser.id))
      .returning();

    console.log('✅ UPDATE:', updatedUser);

    // DELETE
    await db.delete(demoUsers).where(eq(demoUsers.id, newUser.id));
    console.log('✅ DELETE complete');

    console.log('\\nFull CRUD successful!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();


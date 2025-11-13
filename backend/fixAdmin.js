const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');
require('dotenv').config();

async function fixAdminPassword() {
    try {
        // Connect to database
        const sequelize = new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USER,
            process.env.DB_PASSWORD,
            {
                host: process.env.DB_HOST,
                dialect: 'postgres',
                logging: false
            }
        );

        // Test password and hash
        const testPassword = 'Admin@123';
        console.log('🔐 Generating new hash for password:', testPassword);
        
        // Generate fresh hash
        const salt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(testPassword, salt);
        
        console.log('✅ New hash generated:', newHash);
        
        // Test the hash works
        const testCompare = await bcrypt.compare(testPassword, newHash);
        console.log('✅ Hash verification test:', testCompare ? 'PASSED' : 'FAILED');
        
        if (!testCompare) {
            console.error('❌ Hash generation failed!');
            process.exit(1);
        }

        // Update database
        console.log('\n📝 Updating database...');
        
        await sequelize.query(`
            UPDATE users 
            SET password_hash = :hash,
                updated_at = NOW()
            WHERE username = 'admin'
        `, {
            replacements: { hash: newHash }
        });

        console.log('✅ Admin password updated successfully!\n');
        
        // Verify in database
        const [users] = await sequelize.query(`
            SELECT username, email, role, status 
            FROM users 
            WHERE username = 'admin'
        `);
        
        console.log('👤 Admin user details:');
        console.log(users[0]);
        
        console.log('\n🎉 All done! Try logging in now with:');
        console.log('   Username: admin');
        console.log('   Password: Admin@123\n');
        
        await sequelize.close();
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

fixAdminPassword();

const fs = require('fs-extra');
const path = require('path');

const sourceDir = path.join(__dirname, 'generated');
const targetDir = path.join(__dirname, 'dist', 'generated');

async function copyGeneratedFolder() {
    try {
        // Ensure the target directory exists
        await fs.ensureDir(targetDir);

        // Copy the folder
        await fs.copy(sourceDir, targetDir);

        console.log('Successfully copied generated folder to dist/generated');
    } catch (err) {
        console.error('Error copying generated folder:', err);
        process.exit(1);
    }
}

copyGeneratedFolder();

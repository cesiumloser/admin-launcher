console.log(`
=======================================
        ADMIN LAUNCHER v1.0
   Quick Admin Terminal Launcher
=======================================
`);

const nodeVersion = process.versions.node;
const majorVersion = parseInt(nodeVersion.split('.')[0], 10);

if (majorVersion < 12) {
  console.error('ERROR: Node.js version 12 or higher required');
  console.log('Download from: https://nodejs.org');
  process.exit(1);
}

if (process.platform !== 'win32') {
  console.log('WARNING: This program is designed for Windows');
}

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage:
  admin-launch           - Start interactive menu
  admin-launch cmd       - Launch CMD as administrator
  admin-launch ps        - Launch PowerShell as administrator
  admin-launch powershell - Launch PowerShell as administrator
  
Arguments:
  --help, -h     - Show this help message
  --version, -v  - Show version
  cmd            - Launch CMD as administrator
  ps, powershell - Launch PowerShell as administrator
  `);
  process.exit(0);
}

if (args.includes('--version') || args.includes('-v')) {
  console.log('Admin Launcher v1.0.0');
  process.exit(0);
}

if (args.length > 0) {
  const { exec } = require('child_process');
  const command = args[0].toLowerCase();
  
  switch (command) {
    case 'cmd':
      console.log('Launching CMD as administrator...');
      exec('powershell -Command "Start-Process cmd -Verb RunAs"');
      process.exit(0);
      break;
      
    case 'ps':
    case 'powershell':
      console.log('Launching PowerShell as administrator...');
      exec('powershell -Command "Start-Process powershell -Verb RunAs"');
      process.exit(0);
      break;
      
    default:
      console.log(`ERROR: Unknown command: ${command}`);
      console.log('Use: cmd, ps, or powershell');
      process.exit(1);
  }
}

try {
  require('../src/index');
} catch (error) {
  console.error('Startup error:', error.message);
  console.log('\nTroubleshooting:');
  console.log('1. Ensure all files are in place');
  console.log('2. Try: npm install');
  console.log('3. Or run directly: node src/index.js');
  process.exit(1);
}

const { exec } = require('child_process');
const readline = require('readline');

const COLORS = {
  RESET: '\x1b[0m',
  GREEN: '\x1b[32m',
  BLUE: '\x1b[34m',
  RED: '\x1b[31m',
  CYAN: '\x1b[36m',
  YELLOW: '\x1b[33m',
  MAGENTA: '\x1b[35m'
};

function clearScreen() {
  console.clear();
}

function displayHeader() {
  console.log(`
${COLORS.CYAN}=======================================${COLORS.RESET}
${COLORS.CYAN}        ADMIN LAUNCHER ${COLORS.RESET}
${COLORS.CYAN}=======================================${COLORS.RESET}
  `);
}

function displayMenu() {
  console.log(`
${COLORS.GREEN}MAIN MENU:${COLORS.RESET}

${COLORS.GREEN}1. Launch CMD as admin${COLORS.RESET}
${COLORS.GREEN}2. Launch PowerShell as admin${COLORS.RESET}
${COLORS.BLUE}3. Help${COLORS.RESET}
${COLORS.MAGENTA}0. Exit${COLORS.RESET}

${COLORS.YELLOW}---------------------------------------${COLORS.RESET}
`);
}

function displayHelp() {
  console.log(`
${COLORS.CYAN}HELP AND INFORMATION:${COLORS.RESET}

Admin Launcher.
Utility for quick launch of terminals with admin rights.

${COLORS.CYAN}Quick commands from command line:${COLORS.RESET}
  admin-launch cmd - CMD as admin
  admin-launch ps - PowerShell as admin
  admin-launch powershell - PowerShell as admin

${COLORS.CYAN}Requirements:${COLORS.RESET}
  - Windows 7/8/10/11
  - Node.js 12.0 or higher
  - Admin rights confirmation via UAC

${COLORS.CYAN}How it works:${COLORS.RESET}
  1. Select option from menu
  2. Confirm UAC prompt (if enabled)
  3. Terminal launches with full admin privileges

${COLORS.CYAN}Note:${COLORS.RESET}
  This utility only requests elevation. Actual admin
  privileges depend on your user account and UAC settings.
`);
}

function launchShell(shellType) {
  let shellName = '';
  let command = '';
  
  switch (shellType) {
    case 'cmd':
      shellName = 'Command Prompt (CMD)';
      command = 'powershell -Command "Start-Process cmd -Verb RunAs"';
      break;
    case 'powershell':
      shellName = 'PowerShell';
      command = 'powershell -Command "Start-Process powershell -Verb RunAs"';
      break;
    default:
      console.log(`${COLORS.RED}ERROR: Unknown shell type${COLORS.RESET}`);
      return false;
  }
  
  console.log(`${COLORS.BLUE}Launching ${shellName} as admin...${COLORS.RESET}`);
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`${COLORS.RED}ERROR: ${error.message}${COLORS.RESET}`);
      console.log(`${COLORS.YELLOW}TIP: Try launching terminal manually as admin${COLORS.RESET}`);
      return false;
    }
    
    console.log(`${COLORS.GREEN}Request sent to Windows. Confirm UAC prompt.${COLORS.RESET}`);
    return true;
  });
  
  return true;
}

function waitForEnter(rl) {
  return new Promise((resolve) => {
    console.log(`\n${COLORS.YELLOW}[Press Enter to continue]${COLORS.RESET}`);
    rl.question('', resolve);
  });
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  let shouldExit = false;
  
  while (!shouldExit) {
    clearScreen();
    displayHeader();
    displayMenu();
    
    const choice = await new Promise((resolve) => {
      rl.question(`${COLORS.CYAN}Select option (0-3): ${COLORS.RESET}`, resolve);
    });
    
    switch (choice) {
      case '1':
        launchShell('cmd');
        await waitForEnter(rl);
        break;
        
      case '2':
        launchShell('powershell');
        await waitForEnter(rl);
        break;
        
      case '3':
        clearScreen();
        displayHeader();
        displayHelp();
        await waitForEnter(rl);
        break;
        
      case '0':
        console.log(`${COLORS.GREEN}Exiting...${COLORS.RESET}`);
        shouldExit = true;
        break;
        
      default:
        console.log(`${COLORS.RED}Invalid selection. Please try again.${COLORS.RESET}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  rl.close();
}

module.exports = {
  launchShell,
  displayHelp
};

if (require.main === module) {
  main().catch((error) => {
    console.error(`${COLORS.RED}FATAL ERROR: ${error.message}${COLORS.RESET}`);
    console.error(`${COLORS.RED}Stack trace: ${error.stack}${COLORS.RESET}`);
    process.exit(1);
  });
}

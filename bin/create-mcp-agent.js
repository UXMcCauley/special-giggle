#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const prompts = require('prompts');

const args = process.argv.slice(2);
const projectName = args.find(arg => !arg.startsWith('--')) || 'mcp-agent';
const isLocal = args.includes('--local');
const isServer = args.includes('--with-server');

const personalityArg = args.find(arg => arg.startsWith('--personality=')) || '';
const selectedPersonality = personalityArg.split('=')[1] || null;

const shouldPromptPersonality = args.includes('--choose-personality');

async function getMode() {
  if (isLocal || isServer) return isServer ? 'server' : 'local';
  const response = await prompts({
    type: 'select',
    name: 'mode',
    message: 'Select MCP agent type:',
    choices: [
      { title: 'Local (in-memory)', value: 'local' },
      { title: 'Server (DB-connected)', value: 'server' }
    ]
  });
  return response.mode;
}

async function getPersonality() {
  if (selectedPersonality) return selectedPersonality;
  if (!shouldPromptPersonality) return 'blank';
  const response = await prompts({
    type: 'select',
    name: 'personality',
    message: 'Choose a personality preset for your agent:',
    choices: [
      { title: '🧊 Blank (Concise, Pragmatic)', value: 'blank' },
      { title: '🍼 Innocent + Curious', value: 'innocent' },
      { title: '💅 Motivational + Sassy', value: 'sassy' }
    ]
  });
  return response.personality || 'blank';
}

async function getConnectionString() {
  const response = await prompts({
    type: 'text',
    name: 'connectionString',
    message: 'Enter your MongoDB connection string'
  });
  return response.connectionString;
}

function injectPersonality(templateDir, personality, targetDir) {
  const agentDir = path.join(templateDir, 'agent');
  const identityMap = {
    innocent: 'identity.innocent.ts',
    sassy: 'identity.sassy.ts',
    blank: 'identity.ts'
  };
  const ethicsMap = {
    innocent: 'ethics.innocent.ts',
    sassy: 'ethics.sassy.ts',
    blank: 'ethics.ts'
  };

  const idSrc = path.join(agentDir, identityMap[personality] || 'identity.ts');
  const ethSrc = path.join(agentDir, ethicsMap[personality] || 'ethics.ts');

  fs.copyFileSync(idSrc, path.join(targetDir, 'agent', 'identity.ts'));
  fs.copyFileSync(ethSrc, path.join(targetDir, 'agent', 'ethics.ts'));
}

(async () => {
  const mode = await getMode();
  const personality = await getPersonality() || 'blank';
  const targetDir = path.join(process.cwd(), projectName);
  const templateDir = path.join(__dirname, `../template-${mode}`);

  console.log(`🧠 Creating MCP agent in ${targetDir}`);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.cpSync(templateDir, targetDir, { recursive: true });

  if (!fs.existsSync(path.join(targetDir, 'agent'))) {
    fs.mkdirSync(path.join(targetDir, 'agent'));
  }

  injectPersonality(templateDir, personality, targetDir);

  if (mode === 'server') {
    const connectionString = await getConnectionString();
    fs.writeFileSync(path.join(targetDir, '.env'), `DATABASE_URL=${connectionString}\nGOOGLE_TOKEN=your-google-access-token-here\n`);
    console.log('🔐 .env file created with database connection string and Google token');
  }

  console.log('📦 Installing dependencies...');
  execSync('npm install', { cwd: targetDir, stdio: 'inherit' });

  console.log(`✅ Your MCP agent is ready!

cd ${projectName}
npm run dev`);
})();

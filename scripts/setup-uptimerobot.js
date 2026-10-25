#!/usr/bin/env node
/**
 * ==============================================================================
 * NETVISION — AUTOMATED UPTIMEROBOT MONITOR PROVISIONER
 * ==============================================================================
 * Usage:
 *   node scripts/setup-uptimerobot.js <UPTIMEROBOT_API_KEY>
 *   or:
 *   UPTIMEROBOT_API_KEY="u12345-xxx" node scripts/setup-uptimerobot.js
 *
 * Automatically provisions 3 monitors on UptimeRobot:
 * 1. Render Backend Liveness (keeps Render container from sleeping)
 * 2. Supabase DB Keep-Alive (queries courses endpoint to prevent 7-day auto-pause)
 * 3. Vercel Frontend Availability
 * ==============================================================================
 */

const https = require('https');
const querystring = require('querystring');

const apiKey = process.argv[2] || process.env.UPTIMEROBOT_API_KEY;

if (!apiKey) {
  console.log(`
========================================================================
🤖 NETVISION — UPTIMEROBOT AUTOMATED PROVISIONER
========================================================================
Error: UptimeRobot API Key missing!

Usage:
  node scripts/setup-uptimerobot.js <YOUR_UPTIMEROBOT_API_KEY>

How to get your API key:
1. Log in to https://uptimerobot.com/
2. Go to "My Settings" -> Scroll to "API Settings"
3. Click "Create Main API Key" (or "Monitor-specific API key")
4. Copy the key and run:
   node scripts/setup-uptimerobot.js <PASTE_API_KEY_HERE>
========================================================================
`);
  process.exit(1);
}

const MONITORS = [
  {
    friendly_name: 'NetVision Render Backend (Keep-Alive)',
    url: 'https://netvision-backend.onrender.com/api/v1/health',
    type: 1, // 1 = HTTP(s)
    interval: 300, // 5 minutes (prevents 15m idle sleep on Render)
  },
  {
    friendly_name: 'NetVision Supabase DB (Keep-Alive Query)',
    url: 'https://netvision-backend.onrender.com/api/v1/courses',
    type: 1, // 1 = HTTP(s)
    interval: 600, // 10 minutes (queries DB, prevents 7-day Supabase pause)
  },
  {
    friendly_name: 'NetVision Vercel Frontend',
    url: 'https://netvision-portfolio-b631.vercel.app',
    type: 1, // 1 = HTTP(s)
    interval: 300, // 5 minutes
  },
];

function createMonitor(monitor) {
  return new Promise((resolve, reject) => {
    const postData = querystring.stringify({
      api_key: apiKey,
      format: 'json',
      type: monitor.type,
      url: monitor.url,
      friendly_name: monitor.friendly_name,
      interval: monitor.interval,
    });

    const options = {
      hostname: 'api.uptimerobot.com',
      port: 443,
      path: '/v2/newMonitor',
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'cache-control': 'no-cache',
        'content-length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve(parsed);
        } catch (e) {
          resolve({ stat: 'fail', error: { message: body || 'Invalid JSON response' } });
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('========================================================================');
  console.log('🤖 NETVISION — PROVISIONING UPTIMEROBOT KEEP-ALIVE MONITORS');
  console.log('========================================================================\n');

  let successCount = 0;

  for (const monitor of MONITORS) {
    process.stdout.write(`Creating monitor: "${monitor.friendly_name}" (${monitor.interval / 60}m)... `);
    try {
      const result = await createMonitor(monitor);
      if (result.stat === 'ok') {
        console.log(`✅ SUCCESS (Monitor ID: ${result.monitor ? result.monitor.id : 'created'})`);
        successCount++;
      } else if (result.error && result.error.message && result.error.message.includes('already exists')) {
        console.log(`ℹ️  ALREADY EXISTS`);
        successCount++;
      } else {
        console.log(`⚠️  FAILED: ${result.error ? result.error.message : JSON.stringify(result)}`);
      }
    } catch (err) {
      console.log(`❌ ERROR: ${err.message}`);
    }
  }

  console.log('\n========================================================================');
  console.log(`Summary: ${successCount}/${MONITORS.length} monitors provisioned/active.`);
  console.log('========================================================================');
}

run();

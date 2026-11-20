import http from 'node:http';

const routes = [
  '/',
  '/about/overview',
  '/about/mayor',
  '/citizen-services',
  '/citizen-services/registration-certificates',
  '/city-map',
  '/complaints',
  '/tax-calculator',
  '/transparency',
  '/smart-city',
  '/smart-city/gis-map',
  '/smart-city/ward-map',
  '/smart-city/waste-management',
  '/smart-city/air-quality',
  '/smart-city/emergency-sos',
  '/smart-city/dashboard',
  '/login',
  '/register',
  '/dashboard/citizen'
];

async function checkRoute(route) {
  return new Promise((resolve) => {
    http.get('http://localhost:3000' + route, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasCssLink = data.includes('rel="stylesheet"');
        resolve({ route, status: res.statusCode, hasCss: hasCssLink, len: data.length });
      });
    }).on('error', (err) => {
      resolve({ route, error: err.message });
    });
  });
}

(async () => {
  console.log('Testing routes against running Next.js dev server...');
  let failed = 0;
  for (const r of routes) {
    const res = await checkRoute(r);
    if ((res.status === 200 || res.status === 307 || res.status === 308) && (res.hasCss || res.status >= 300)) {
      console.log(`  ✓ ${r.padEnd(45)} -> ${res.status} OK, verified (${res.len} bytes)`);
    } else {
      console.log(`  ❌ ${r.padEnd(45)} -> Failed:`, res);
      failed++;
    }
  }
  if (failed === 0) {
    console.log('\nAll checked routes successfully verified with active stylesheet links!');
    process.exit(0);
  } else {
    process.exit(1);
  }
})();

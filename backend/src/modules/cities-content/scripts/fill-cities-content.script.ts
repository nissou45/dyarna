import { logger } from '../../../utils/logger';
import { CITIES } from '../../../data/cities';
import { fillContentForCities } from '../content.service';

const REPORT_PATH = '../../../data/cities-content-report.json';

async function main() {
  const allIds = Object.keys(CITIES);
  logger.info({ total: allIds.length }, 'Phase 2: Filling all cities content');

  const startTime = Date.now();
  const report = await fillContentForCities(allIds);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  const reportData = {
    generatedAt: new Date().toISOString(),
    elapsedSeconds: Number(elapsed),
    total: report.total,
    success: report.success,
    partial: report.partial,
    failed: report.failed,
    results: report.results,
  };

  // Write JSON report
  const fs = await import('fs');
  const path = await import('path');
  const reportPath = path.resolve(__dirname, REPORT_PATH);
  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
  logger.info({ path: reportPath }, 'Report written');

  // Summary to console
  console.log('\n========================================');
  console.log('  PHASE 2 — COMPLETE REPORT');
  console.log('========================================\n');
  console.log(`  Total : ${report.total}`);
  console.log(`  ✅ Success : ${report.success}`);
  console.log(`  ⚠️  Partial : ${report.partial}`);
  console.log(`  ❌ Failed  : ${report.failed}`);
  console.log(`  ⏱  ${elapsed}s\n`);

  if (report.failed > 0) {
    console.log('--- FAILED ---');
    for (const r of report.results) {
      if (r.status === 'failed') {
        console.log(`  ❌ ${r.name} — ${r.detail}`);
      }
    }
    console.log('');
  }

  if (report.partial > 0) {
    console.log('--- PARTIAL ---');
    for (const r of report.results) {
      if (r.status === 'partial') {
        console.log(`  ⚠️  ${r.name} — ${r.detail}`);
      }
    }
    console.log('');
  }

  console.log('--- ALL RESULTS ---');
  for (const r of report.results) {
    const icon = r.status === 'success' ? '✅' : r.status === 'partial' ? '⚠️' : '❌';
    const desc = r.shortDescription ? r.shortDescription.substring(0, 80).replace(/\n/g, ' ') : '(none)';
    console.log(`  ${icon} ${r.name.padEnd(22)} ${r.status.padEnd(8)} ${desc}`);
  }

  console.log('\n========================================');
  console.log(`  Report: ${reportPath}`);
  console.log('========================================\n');
}

main().catch((err) => {
  logger.error({ err }, 'Phase 2 script failed');
  process.exit(1);
});

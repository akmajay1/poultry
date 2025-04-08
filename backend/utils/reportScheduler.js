const cron = require('node-cron');
const { generateDailyReport } = require('../controllers/fraudDetectionController');
const FraudDetection = require('../models/FraudDetection');

const initReportScheduler = () => {
  // Schedule daily report generation at 00:00
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('[Fraud Detection] Starting daily report generation...');
      
      const report = await generateDailyReport();
      
      // Store report in database
      const reportRecord = new FraudDetection({
        type: 'daily_report',
        reportDate: new Date(),
        totalCases: report.totalCases,
        caseDetails: report.cases,
        status: 'generated'
      });

      await reportRecord.save();
      console.log(`[Fraud Detection] Saved daily report with ${report.totalCases} cases`);

      // TODO: Add email notification integration
    } catch (error) {
      console.error('[Fraud Detection] Report generation error:', error);
    }
  });
};

module.exports = initReportScheduler;
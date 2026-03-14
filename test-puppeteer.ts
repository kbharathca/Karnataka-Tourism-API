import puppeteer from 'puppeteer';
(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  console.log('Browser launched successfully');
  await browser.close();
})();

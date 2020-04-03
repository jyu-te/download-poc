const puppeteer = require('puppeteer');
const downloadService = require('./download-service');



(async () => {

    const url = 'http://spec-domain1.org:31415/file-download.html';
    const selector = 'button[id=download]';
    const fileName = 'random';
    const maxWaitInMs = 3000;
    const downloadPath = '/Users/jyu/dev/download-poc/downloads';

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const downloadMeta = new DownloadMeta(url, selector, fileName, maxWaitInMs, downloadPath );
    await downloadService.waitForDownload(page, downloadMeta);

    await browser.close();
})();


class DownloadMeta {
    constructor(url, selector, fileName, maxWaitTimeInMs, downloadPath) {
        this.url = url;
        this.selector = selector;
        this.fileName = fileName;
        this.maxWaitTimeInMs = maxWaitTimeInMs;
        this.downloadPath = downloadPath;
        this.absFilePath = `${downloadPath}/${fileName}`;
    }
}
const chokidar = require('chokidar');
const sleep = require('util').promisify(setTimeout);

async function waitForDownload(page, downloadMeta) {
    console.log('Downloading file to:', downloadMeta.downloadPath);
    //console.log(downloadedSet);
    console.log('Go to page:', downloadMeta.url);

    // Browser page config - allow headless chrome to download file
    await page.goto(downloadMeta.url);
    await page._client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: downloadMeta.downloadPath
    });

    try {
        await waitForFileToDownload(page, downloadMeta);
    } catch (err) {
        console.log(err);
    }
}

async function waitForFileToDownload(page, downloadMeta) {
    // Watch the file before download
    const isDone = watchFile(downloadMeta);
    console.log(isDone);

    await page.click(downloadMeta.selector);

    //console.log('Waiting to download file: ' + downloadMeta.absFilePath);


    // console.log("sleeping for :" + downloadMeta.maxWaitTimeInMs);
    // //await sleep(downloadMeta.maxWaitTimeInMs);
    // console.log("woke up from sleep :" + downloadMeta.maxWaitTimeInMs);
    //, sleep(downloadMeta.maxWaitTimeInMs)
    let test = await Promise.all([isDone])
        .then(response => console.log(response))
        .catch(error => console.log(`Error in executing ${error}`));

    console.log("Testing: " + test);


}



module.exports = {
    waitForDownload
};

async function watchFile(downloadMeta) {

    console.log('watching this file to download:', downloadMeta.absFilePath);

    const watcher = chokidar.watch(downloadMeta.downloadPath, {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true
    });

    const log = console.log.bind(console);
    watcher
        .on('error', error => log(`Watcher error: ${error}`))
        .on('ready', () => log('Initial scan complete. Ready for changes'))
        .on('raw', (event, path, details) => log('Raw event info:', event, path, details))
        .on('add', path => {
            if (path.endsWith('.crdownload')) {
                console.log("Starting download: " + path);
            } else {
                console.log('downloaded: ', path);
                return true;
            }
        });
}

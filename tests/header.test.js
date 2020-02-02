const puppeteer = require('puppeteer');

let browser, page;

beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: false
    });
    page = await browser.newPage();
    await page.goto('localhost:3000');
    });

afterEach(async () => {
    // await browser.close();
});

test('We can launch a browser', async () => {
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);

    expect(text).toEqual('Blogster');
});

test('clicking login starts oauth flow', async () => {
    await page.click('.right a');

    const url = await page.url();

    expect(url).toMatch(/accounts\.google\.com/)
});

test.only('When signed in, shows logout button', async () => {
    // Take the session.sig id to generate a fake session
    const user_id = '5e33e21c4609525a1667f644';

    // create a fake session object
    const Buffer = require('safe-buffer').Buffer;
    const sessionObject = {
        passport: {
            user: user_id
        }
    };

    //turn it into a string
    const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString('base64');

    // generate the session.sig
    const Keygrip = require('keygrip');
    const keys = require('../config/keys');
    const keygrip = new Keygrip([keys.cookieKey]);
    const sig = keygrip.sign('session=' + sessionString);

    // set session cookie
    await page.setCookie({ name: 'session', value: sessionString });
    await page.setCookie({ name: 'session.sig', value: sig });
    await page.goto('localhost:3000');
    await page.waitFor('a[href="/auth/logout"]');

    //get href element
    const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

    expect(text).toEqual('Logout');
});
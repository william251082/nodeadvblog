const puppeteer = require('puppeteer');
const sessionFactory = require('./factories/sessionFactory');
const userFactory = require('./factories/userFactory');

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
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);

    // set session cookie
    await page.setCookie({ name: 'session', value: session });
    await page.setCookie({ name: 'session.sig', value: sig });
    await page.goto('localhost:3000');
    await page.waitFor('a[href="/auth/logout"]');

    //get href element
    const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

    expect(text).toEqual('Logout');
});

console.clear();

// from 3rd party library
class Greetings {
    english() { return 'Hello' }
    spanish() { return 'Ola' }
}

class MoreGreetings {
    german() { return 'Hallo' }
    french() { return 'Bonjour' }
}

const greetings = new Greetings();
const moreGreetings = new MoreGreetings();


// global function in ES2015
// arg1 --target - object that we want to manage/invoke access to
// arg2 --handler - object that contains set of functions that are executed any time we try to get access to target arg1
const allGreetings = new Proxy(moreGreetings, {
    get: function (target, property) {
        console.log('string representation of func name', property);
        return target[property] || greetings[property]
    }
});

// reference func name
allGreetings.french
allGreetings.ReferenceEvenPropertiesThatDontExist

console.log(allGreetings.german);
console.log(allGreetings.english());

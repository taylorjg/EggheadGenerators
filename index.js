'use strict';

const url = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
const fetch = require('node-fetch');
const co = require('co');

function* createQuoteFetcher() {
	const response = yield fetch(url);
	const quote = yield response.json();
	return `${quote.quoteText} -${quote.quoteAuthor}`;
}

const quoteFetcher1 = createQuoteFetcher();
quoteFetcher1.next().value
	.then(res => quoteFetcher1.next(res).value)
	.then(res => quoteFetcher1.next(res).value)
	.then(quote => console.log(quote))
	.catch(err => console.log(`ERROR: ${err}`));

const coroutine = genCreator => {
	const gen = genCreator();
	const handle = result => {
		console.log(`result.done: ${result.done}`);
		console.log(`result.value instanceof Promise: ${result.value instanceof Promise}`);
		const p = Promise.resolve(result.value);
		return (result.done) ? p : p.then(res => handle(gen.next(res)))
		// if (result.done) return Promise.resolve(result.value);
		// return Promise.resolve(result.value)
		// 	.then(res => handle(gen.next(res)));
	};
	return handle(gen.next());
};

const quoteFetcher2 = coroutine(createQuoteFetcher);
quoteFetcher2
	.then(quote => console.log(quote))
	.catch(err => console.log(`ERROR: ${err}`));

const quoteFetcher3 = co(createQuoteFetcher);
quoteFetcher3
	.then(quote => console.log(quote))
	.catch(err => console.log(`ERROR: ${err}`));

'use strict';

const url = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
const fetch = require('node-fetch');

function* createQuoteFetcher() {
  const response = yield fetch(url);
  const quote = yield response.json();
  return `${quote.quoteText} -${quote.quoteAuthor}`;
}

const coroutine = genCreator => {
  const gen = genCreator();
  const handle = result => {
    console.log(`result.done: ${result.done}`);
    console.log(`result.value instanceof Promise: ${result.value instanceof Promise}`);
    const p = Promise.resolve(result.value);
    return (result.done) ? p : p.then(res => handle(gen.next(res)))
  };
  return handle(gen.next());
};

const quoteFetcher = coroutine(createQuoteFetcher);
quoteFetcher
  .then(quote => console.log(quote))
  .catch(err => console.log(`ERROR: ${err}`));

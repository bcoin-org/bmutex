'use strict';

const assert = require('bsert');
const {Lock} = require('..');

describe('Lock', function() {
  it('should resolve queue in order', async () => {
    const genJob = (id) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(id);
        }, randomRange(10, 100));
      });
    };

    const locker = new Lock();
    const results = [];
    const promises = [];

    const runJob = async (id) => {
      const unlock = await locker.lock();

      try {
        results.push(await genJob(id));
      } finally {
        unlock();
      }
    };

    for (let i = 0; i < 10; i++)
      promises.push(runJob(i));

    await Promise.all(promises);

    assert.deepStrictEqual(results, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

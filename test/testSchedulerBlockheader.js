'use strict';
const logger = require('../src/logs')('testSchedulerBlockheader');

const blockHeaderTask = require('../src/scheduler/blockHeaderTask')();

describe('Swarm City scheduler', function() {
	it('should add & unroll blockHeaderTask task', function(done) {
		blockHeaderTask.addTask({
			name: 'print blockheader',
			func: (task) => {
				return new Promise((resolve, reject) => {
					logger.info('Hello', task.data);
					task.data = task.data + '+';
					resolve(task.data);
				});
			},
			responsehandler: (res, task) => {
				return new Promise((resolve, reject) => {
					logger.info('Hello Finished... RES=', res, 'task=', task);
					resolve();
					done();
				});
			},
			data: 'a',
		});
	});
});

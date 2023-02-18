// jest test
// create instance of Project class and run getProject method
// expect the result to be an object with info and pages properties

import { Project } from '../src/index';

const project = new Project('FZO1S28apPcyNDgeydqqFRkzmG03', 'jnLPCkEigI1TmNbRW4a0');

test('getProject', async () => {
  jest.setTimeout(10000);
  const result = await project.getProject();
  expect(result).toHaveProperty('info');
  expect(result).toHaveProperty('pages');
});

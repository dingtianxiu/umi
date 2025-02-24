import { join } from 'path';
import { getDepVersion } from './getDepVersion';

const root = join(__dirname, '../../../../../../');

test('absolute with invalid package.json', () => {
  expect(
    getDepVersion({
      dep: join(root, 'node_modules/@babel/runtime/helpers/esm/slicedToArray'),
      cwd: root,
    }),
  ).toMatch(/^7\./);
});

test('absolute', () => {
  expect(
    getDepVersion({
      dep: join(root, 'node_modules/lodash/fp/array'),
      cwd: root,
    }),
  ).toMatch(/^4\./);
});

test('absolute scope package', () => {
  expect(
    getDepVersion({
      dep: join(root, 'node_modules/@babel/core/src/transform-file-browser'),
      cwd: root,
    }),
  ).toMatch(/^7\./);
});

test('alias to absolute equal', () => {
  expect(
    getDepVersion({
      dep: 'foo',
      cwd: root,
      webpackAlias: {
        foo: join(root, 'node_modules/@babel/core/src/transform-file-browser'),
      },
    }),
  ).toMatch(/^7\./);
});

test('alias to absolute deep deps', () => {
  expect(
    getDepVersion({
      dep: 'foo/bar',
      cwd: root,
      webpackAlias: {
        foo: join(root, 'node_modules/@babel/core/src/transform-file-browser'),
      },
    }),
  ).toMatch(/^7\./);
});

test('alias to absolute js file', () => {
  expect(
    getDepVersion({
      dep: 'foo.js',
      cwd: root,
      webpackAlias: {
        'foo.js': join(
          root,
          'node_modules/@babel/core/src/transform-file-browser',
        ),
      },
    }),
  ).toMatch(/^7\./);
  expect(
    getDepVersion({
      dep: 'foo/bar.js',
      cwd: root,
      webpackAlias: {
        'foo/bar.js': join(
          root,
          'node_modules/@babel/core/src/transform-file-browser',
        ),
      },
    }),
  ).toMatch(/^7\./);
});

test('alias to dep', () => {
  expect(
    getDepVersion({
      dep: 'foo',
      cwd: root,
      webpackAlias: {
        foo: '@babel/core',
      },
    }),
  ).toMatch(/^7\./);
  expect(
    getDepVersion({
      dep: 'foo/bar',
      cwd: root,
      webpackAlias: {
        foo: '@babel/core',
      },
    }),
  ).toMatch(/^7\./);
  expect(
    getDepVersion({
      dep: 'foo/bar.js',
      cwd: root,
      webpackAlias: {
        foo: '@babel/core',
      },
    }),
  ).toMatch(/^7\./);
});

test('normal deep dep', () => {
  expect(
    getDepVersion({
      dep: '@babel/core/src/transform-file-browser',
      cwd: root,
    }),
  ).toMatch(/^7\./);
});

test('normal', () => {
  expect(
    getDepVersion({
      dep: '@babel/core',
      cwd: root,
    }),
  ).toMatch(/^7\./);
});

test('support parent node_modules', () => {
  expect(
    getDepVersion({
      dep: '@babel/core',
      cwd: __dirname,
    }),
  ).toMatch(/^7\./);
});

test('support parent node_modules with deep import', () => {
  expect(
    getDepVersion({
      dep: '@babel/core/src/xxx.js',
      cwd: __dirname,
    }),
  ).toMatch(/^7\./);
});

test('no package found with alias', () => {
  expect(() => {
    getDepVersion({
      dep: 'foo',
      cwd: root,
      webpackAlias: {
        foo: '/bar',
      },
    });
  }).toThrow(/^\[MFSU]/);
});

test('no package found', () => {
  expect(() => {
    getDepVersion({
      dep: 'foooooooo',
      cwd: root,
    });
  }).toThrow(/^\[MFSU]/);
});

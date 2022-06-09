const {
  writeFragment,
  writeFragmentData,
  readFragment,
  readFragmentData,
} = require('../../src/model/data/memory/index');

describe('Memory Tests', () => {
  describe('writeFragment', () => {
    test('writeFragment passed', async () => {
      const fragment = {
        ownerId: '1111',
        id: 'ID',
        created: new Date(),
      };

      await writeFragment(fragment);

      const data = await readFragment(fragment.id, fragment.ownerId);

      expect(data.created).toEqual(fragment.created);
    });
  });

  describe('writeFragment', () => {
    test('readFragment passed', async () => {
      const fragment = {
        ownerId: '2222',
        id: 'ID',
        created: new Date(),
      };
      await writeFragment(fragment);

      const data = await readFragment(fragment.ownerId, fragment.id);

      expect(data.created).toEqual(fragment.created);
    });
  });

  describe('writeFragmentData', () => {
    test('writeFragmentData passed', async () => {
      const fragment = {
        ownerId: '3333',
        id: 'ID',
        created: new Date(),
      };

      const value = 'writing is being tested';

      await writeFragmentData(fragment.ownerId, fragment.id, value);

      const data = await readFragmentData(fragment.ownerId, fragment.id);

      expect(data).toEqual(value);
    });
  });

  describe('readFragmentData', () => {
    test('readFragmentData passed', async () => {
      const fragment = {
        ownerId: '4444',
        id: 'ID',
        created: new Date(),
      };

      const value = 'reading is being tested';

      await writeFragmentData(fragment.ownerId, fragment.id, value);

      const data = await readFragmentData(fragment.ownerId, fragment.id);

      expect(data).toEqual(value);
    });
  });
});

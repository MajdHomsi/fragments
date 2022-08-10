// Use https://www.npmjs.com/package/nanoid to create unique IDs
const { nanoid } = require('nanoid');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

const validTypes = {
  txt: 'text/plain',
  txtCharset: 'text/plain; charset=utf-8',
  md: 'text/markdown',
  html: 'text/html',
  json: 'application/json',
  png: 'image/png',
  jpg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
};

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (ownerId && type) {
      if (Fragment.isSupportedType(type)) {
        this.type = type;
      } else throw Error('Unsupported type');

      if (size) {
        if (Number.isInteger(size) && (Math.sign(size) === 0 || Math.sign(size) === 1)) {
          this.size = size;
        } else throw Error('Invalid size');
      } else this.size = 0;
      this.id = id ? id : nanoid();
      this.ownerId = ownerId;
      this.created = created ? new Date(created).toISOString() : new Date().toISOString();
      this.updated = updated ? new Date(updated).toISOString() : new Date().toISOString();
    } else throw Error('Missing ownerId and or type');
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    return listFragments(ownerId, expand);
  }
  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    try {
      const data = await readFragment(ownerId, id);
      if (data === undefined) {
        throw new Error('Fragment not found');
      }
      return data;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise
   */
  static delete(ownerId, id) {
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
  save() {
    this.updated = new Date().toISOString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  async getData() {
    const data = await readFragmentData(this.ownerId, this.id);
    return data;
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise
   */
  async setData(data) {
    if (!data) {
      throw new Error('No data provided');
    } else {
      this.updated = new Date().toISOString();
      this.size = Buffer.byteLength(data);
      await writeFragment(this);
      return await writeFragmentData(this.ownerId, this.id, data);
    }
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    const result = this.mimeType;
    return result.includes('text/');
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    let array = [];
    if (
      this.type.includes('image/png') ||
      this.type.includes('image/jpeg') ||
      this.type.includes('image/gif') ||
      this.type.includes('image/webp')
    ) {
      array = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
    } else if (this.type.includes('text/plain')) {
      array = ['text/plain'];
    } else if (this.type.includes('text/markdown')) {
      array = ['text/plain', 'text/html', 'text/markdown'];
    } else if (this.type.includes('text/html')) {
      array = ['text/plain', 'text/html'];
    } else if (this.type.includes('application/json')) {
      array = ['application/json', 'text/plain'];
    }
    return array;
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    return Object.values(validTypes).includes(value);
  }
}
module.exports.Fragment = Fragment;

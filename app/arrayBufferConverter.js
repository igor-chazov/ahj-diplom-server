module.exports = class ArrayBufferConverter {
  load(buffer) {
    this.buffer = new TextEncoder('utf-8').encode(buffer);
  }

  toString() {
    return new TextDecoder().decode(this.buffer);
  }
};

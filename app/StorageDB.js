/* eslint-disable no-console */
const fs = require('fs');
const ArrayBufferConverter = require('./arrayBufferConverter');

const arrBufConvert = new ArrayBufferConverter();

module.exports = class StorageDB {
  constructor() {
    this.dB = null;
    this.category = null;
    this.favourites = new Set();
  }

  readDB() {
    fs.readFile('./public/dB.json', (err, readData) => {
      if (err) {
        console.error(err);
        return;
      }

      arrBufConvert.load(readData);
      const parseDb = JSON.parse(arrBufConvert.toString());
      this.dB = parseDb;
    });

    fs.readFile('./public/category.json', (err, readData) => {
      if (err) {
        console.error(err);
        return;
      }

      arrBufConvert.load(readData);
      const parseCategory = JSON.parse(arrBufConvert.toString());
      this.category = parseCategory;
    });

    fs.readFile('./public/favourites.json', (err, readData) => {
      if (err) {
        console.error(err);
        return;
      }

      arrBufConvert.load(readData);
      const favouritesDB = JSON.parse(arrBufConvert.toString());

      for (const favoriteDB of favouritesDB) {
        this.favourites.add(favoriteDB);
      }
    });
  }

  static writeDB(dB, category, favourites) {
    fs.writeFile('./public/db.json', JSON.stringify(dB), (err) => {
      if (err) throw new Error(err);
    });

    fs.writeFile('./public/category.json', JSON.stringify(category), (err) => {
      if (err) throw new Error(err);
    });

    const data = [];

    for (const favorite of favourites) {
      data.push(favorite);
    }

    fs.writeFile('./public/favourites.json', JSON.stringify(data), (err) => {
      if (err) throw new Error(err);
    });
  }
};

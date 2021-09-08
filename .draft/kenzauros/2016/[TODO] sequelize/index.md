---
title: "[TODO] sequelize"
date: 2016-07-26
author: kenzauros
tags: [その他]
---

'use strict'

const config = require('../config');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, config.db.options);

const Point = sequelize.define('Point', {
  point_id: Sequelize.INTEGER,
  latitude: Sequelize.FLOAT,
  longitude: Sequelize.FLOAT,
  name: Sequelize.STRING,
  instrument_model: Sequelize.STRING,
  instrument_id: Sequelize.STRING,
  comment: Sequelize.STRING,
}, {
  timestamps: false,
});

const Record = sequelize.define('Record', {
  record_id: Sequelize.INTEGER,
  time: Sequelize.DATE,
  point_id: Sequelize.INTEGER,
  temperature: Sequelize.FLOAT,
  humidity: Sequelize.FLOAT,
  comment: Sequelize.STRING,
  oxygen: Sequelize.FLOAT,
}, {
  timestamps: true,
  createdAt: 'time',
  updatedAt: false,
});

module.exports = {
  Sequelize: Sequelize,
  sequelize: sequelize,
  Point: Point,
  Record: Record,
};

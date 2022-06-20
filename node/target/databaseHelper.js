"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomBoolean = exports.getRandomSalary = exports.getDateToday = exports.getRandomDate = void 0;
function getRandomDate() {
    const start = new Date(2008, 0, 1);
    const end = new Date(2021, 11, 31);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split("T")[0];
}
exports.getRandomDate = getRandomDate;
function getDateToday() {
    return new Date().toISOString().split("T")[0];
}
exports.getDateToday = getDateToday;
function getRandomSalary() {
    return Math.random() * 100000;
}
exports.getRandomSalary = getRandomSalary;
function getRandomBoolean() {
    return Math.random() < 0.5;
}
exports.getRandomBoolean = getRandomBoolean;

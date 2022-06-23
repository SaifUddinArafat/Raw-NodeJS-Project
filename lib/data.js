/*
# Title:Data Collection
# Description:All the data related Task
# Author: Saif Uddin
# Date:6-18-2022
*/

// dependencies
const fs = require('fs');
const path = require('path');

const lib = {};
// base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data');

// write data to file
lib.create = (dir, file, data, callback) => {
    // open file for writting
    fs.open(`${`${lib.baseDir}/${dir}`}/${file}.json`, 'wx', (err, fileDescriptors) => {
        if (!err && fileDescriptors) {
            // convert data to string
            const stringData = JSON.stringify(data);

            // write data to file and then close it
            fs.writeFile(fileDescriptors, stringData, (error) => {
                if (!error) {
                    fs.close(fileDescriptors, (error2) => {
                        if (!error2) {
                            callback(false);
                        } else {
                            callback('Error Closing the new files');
                        }
                    });
                } else {
                    callback('Error Writing to new file');
                }
            });
        } else {
            callback('Could no create new file, it may aready exists');
        }
    });
};

// read data from file
lib.read = (dir, file, callback) => {
    fs.readFile(`${`${lib.baseDir}/${dir}`}/${file}.json`, 'utf-8', (err, data) => {
        callback(err, data);
    });
};

// update existing file
lib.update = (dir, file, data, callback) => {
    // open file for writting
    fs.open(`${`${lib.baseDir}/${dir}`}/${file}.json`, 'r+', (err, fileDescriptors) => {
        if (!err && fileDescriptors) {
            // convert data to string
            const stringData = JSON.stringify(data);

            // truncate the file truncate = removig everyting from file
            fs.ftruncate(fileDescriptors, (err2) => {
                if (!err2) {
                    // write to the file and close it
                    fs.writeFile(fileDescriptors, stringData, (err3) => {
                        if (!err3) {
                            fs.close(fileDescriptors, (err4) => {
                                if (!err4) {
                                    callback(false);
                                } else {
                                    callback('error Closing File');
                                }
                            });
                        } else {
                            callback('error Writting Data');
                        }
                    });
                } else {
                    callback('Error Truncationg File');
                }
            });
        } else {
            console.log('error updating.File may not exist');
        }
    });
};

// delet existing file
lib.delete = (dir, file, callback) => {
    // unlink file
    fs.unlink(`${`${lib.baseDir}/${dir}`}/${file}.json`, (err) => {
        if (!err) {
            callback(false);
        } else {
            callback('Error Deleting File');
        }
    });
};

// exporting
module.exports = lib;

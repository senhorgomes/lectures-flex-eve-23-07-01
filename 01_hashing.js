const bcrypt = require('bcrypt');
const saltRounds = 10;

const someRandomPassword = "qwerty";

const hashedPassword = bcrypt.hashSync(someRandomPassword,10);
console.log(bcrypt.hashSync(someRandomPassword,10));
// First run the hashSync, has their password, and save the hashed password in the database

// Login?
// Compare sync comapres the unhashed password with the saved hashed version of it
console.log(bcrypt.compareSync("qwerty", hashedPassword));
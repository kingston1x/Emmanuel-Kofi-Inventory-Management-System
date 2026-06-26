const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.inventory-managementclu.a1j969t.mongodb.net",
  (err, records) => {
    console.log("Error:", err);
    console.log("Records:", records);
  }
);
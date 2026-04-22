const domain = "http://192.168.0.100:2146"; 
const payload = { locationId: "main_office", secret: "door_777" };

const base64 = Buffer.from(JSON.stringify(payload)).toString('base64');
const finalUrl = `${domain}/api/checkin/qr?data=${encodeURIComponent(base64)}`;

console.log(finalUrl);

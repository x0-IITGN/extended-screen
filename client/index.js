console.log("htakjnf");
const devicesDiv = document.getElementById("devices");
const serverUrl = "ws://localhost:8080/ws"; // Update this with your server URL
const socket = new WebSocket(serverUrl);

// Handle incoming messages from server (optional)
socket.onmessage = function (event) {
  const message = event.data;
  console.log("Received from server:", message);
};

document.getElementById("scanButton").addEventListener("click", async () => {
  devicesDiv.innerHTML = ""; // Clear previous results

  try {
    const options = { acceptAllDevices: true };
    // const device = await navigator.bluetooth.requestDevice(options);
    const req = await navigator.bluetooth.requestDevice(options);
    const device = await navigator.bluetooth.getAvailability();
    if (device) {
      devicesDiv.innerHTML += `<div>device ${device.name || "Unknown"}</div>`;
      console.log("This device supports Bluetooth!");
    } else {
      devicesDiv.innerHTML += `<div>doh! device ${device}</div>`;
      console.log("Doh! Bluetooth is not supported");
    }
    // devicesDiv.innerHTML += `<div>device ${device}</div>`;
    // console.log(device);

    const deviceInfo = {
      name: device.name || "Unknown",
      id: device.id,
    };

    navigator.bluetooth.getAvailability().then((available) => {
      if (available) {
        console.log("This device supports Bluetooth!");
        devicesDiv.innerHTML += `<div>e halo</div>`;
      } else {
        console.log("Doh! Bluetooth is not supported");
        devicesDiv.innerHTML += `<div>nai halo</div>`;
      }
    });

    // Display the found device
    devicesDiv.innerHTML += `<div><strong>${deviceInfo.name}</strong> (ID: ${deviceInfo.id})</div>`;

    // Send device information to server
    socket.send(JSON.stringify(deviceInfo));
  } catch (error) {
    console.error("Bluetooth scanning failed:", error);
  }
});

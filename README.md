# redis-iot
Redis client implementation with pipelining and pubsub on embedded ESP (arduino like) device

The devices send the sensor values as fast as possible to a Redis database in a list, with the MacAddress as the key and send a message on the refreshvalues channel
The NodeJS app subscribed to the channel, receive the notification, get the value and the user name related to the device MacAddress and sends this to the UI
in a web socket
The web UI displays the username and the last value in real time. It was supposed to keep the last 100 values and plot a chart, but I had to disable the
Google Chart drawing because each device sends value update at 1500 values/sec, I expect between 15 and 80 devices in the workshops. And the chart is already
unable to refresh with only one device.

## Usage

Note, before starting app, a redis server should be started:

```
apt install redis # for Debian, adapt for other OS
npm install
npm start
www-browser http://localhost:3000
```

## Notes

Visualization UI on the client side made by David. Big Thank you
https://github.com/nosqlgeek/iot-redis-viz

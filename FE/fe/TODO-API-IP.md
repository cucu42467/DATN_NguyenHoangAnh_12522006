# API IP Configuration

**Current status:** Defaults updated to machine IP 192.168.1.8:5001/5002.

**To make dynamic:**
1. Add .env.local in FE/fe:
```
NEXT_PUBLIC_API_ND_BASE_URL=https://192.168.1.8:5001
NEXT_PUBLIC_API_QT_BASE_URL=https://192.168.1.8:5002
```
2. `npm run dev` to reload.

**Dynamic IP detection (future):**
Implement WebRTC in co_so_api.ts:

```ts
async function getLocalIp(): Promise<string> {
  return new Promise((resolve) => {
    const rtc = new RTCPeerConnection({ iceServers: [] });
    rtc.createDataChannel('');
    rtc.onicecandidate = (evt) => {
      if (evt.candidate) {
        const ip = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(evt.candidate.candidate)?.[1];
        if (ip) resolve(ip);
      } else resolve('localhost');
      rtc.close();
    };
    rtc.createOffer().then(rtc.setLocalDescription.bind(rtc));
  });
}
```

Use in layCoSoApi(): `https://${await getLocalIp()}:5001`

Tested for local network access.

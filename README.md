# HD Website

**Requirements**
- `node`
    - `pm2`
- `nginx`
- `postgresql`

1. Build admin web

```
  cd admin
  npm install
  npm run build
```

1. VPS(Public IP) -(web(3000) - NextJS, admin - ReactJS (3001) , [server(8084) (app), db (5432)] ) -> docker

nginx ->
1.1.1.2 IP
request -> 1.1.1.2-H api.abc.com
SSL
HTTPS
key <-[Hacker]-> browser TSL

PORT 80 - HTTP
PORT 443 - HTTPS
user -> abc.com (<=> IP) 1.1.1.2:443

1.1.1.2 == abc.com
MX record - mail server
A record - IP
NS record - DNS

browser -> vitinh.com -> DNS server -> 1.1.1.2:80 -> ngnix -> 443 (host web 3k)

nextjs <-> node server

-> product/1 (get data -> show) - csr
-> product/1 - server nextjs query api -> generate(html, css, js) -> return browser => ssr

TODO: csr - ssr

A - Website vitinh.com - nextjs
B - admin website
C - server nodejs

1. dockerize server (C)
2. cd web ->dockerize web Nextjs
3. cd admin Reactjs -> yarn build => get path folder
4. run docker-compose

- Docker compose:
  - Map DB postpgesQL -> server can query in DB === Volume DB
  -

Nginx config:

- reject max file upload

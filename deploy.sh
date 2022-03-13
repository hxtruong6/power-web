#!/usr/bin/env bash

pm2 delete all
# print command in shell script and wait for confirmation before executing it
trap 'read -p "run: $BASH_COMMAND"' DEBUG

echo "Build and deploy webiste 💩"

echo "--- DATABASE ---"
# pwd
# psql -U postgres -h 127.0.0.1 -d hd-01 -f -a db/1_setup.sql
# \q exit
# \l list table
# \c connection info
#DROP DATABASE [IF EXISTS] database_name;

# psql -U postgres
    # run this in psql bash
# SELECT 'CREATE DATABASE hd01' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'hd01')\gexec

# pg_dump -U postgres -f 2_data.sql hd01  # backup data
# restore data
#  psql -U postgres -f 2_data.sql hd01

# Peer error 
# local   all postgres  md5
# The command locate pg_hba.conf should help;
#  here's some examples: /etc/postgresql/*/main/pg_hba.conf 
# and /var/lib/pgsql/data/pg_hba.conf.

#   sudo systemctl start postgresql-13
#   systemctl status postgresql-13
#   sudo systemctl enable postgresql-13



# pm2 startup systemd



echo "--- BUILD ---"

export NODE_ENV=production

echo "Current path: "
pwd

echo ">> Build admin website"
cd admin
pwd
pnpm install && pnpm run build
cd ..

echo ">> Build server"
cd server
pwd
ls
cat package.json
yarn install && yarn run build
cp .env ./build/.env
echo ">> Make sure have public folder + data!"
# ls build/public/images
cd build && pm2 start server.js
cd ../..
pm2 status 
# unzip filename.zip -d /path/to/directory

echo ">> Build main website"
cd web
pwd
pnpm install && pnpm run build
pm2 start "pnpm start"
cd ..
echo "-> Finished!"
pm2 status 


echo "--- NGINX ---"

echo ">> Set up nginx"
# sudo su -
# sudo mkdir --parent /var/log/hd-website
# sudo touch /var/log/hd-website/access.log
# sudo touch /var/log/hd-website/error.log
# echo "Finished!"

echo "Copy nginx.conf files"
# ------ Way 1
# # 1. config file for example.com
# sudo nano /etc/nginx/sites-available/example.com.conf


# # 2. enable config file
# sudo ln -s /etc/nginx/sites-available/example.com.conf /etc/nginx/sites-enabled/example.com.conf




# NOTE: Must be include nginx/sites-enbale/* in folder /etc/nginx/nginx.conf in the end of html block
# 1. ==> sudo cp ./nginx.conf /etc/nginx/sites-available/hdcomputer.com.vn.conf
# 2. ==> sudo ln -s /etc/nginx/sites-available/hdcomputer.com.vn.conf /etc/nginx/sites-enabled/hdcomputer.com.vn.conf


# ---------- Way 2
# # NGĨNX  folder for config
# /etc/nginx/conf.d/hdcomputer.com.vn.conf
echo ">> pwd: " && pwd
cp -rf nginx/. /etc/nginx/conf.d/

la /etc/nginx/conf.d/

echo "Check nginx file"
sudo nginx -t && sudo systemctl reload nginx

# systemctl stop nginx.service &&  systemctl enable nginx.service &&  systemctl start nginx.service &&  systemctl status nginx.service
# 3. restart
sudo systemctl restart nginx
service nginx status

echo ">> Hope this will be work!!! 💩"

# docker-compose down --volumes  # prevent not init data 
# docker-compose up --build

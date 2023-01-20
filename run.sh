pm2 kill
git pull
npm install
npm run build
pm2 start npm --name "mice" -- start

pm2 kill
git reset --hard
git pull
npm install
npm run build
pm2 start npm --name "mice" -- start

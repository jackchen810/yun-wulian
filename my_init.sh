#start server ln 
#sudo ln -s ../../yun-wulian-vue/dist/ public

rm -rf ./public/index.html
rm -rf ./public/static
cp -rf ../yun-wulian-vue/dist/* public/
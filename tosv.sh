cd www
cp -r . ~/Dropbox/code/rails/rails_api/public
tar -zcvf www.tar.gz .
# zip -r www.zip .
# scp -r . gsp@162.243.143.15:/home/gsp/wd/rails-do/public
scp www.tar.gz gsp@162.243.143.15:/home/gsp/wd/rails-do/public
rm www.tar.gz
# ssh gsp@162.243.143.15 &&
# cd /home/gsp/wd/rails-do/public
# tar -zxvf www.tar.gz
# unzip www.zip
# ./uc.sh restart
# sudo service nginx restart





# scp -r gsp@162.243.143.15:/home/gsp/beta/do .
# zip -r archive_name.zip folder_to_compress
# unzip archive_name.zip

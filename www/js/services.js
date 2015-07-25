angular.module('starter.services', ['ngResource'])

.factory('User', function($resource, $rootScope) {
  return $resource($rootScope.baseUrl + '/api/users/:id');
})

.factory('Follow', function($resource, $rootScope) {
  return $resource($rootScope.baseUrl + '/api/follow/:id');
})

.factory('Post', function($resource, $rootScope) {
  return $resource($rootScope.baseUrl + '/api/posts/:id');
})

.factory('Comment', function($resource, $rootScope) {
  return $resource($rootScope.baseUrl + '/api/comments/:id');
})

.factory('Session', function($resource, $rootScope) {
  return $resource($rootScope.baseUrl + '/api/session/:id');
})
// .factory("Items", function($firebaseArray) {
//   var itemsRef = new Firebase("https://gongsongpingionic.firebaseio.com/items");
//   return $firebaseArray(itemsRef);
// })

.factory('Qiniu', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    },
    qiniu: function() {
        var uploader = Qiniu.uploader({
            runtimes: 'html5,flash,html4',
            browse_button: 'pickfiles',
            container: 'container',
            drop_element: 'container',
            max_file_size: '100mb',
            flash_swf_url: 'js/plupload/Moxie.swf',
            dragdrop: true,
            chunk_size: '4mb',
            uptoken_url: 'http://localhost:3000/api/uptoken',
            domain: 'http://7xj5ck.com1.z0.glb.clouddn.com/',
            // downtoken_url: '/downtoken',
            unique_names: true,
            // save_key: true,
            // x_vars: {
            //     'id': '1234',
            //     'time': function(up, file) {
            //         var time = (new Date()).getTime();
            //         // do something with 'time'
            //         return time;
            //     },
            // },
            auto_start: true,
            init: {
                'FilesAdded': function(up, files) {
                    $('table').show();
                    $('#success').hide();
                    plupload.each(files, function(file) {
                        var progress = new FileProgress(file, 'fsUploadProgress');
                        progress.setStatus("等待...");
                    });
                },
                'BeforeUpload': function(up, file) {
                    var progress = new FileProgress(file, 'fsUploadProgress');
                    var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                    if (up.runtime === 'html5' && chunk_size) {
                        progress.setChunkProgess(chunk_size);
                    }
                },
                'UploadProgress': function(up, file) {
                    var progress = new FileProgress(file, 'fsUploadProgress');
                    var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                    progress.setProgress(file.percent + "%", up.total.bytesPerSec, chunk_size);

                },
                'UploadComplete': function() {
                    $('#success').show();
                },
                'FileUploaded': function(up, file, info) {
                    var progress = new FileProgress(file, 'fsUploadProgress');
                    progress.setComplete(up, info);
                    console.log(file);
                    console.log(JSON.parse(info));
                    // $('#pic_url').val(info.key)
                    // $('#pic_url').val(JSON.parse(info).key);
                    $('#pic_url').val('http://7xj5ck.com1.z0.glb.clouddn.com/' + JSON.parse(info).key);
                    console.log($('#pic_url').val());
                },
                'Error': function(up, err, errTip) {
                    $('table').show();
                    var progress = new FileProgress(err.file, 'fsUploadProgress');
                    progress.setError();
                    progress.setStatus(errTip);
                }
                // ,
                // 'Key': function(up, file) {
                //     var key = "";
                //     // do something with key
                //     return key
                // }
            }
        });

        uploader.bind('FileUploaded', function() {
            console.log('hello man,a file is uploaded');
        });
        $('#container').on(
            'dragenter',
            function(e) {
                e.preventDefault();
                $('#container').addClass('draging');
                e.stopPropagation();
            }
        ).on('drop', function(e) {
            e.preventDefault();
            $('#container').removeClass('draging');
            e.stopPropagation();
        }).on('dragleave', function(e) {
            e.preventDefault();
            $('#container').removeClass('draging');
            e.stopPropagation();
        }).on('dragover', function(e) {
            e.preventDefault();
            $('#container').addClass('draging');
            e.stopPropagation();
        });



        $('#show_code').on('click', function() {
            $('#myModal-code').modal();
            $('pre code').each(function(i, e) {
                hljs.highlightBlock(e);
            });
        });


        $('body').on('click', 'table button.btn', function() {
            $(this).parents('tr').next().toggle();
        });


        var getRotate = function(url) {
            if (!url) {
                return 0;
            }
            var arr = url.split('/');
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i] === 'rotate') {
                    return parseInt(arr[i + 1], 10);
                }
            }
            return 0;
        };

        $('#myModal-img .modal-body-footer').find('a').on('click', function() {
            var img = $('#myModal-img').find('.modal-body img');
            var key = img.data('key');
            var oldUrl = img.attr('src');
            var originHeight = parseInt(img.data('h'), 10);
            var fopArr = [];
            var rotate = getRotate(oldUrl);
            if (!$(this).hasClass('no-disable-click')) {
                $(this).addClass('disabled').siblings().removeClass('disabled');
                if ($(this).data('imagemogr') !== 'no-rotate') {
                    fopArr.push({
                        'fop': 'imageMogr2',
                        'auto-orient': true,
                        'strip': true,
                        'rotate': rotate,
                        'format': 'png'
                    });
                }
            } else {
                $(this).siblings().removeClass('disabled');
                var imageMogr = $(this).data('imagemogr');
                if (imageMogr === 'left') {
                    rotate = rotate - 90 < 0 ? rotate + 270 : rotate - 90;
                } else if (imageMogr === 'right') {
                    rotate = rotate + 90 > 360 ? rotate - 270 : rotate + 90;
                }
                fopArr.push({
                    'fop': 'imageMogr2',
                    'auto-orient': true,
                    'strip': true,
                    'rotate': rotate,
                    'format': 'png'
                });
            }

            $('#myModal-img .modal-body-footer').find('a.disabled').each(function() {

                var watermark = $(this).data('watermark');
                var imageView = $(this).data('imageview');
                var imageMogr = $(this).data('imagemogr');

                if (watermark) {
                    fopArr.push({
                        fop: 'watermark',
                        mode: 1,
                        image: 'http://www.b1.qiniudn.com/images/logo-2.png',
                        dissolve: 100,
                        gravity: watermark,
                        dx: 100,
                        dy: 100
                    });
                }

                if (imageView) {
                    var height;
                    switch (imageView) {
                        case 'large':
                            height = originHeight;
                            break;
                        case 'middle':
                            height = originHeight * 0.5;
                            break;
                        case 'small':
                            height = originHeight * 0.1;
                            break;
                        default:
                            height = originHeight;
                            break;
                    }
                    fopArr.push({
                        fop: 'imageView2',
                        mode: 3,
                        h: parseInt(height, 10),
                        q: 100,
                        format: 'png'
                    });
                }

                if (imageMogr === 'no-rotate') {
                    fopArr.push({
                        'fop': 'imageMogr2',
                        'auto-orient': true,
                        'strip': true,
                        'rotate': 0,
                        'format': 'png'
                    });
                }
            });

            var newUrl = Qiniu.pipeline(fopArr, key);

            var newImg = new Image();
            img.attr('src', 'loading.gif');
            newImg.onload = function() {
                img.attr('src', newUrl);
                img.parent('a').attr('href', newUrl);
            };
            newImg.src = newUrl;
            return false;
        });

    }


  };
});

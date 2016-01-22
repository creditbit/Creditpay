'use strict';

angular.module('copayApp.controllers').controller('joinController',
  function($scope, $rootScope, $timeout, go, isMobile, notification, profileService, isCordova, $modal, gettext) {

    var self = this;

    //TODO : make one function - this was copied from topbar.js
    var cordovaOpenScanner = function() {
      window.ignoreMobilePause = true;
      window.plugins.spinnerDialog.show(null, 'Preparing camera...', true);
      $timeout(function() {
        cordova.plugins.barcodeScanner.scan(
          function onSuccess(result) {
            $timeout(function() {
              window.plugins.spinnerDialog.hide();
              window.ignoreMobilePause = false;
            }, 100);
            if (result.cancelled) return;

            $timeout(function() {
              var data = result.text;
              $scope.secret = data;
              $scope.joinForm.secret.$setViewValue(data);
              $scope.joinForm.secret.$render();
            }, 1000);
          },
          function onError(error) {
            $timeout(function() {
              window.ignoreMobilePause = false;
              window.plugins.spinnerDialog.hide();
            }, 100);
            alert('Scanning error');
          }
        );
      }, 100);
    };

  var modalOpenScanner = function() {
    var _scope = $scope;
    var ModalInstanceCtrl = function($scope, $rootScope, $modalInstance) {
      // QR code Scanner
    // Detect mobile devices
    var isMobile = {
      Android: function() {
          return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function() {
          return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function() {
          return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function() {
          return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function() {
          return navigator.userAgent.match(/IEMobile/i);
      },
      any: function() {
          return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
      }
    };

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

    $scope.isMobile = isMobile.any();
    $scope.scannerLoading = false;

    var cameraInput,
        video,
        canvas,
        $video,
        context,
        localMediaStream;

    var _scan = function(evt) {
      if ($scope.isMobile) {
        $scope.scannerLoading = true;
        var files = evt.target.files;

        if (files.length === 1 && files[0].type.indexOf('image/') === 0) {
          var file = files[0];

          var reader = new FileReader();
          reader.onload = (function(theFile) {
            return function(e) {
              var mpImg = new MegaPixImage(file);
              mpImg.render(canvas, { maxWidth: 200, maxHeight: 200, orientation: 6 });

              setTimeout(function() {
                qrcode.width = canvas.width;
                qrcode.height = canvas.height;
                qrcode.imagedata = context.getImageData(0, 0, qrcode.width, qrcode.height);

                try {
                  //alert(JSON.stringify(qrcode.process(context)));
                  qrcode.decode();
                } catch (e) {
                  alert(e);
                }
              }, 1500);
            };
          })(file);

          // Read  in the file as a data URL
          reader.readAsDataURL(file);
        }
      } else {
        if (localMediaStream) {
          context.drawImage(video, 0, 0, 300, 225);

          try {
            qrcode.decode();
          } catch(e) {
            //qrcodeError(e);
          }
        }

        setTimeout(_scan, 500);
      }
    };

          var _scanStop = function() {
      $scope.scannerLoading = false;
      if (!$scope.isMobile) {
        if (localMediaStream.stop) localMediaStream.stop();
        localMediaStream = null;
        video.src = '';
      }
    };

      qrcode.callback = function(data) {
        _scanStop();
        $modalInstance.close(data);
      };

      var _successCallback = function(stream) {
        video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
        localMediaStream = stream;
        video.play();
        $timeout(_scan, 1000);
      };

      var _videoError = function(err) {
        $scope.cancel();
      };

      var setScanner = function() {
        navigator.getUserMedia = navigator.getUserMedia ||
          navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
          navigator.msGetUserMedia;
        window.URL = window.URL || window.webkitURL ||
        window.mozURL || window.msURL;
      };

      $scope.init = function() {
        setScanner();
        $timeout(function() {
        canvas = document.getElementById('qr-canvas');
        context = canvas.getContext('2d');

        if ($scope.isMobile) {
          cameraInput = document.getElementById('qrcode-camera');
          cameraInput.addEventListener('change', _scan, false);
        } else {
          video = document.getElementById('qrcode-scanner-video');
          $video = angular.element(video);
          canvas.width = 300;
          canvas.height = 225;
          context.clearRect(0, 0, 300, 225);

          navigator.getUserMedia({video: true}, _successCallback, _videoError);
        }
        }, 500);
      };

      $scope.cancel = function() {
        _scanStop();
        $modalInstance.dismiss('cancel');
      };
    };

    var modalInstance = $modal.open({
      templateUrl: 'views/modals/scanner.html',
      windowClass: 'full',
      controller: ModalInstanceCtrl,
      backdrop : 'static',
      keyboard: false
    });
      modalInstance.result.then(function(data) {
        $scope.secret = data;
        $scope.joinForm.secret.$setViewValue(data);
        $scope.joinForm.secret.$render();
      });

    };

    this.openScanner = function() {
      if (isCordova) {
        cordovaOpenScanner();
      } else {
        modalOpenScanner();
      }
    };


    this.join = function(form) {
      if (form && form.$invalid) {
        self.error = gettext('Please enter the required fields');
        return;
      }
      self.loading = true;

      $timeout(function() {
        profileService.joinWallet({
          secret: form.secret.$modelValue,
          extendedPrivateKey: form.privateKey.$modelValue,
          myName: form.myName.$modelValue
        }, function(err) {
          if (err) {
            self.loading = false;
            self.error = gettext('Could not join wallet: ') +  (err.message ? err.message : err);
            $rootScope.$apply();
            return
          }
          $timeout(function() {
            go.walletHome();
          }, 2000);
        });
      }, 100);
    }
  });

import eventBus from "./eventBus";
import $ from 'jquery'

var sdk = AgoraRTC;

/*
 * Agora视频插件(非插件版本)
 * 作者：郭明
 * 日期：2017年4月11日
 */
var videoMgr = (function () {

    /*****视频模块私有变量*******/
    var client = null;

    //本地流
    var localStream;

    //流列表
    var StreamList = {};

    //已经初始化
    var initialized = false;


    //视频分辨率
    var resolution = "480p";

    //帧率
    var maxFrameRate = 30;

    var maxBitRate=1000;

    //sdk回调事件类型
    var EventType = {
        "streamAdded": "stream-added",
        "streamRemoved": "stream-removed",
        "peerMuteVideo": "peer-mute-video",
        "peerMuteAudio": "peer-mute-audio",
    };

    //出错重试
    var TryAgain = true;

    var listeners = [];

    /**************************/

    function videoMgr(loginInfo) {
        //登录信息
        this.loginInfo = loginInfo;

        //当前成员（UI需要使用）
        this.Users = [];
    }

    //支持的事件类型
    videoMgr.prototype.EventType = EventType;

    //初始化
    videoMgr.prototype.Init = function (config, successCallback, failCallBack) {

        if (!config.MediaChannelKey)
            console.error("Init videoMgr miss Param MediaChannelKey")

        if (!config.RecordingKey)
            console.error("Init videoMgr miss Param RecordingKey")

        if (!config.Audio)
            console.error("Init videoMgr miss Param Audio")


        if (!config.Video)
            console.error("Init videoMgr miss Param Video")

        if (!config.Screen)
            console.error("Init videoMgr miss Param Screen")


        if (!config.AppID)
            console.error("Init videoMgr miss Param AppID")

        if (!config.ChannelID)
            console.error("Init videoMgr miss Param ChannelID")
            
        if (!config.Model)
          {
              config.Model='communication';//live-broadcasting
              console.error("Init videoMgr miss Param communication")
          }
    

        var self = this;

        self.config = config;

        if (!initialized) {
    
            //通信模式
            if (config.Model == 'live-broadcasting') {
               
                client = AgoraRTC.createLiveClient();
            }
            //直播模式
            else if(config.Model=='communication')
            {
                client = AgoraRTC.createRtcClient()
            }

            //通知应用程序远程语音/视频流已添加。
            client.on('stream-added', function (evt) {

                var stream = evt.stream;
                console.log("New stream added: " + stream.getId());
                console.log("Timestamp: " + Date.now());
                console.log("Subscribe ", stream);
                client.subscribe(stream, function (err) {
                    console.log("Subscribe stream failed", err);
                });
            });

            client.on("stream-removed", function (evt) {
       
                var stream = evt.stream;
                console.log("Stream removed: " + evt.stream.getId());
                console.log("Timestamp: " + Date.now());
                console.log(evt);
            });

            //通知应用程序远端用户已离开房间 (例如对方用户调用了 client.leave())，可以停止播放
            client.on('peer-leave', function (evt) {

             
                console.log("Peer has left: " + evt.uid);
                console.log("Timestamp: " + Date.now());
                console.log(evt);

                //删除用户
                removeUser.call(self, evt.uid);

            });

            //通知应用程序已订阅远程语音/视频流，可以开始播放远端视频。
            client.on('stream-subscribed', function (evt) {

              
                var stream = evt.stream;
                var uid = stream.getId();
                console.log("stream-subscribed",evt);
                console.log("Got stream-subscribed event");
                console.log("Timestamp: " + Date.now());
                console.log("Subscribe remote stream successfully: " + uid);

                //添加用户
                addUser.call(self, uid, stream)
            });

            //通知应用程序远端用户已选择不发送或者重新发送视频流。
            client.on("peer-mute-video", function (event) {
                var message = event.msg;

                setUserVideo.call(self, message.uid, message.muted);

                if (message.muted) {
                    console.log("remote user " + message.uid + " muted video");
                }
                else {
                    console.log("remote user " + message.uid + " unmuted video");
                }
            });

            //通知应用程序远端用户已选择不发送或重新发送语音流。
            client.on("peer-mute-audio", function (event) {
                var message = event.msg;

                setUserAudio.call(self, message.uid, message.muted);

                if (message.muted) {
                    console.log("remote user " + message.uid + " muted audio");
                } else {
                    console.log("remote user " + message.uid + " unmuted audio");
                }
            });

            client.on("error", function (event) {

                ExceptionHandler.call(self, event, function () { });

            });

            console.log("client.init("+self.config.MediaChannelKey+")")

            //初始化客户端（插件版本调用并非如此）
            client.init(self.config.MediaChannelKey, function (obj) {

                console.log("AgoraRTC client initialized");
                initialized = true;

                if (successCallback)
                    successCallback(true);

            }, function (error) {

                ExceptionHandler.call(self, error);

                if (failCallBack) {
                    failCallBack(error);
                }


                console.log(error);
            });
        }
        else {
            if (successCallback)
                successCallback(true);
        }
    }

    //加入房间
    videoMgr.prototype.enterRoom = function (roomid) {

        var self = this;

        //没有初始化后则延迟进入,初始化需要等到IM组件初始化后
        if (!initialized) {

            setTimeout(function () { self.enterRoom(roomid) }, 500);
            return;
        }

        try {
            if (roomid + "" != "") {
                self.roomId = roomid;

                //用户编号
                var uid = self.loginInfo.identifier;

                console.log("client.join("+self.config.MediaChannelKey+", "+roomid+", "+uid+")")

                //加入房间(注意插件版本调用规则并非如此)
                client.join(roomid, uid, function (streamID) {
                    
                    console.log("User " + uid + " join channel "+roomid+" successfully");
                    console.log("Timestamp: " + Date.now());
                    console.log("streamID: " +streamID);

                    //如果本地视频流已经存在则停止发布并关闭
                    if (localStream) {
                        // local stream exist already
                        client.unpublish(localStream, function (err) {
                            console.error("Unpublish failed with error: ", err);
                        });
                        localStream.close();
                    }
          
                    //重新建立视频流
                    localStream = AgoraRTC.createStream({
                        streamID: uid,
                        audio: self.config.Audio,
                        video: self.config.Video,
                        screen: false,//移动不能使用屏幕共享会导致初始化失败
                        local: true
                    });

                    //设置视频的配置
                    //localStream.setVideoProfile(self.generateVideoProfile(resolution, maxFrameRate));
                    localStream.setVideoResolution(resolution);
                    localStream.setVideoFrameRate([maxFrameRate, maxFrameRate]);
                    localStream.setVideoBitRate([30, maxBitRate]);

                    //初始化视频流
                    localStream.init(function () {
                        console.log("Get UserMedia successfully");
                        console.log(localStream);

                        client.publish(localStream, function(err) {
                            console.log("Timestamp: " + Date.now());
                            console.log("Publish local stream error: " + err);
                        });

                        addUser.call(self, uid, localStream);

                        client.on('stream-published');

                    }, function (err) {
                        console.error("Local stream init failed.", err);
                        console.error("Please check camera or audio devices on your computer, then try again.");
                    });

                }, function (e) {

                    console.error(e);
                });

                if (client.startRecording)
                    client.startRecording(self.config.RecordingKey, function (data) {

                        console.log("start recording successfully.");
                    }, function (err) {

                        console.error("failed to start recording", err);

                    });
            }
        }
        catch (e) {

            console.error(e);

            ExceptionHandler.call(self, e);
        }
    }

    //退出
    videoMgr.prototype.Quit = function () {
        var self = this;

        self.config.Video = false;
        self.config.Audio = false;
        self.config.Screen = false;
        //清空用户
        self.Users = [];

        try {

            if (client && client.signalOpen && client.signal) {
                //如果本地视频流已经存在则停止发布并关闭
                if (localStream) {
                    // local stream exist already
                    client.unpublish(localStream, function (err) {
                        console.log("Unpublish failed with error: ", err);
                    });
                    localStream.close();
                }

                for (var uid in StreamList) {
                    StreamList[uid].stream.stop();
                }


                client.leave(function () {
                    console.log("client leaves channel")
                }, function (err) {
                    console.log("client leave failed", err);
                });



                //清空视频流
                StreamList = {};

            }

        }
        catch (e) {
            console.error(e);
        }



    }

    //显示用户视频（供UI调用）
    videoMgr.prototype.displayVideo = function () {
        //显示视频信号
        for (var i = 0; i < this.Users.length; i++) {
            if (this.Users[i].dwUserId) {
                requestVideo("video-user-" + this.Users[i].dwUserId, this.Users[i].dwUserId);
            }
        }
    }

    //获取所有设备
    videoMgr.prototype.getDevices = function (callback) {
        var self = this;

        if (client && client.signalOpen && client.signal) {
            client.getDevices(function (devices) {
                if (callback)
                    callback(devices);

            });
        }
        else {
            setTimeout(function () { self.getDevices(callback) }, 500);
        }
    }

    //选择设备
    videoMgr.prototype.selectDevice = function (device) {
        client.selectDevice(device);
    }

    //生成视频配置
    videoMgr.prototype.generateVideoProfile = function (resolution, frameRate) {
        var result = "480P_2";
        switch (resolution) {
            case '120p':
                result = "120P";
                break;
            case '240p':
                result = "240P";
                break;
            case '360p':
                result = "360P";
                break;
            case '480p':
                if (frameRate === "15") {
                    result = "480P";
                } else {
                    result = "480P_2";
                }
                break;
            case '720p':
                if (frameRate === "15") {
                    result = "720P";
                } else {
                    result = "720P_2";
                }
                break;
            case '1080p':
                if (frameRate === "15") {
                    result = "1080P";
                } else {
                    result = "1080P_2";
                }
                break;
            default:
                // 480p, 30
                // Do nothing
                break;
        }

        return result;
    }

    videoMgr.prototype.resolution = resolution;

    videoMgr.prototype.getResolutionArray = function (reso) {
        switch (reso) {
            case "120p":
                return [160, 120];
            case "240p":
                return [320, 240];
            case "360p":
                return [640, 360];
            case "480p":
                return [640, 480];
            case "720p":
                return [1280, 720];
            case "1080p":
                return [1920, 1080];
            default:
                return [1280, 720];
        }
    };

    //开启屏幕共享
    videoMgr.prototype.startScreenSharing = function (startCallback) {
        var self = this;

        //允许屏幕共享且，客户端存在
        if (client && self.Screen) {
            client.startScreenSharing("", function () {

                if (startCallback)
                    startCallback();
            });
        }
    }

    //停止屏幕共享
    videoMgr.prototype.stopScreenSharing = function (stopCallback) {
        var self = this;

        //允许屏幕共享且，客户端存在
        if (client && self.Screen) {
            client.stopScreenSharing(function () {

                if (stopCallback)
                    stopCallback();

            });

        }
    }





    //添加到远程视频流列表
    function addUser(uid, stream) {

        var self = this;
        var userExistsFlag = false;
        if (stream) {
            //检查是否有重复的用户存在，避免重复添加
            for (var i = 0; i < self.Users.length; i++) {

                //如果用户已经存在则返回
                if (self.Users[i].userId == uid) {
                    userExistsFlag = true;
                    break;
                }
            }


            //用户不存在才添加
            if (!userExistsFlag) {

                self.Users.push({
                    userId: uid,
                    dwUserId: uid,
                    camera: 1,//视频状态
                    holdmic: 1,//音频状态
                    recording: 1,//录音状态
                    deviceType: 0//设备类型
                });
            }

            StreamList[uid] = {
                id: uid,
                stream: stream,
                videoEnabled: true,
                audioEnabled: true
            };


            eventBus.dispatch(EventType.streamAdded, { uid: uid })
        }
    }

    //删除用户
    function removeUser(uid) {
        var self = this;

        for (var i = 0; i < self.Users.length; i++) {
            if (self.Users[i].userId == uid) {
                var uid = self.Users[i].uid;

                //删除视频
                StreamList[uid] = null

                delete StreamList[uid];

                //移除用户
                self.Users.removeByIndex(i);

                eventBus.dispatch(EventType.streamRemoved, { uid: uid })



            }
        }


    }

    //设置用户语音状态
    function setUserAudio(uid, muted) {
        var self = this;

        for (var i = 0; i < self.Users.length; i++) {
            if (self.Users[i].userId == uid) {
                self.Users[i].audio = muted ? 1 : 0;


                eventBus.dispatch(EventType.peerMuteAudio, { uid: muted });
            }
        }
    }

    //设置用户视频状态
    function setUserVideo(uid, muted) {
        var self = this;

        for (var i = 0; i < self.Users.length; i++) {
            if (self.Users[i].userId == uid) {
                self.Users[i].video = muted ? 1 : 0;

                eventBus.dispatch(EventType.peerMuteVideo, { uid: muted });

            }
        }
    }

    function ExceptionHandler(err, callback) {
        var self = this;

        eventBus.dispatch("room-video-error", err);

        if (err) {
            switch (err.reason) {
                /*
                 * 表明无法连接到 AgoraWebAgent。可能的原因有：
                    无可用网络。由于采用了安全的 websocket 本地连接，
                    连接 AgoraWebAgent 需要 DNS 服务，当 DNS 服务不可用时连不上 AgoraWebAgent。
                    未启动 AgoraWebAgent。
                    未安装 AgoraWebAgent。
                    使用了代理，导致无法连接 AgoraWebAgent
                 */
                case 'CLOSE_BEFORE_OPEN':
                    {
                        NotInstallPlugin(self)
                        break;
                    }
                /* 可能的原因是 1.6 版的 JS 与之前版本的AgoraWebAgent 不兼容，需根据回调里返回的 URL 升级AgoraWebAgen*/
                case "INCOMPATIBLE_WEBAGENT":
                    {
                        console.log("web agent version does not match");
                        NotInstallPlugin(self);
                        break;
                    }
                //客户端代理被关闭
                case "LOST_CONNECTION_TO_AGENT":
                    {
                        NotInstallPlugin(self);
                        break;
                    }
                default:
                    {
                        console.error(err)

                    }
            }
        }

    }

    function getInstallUrl() {
        if (navigator.appVersion.indexOf("Mac") != -1) {
            return sdk.macAgentInstallUrl;
        }

        return sdk.winAgentInstallUrl;
    }

    function getInstallGuideUrl() {
        var userLang = navigator.language || navigator.userLanguage;
        if (userLang.indexOf("zh") != -1) {
            return sdk.cnAgentInstallGuideUrl;
        }
        return sdk.enAgentInstallGuideUrl;
    }

    function NotInstallPlugin(self) {

        //var message = 'To use voice/video functions, you need to run Agora Media Agent first.<ul><li> If you do not have it installed, please visit url <a style="font-weight:bold;" href="' + err.agentInstallUrl + '">AgoraWebAgent</a> to install it. Please refer to the <a style="font-weight:bold;" href="' + err.agentInstallGuideUrl + '">installation guide</a> if you encounter any questions.</li><li>If you have installed it, please double click the icon to run this app.</li><li>If it has been running, please check if the internet connection is working or not.</li></ul>'
        var message = '使用语音/视频功能，您需要运行视频插件.<ul><li>如果您没有安装，请<a target=_blank style="font-weight:bold;" href="' + getInstallUrl() + '">安装</a> 它。</li><li>如果您遇到任何问题，请参阅<a  target=_blank style="font-weight:bold;" href="' + getInstallGuideUrl() + '">安装指南</a>。</li><li>如果您已经安装了它，请双击该图标来运行这个应用程序。如果它一直在运行，请检查网络连接是否正常。</li></ul>'

        var dialog = layer.confirm(message, {
            title: "您需要运行视频插件",
            btn: ['不再提醒', '重试'] //按钮

        }, function () {
            layer.close(dialog)

            TryAgain = false;

        }, function () {

            if (TryAgain) {

                setTimeout(function () {

                    initialized = false;


                    //重新初始化SDK
                    self.Init(self.config, function () {

                        //重新进入房间
                        self.enterRoom(self.config.ChannelID)

                    });

                }, 1000);
            }
        });
    }



    /*
      * 显示视频信号
      * params:
      * viewDiv -dom元素id
      * memberId -成员编号，如果是本人为空
    */
    function requestVideo(viewDiv, dwUserId) {

        try
        {
         
            console.log("requestVideo(dwUserId:" + dwUserId + ",viewDiv:" + viewDiv + ")");

            if ($("#" + viewDiv).length <= 0) {
                console.warn("#" + viewDiv + " not exists");
                setTimeout(function () {requestVideo(viewDiv, dwUserId)}, 50);
                return;
            }
            else
            {

                $("#" + viewDiv).empty();
                
                var stream = StreamList[dwUserId].stream;

                stream.play(viewDiv, function (err) {
                        layer.msg(err.error);
                });
            }
        }
        catch (e) {
            console.error(e)
        }
    }

    return videoMgr;

})();




export default videoMgr

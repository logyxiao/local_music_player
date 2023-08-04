
(function (factory) {

    /*
     * 添加UMD支持
     */

    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        window.Vudio = factory();
    }

})(function () {

    'use strict';

    // 默认参数
    var __default_option = {
        effect: 'waveform',
        accuracy: 128,
        width: 256,
        height: 100,
        waveform: {
            maxHeight: 80,
            minHeight: 1,
            spacing: 1,
            color: '#f00',
            shadowBlur: 0,
            shadowColor: '#f00',
            fadeSide: true,
            horizontalAlign: 'center',
            verticalAlign: 'middle',
            prettify: true
        },
        circlewave: {
            maxHeight: 20,
            minHeight: -5,
            spacing: 1,
            color: '#fcc',
            shadowBlur: 2,
            shadowColor: '#caa',
            fadeSide: true,
            prettify: false,
            particle: true,
            maxParticle: 100,
            circleRadius: 128,
            showProgress: true,
        },
        circlebar: {
            maxHeight: 50,
            minHeight: 1,
            spacing: 1,
            color: '#fb6d6b',
            shadowBlur: 2,
            shadowColor: '#caa',
            fadeSide: true,
            prettify: false,
            particle: true,
            maxParticle: 100,
            circleRadius: 128,
            showProgress: true,
        },
        lighting: {
            maxHeight: 160,
            lineWidth: 2,
            color: '#f00',
            shadowBlur: 1,
            shadowColor: '#c20',
            fadeSide: true,
            prettify: true,
            horizontalAlign: 'center',
            verticalAlign: 'middle'
        }
    }

    /**
     * 构造函数
     * @param {object} audioSource HTMLAudioSource/MediaStream
     * @param {object} canvasElement HTMLCanvasElement
     * @param {object} option 可选配置参数
     */
    function Vudio(audioSource, canvasElement, option) {

        if (['[object HTMLAudioSource]', '[object HTMLAudioElement]', '[object MediaStream]'].indexOf(Object.prototype.toString.call(audioSource)) === -1) {
            throw new TypeError('Invaild Audio Source');
        }

        if (Object.prototype.toString.call(canvasElement) !== '[object HTMLCanvasElement]') {
            throw new TypeError('Invaild Canvas Element');
        }

        this.audioSrc = audioSource;
        this.canvasEle = canvasElement;
        this.option = __mergeOption(__default_option, option);
        this.meta = {};

        this.stat = 0;
        this.freqByteData = null;
        this.particles = [];
        this.coverImg = new Image();

        this.__init();

    }

    // private functions
    function __mergeOption() {

        var __result = {}

        Array.prototype.forEach.call(arguments, function (argument) {

            var __prop;
            var __value;

            for (__prop in argument) {
                if (Object.prototype.hasOwnProperty.call(argument, __prop)) {
                    if (Object.prototype.toString.call(argument[__prop]) === '[object Object]') {
                        __result[__prop] = __mergeOption(__result[__prop], argument[__prop]);
                    } else {
                        __result[__prop] = argument[__prop];
                    }
                }
            }

        });

        return __result;

    }

    Vudio.prototype = {

        __init: function () {

            var audioContext = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext),
                source = Object.prototype.toString.call(this.audioSrc) !== '[object MediaStream]' ? audioContext.createMediaElementSource(this.audioSrc) : audioContext.createMediaStreamSource(this.audioSrc),
                dpr = window.devicePixelRatio || 1;

            this.analyser = audioContext.createAnalyser();
            this.meta.spr = audioContext.sampleRate;

            source.connect(this.analyser);
            this.analyser.fftSize = this.option.accuracy * 2;
            console.log(this.option.effect)
            this.analyser.connect(audioContext.destination);


            this.freqByteData = new Uint8Array(this.analyser.frequencyBinCount);
            this.analyser.getByteFrequencyData(this.freqByteData);

            this.context2d = this.canvasEle.getContext('2d');
            this.width = this.option.width;
            this.height = this.option.height;

            // ready for HD screen
            this.context2d.canvas.width = this.width * dpr;
            this.context2d.canvas.height = this.height * dpr;
            this.context2d.scale(dpr, dpr);
            this.context2d.globalCompositeOperation = 'lighter';


            // prepare for coverImage
            this.coverImg.src = this.option.circlewave.coverImg || '';

            // listen click on vudioEle
            this.canvasEle.addEventListener('click', (function () {
                if (this.stat === 0) {
                    this.audioSrc.play();
                    this.dance();
                }
                else {
                    this.pause();
                    this.audioSrc.pause();
                }
            }).bind(this)
            );

        },

        __recreateAnalyzer() {
            var audioContext = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext),
                source = Object.prototype.toString.call(this.audioSrc) !== '[object MediaStream]' ?
                    audioContext.createMediaElementSource(this.audioSrc) : audioContext.createMediaStreamSource(this.audioSrc);

            this.analyser = audioContext.createAnalyser();
            this.meta.spr = audioContext.sampleRate;

            source.connect(this.analyser);
            this.analyser.fftSize = this.option.accuracy * 2;
            this.analyser.connect(audioContext.destination);
        },


        __rebuildData: function (freqByteData, horizontalAlign) {

            var __freqByteData;

            if (horizontalAlign === 'center') {
                __freqByteData = [].concat(
                    Array.from(freqByteData).reverse().splice(this.option.accuracy / 2, this.option.accuracy / 2),
                    Array.from(freqByteData).splice(0, this.option.accuracy / 2)
                );
            } else if (horizontalAlign === 'left') {
                __freqByteData = freqByteData;
            } else if (horizontalAlign === 'right') {
                __freqByteData = Array.from(freqByteData).reverse();
            } else {
                __freqByteData = [].concat(
                    Array.from(freqByteData).reverse().splice(this.option.accuracy / 2, this.option.accuracy / 2),
                    Array.from(freqByteData).splice(0, this.option.accuracy / 2)
                );
            }

            return __freqByteData;

        },

        readAudioSrc: function (fileEle, vudio, label) {
            if (fileEle.files.length === 0) {
                label.innerText = 'Drop Audio file here to play'
                return;
            }
            var file = fileEle.files[0];
            var fr = new FileReader();
            if (file.type.indexOf('audio') !== 0) return;
            label.innerText = file.name;
            fr.onload = function (evt) {
                vudio.audioSrc.src = evt.target.result;
                vudio.audioSrc.play();
                vudio.dance();
            }
            fr.readAsDataURL(file);
        },

        __animate: function () {

            if (this.stat === 1) {
                this.analyser.getByteFrequencyData(this.freqByteData);
                (typeof this.__effects()[this.option.effect] === 'function') && this.__effects()[this.option.effect](this.freqByteData);
                requestAnimationFrame(this.__animate.bind(this));
            }

        },

        __testFrame: function () {
            this.analyser.getByteFrequencyData(this.freqByteData);
            (typeof this.__effects()[this.option.effect] === 'function') && this.__effects()[this.option.effect](this.freqByteData);
        },

        // effect functions
        __effects: function () {

            var __that = this;

            return {

                lighting: function (freqByteData) {

                    var __lightingOption = __that.option.lighting;
                    var __freqByteData = __that.__rebuildData(freqByteData, __lightingOption.horizontalAlign);
                    var __maxHeight = __lightingOption.maxHeight;
                    var __prettify = __lightingOption.prettify;
                    var __color = __lightingOption.color;
                    var __isStart = true, __fadeSide = true, __x, __y, __linearGradient;


                    if (__lightingOption.horizontalAlign !== 'center') {
                        __fadeSide = false;
                    }

                    // 清除画布
                    __that.context2d.clearRect(0, 0, __that.width, __that.height);

                    // draw lighting
                    __that.context2d.lineWidth = __lightingOption.lineWidth;
                    __that.context2d.strokeStyle = 'rgba(200, 200, 200, .2)';
                    __that.context2d.fillStyle = 'rgba(200, 200, 200, .2)';
                    __that.context2d.globalAlpha = .8;
                    __that.context2d.beginPath();

                    if (__color instanceof Array) {

                        __linearGradient = __that.context2d.createLinearGradient(
                            0,
                            __that.height / 2,
                            __that.width,
                            __that.height / 2
                        );

                        __color.forEach(function (color, index) {
                            var __pos, effectiveColor;
                            if (color instanceof Array) {
                                effectiveColor = color[1];
                            } else {
                                effectiveColor = color;
                            }
                            __pos = index / __color.length;
                            __linearGradient.addColorStop(__pos, effectiveColor);
                        });

                        __that.context2d.fillStyle = __linearGradient;
                        __that.context2d.strokeStyle = __linearGradient;

                    } else {
                        __that.context2d.fillStyle = __color;
                        __that.context2d.strokeStyle = __color;
                    }

                    __freqByteData.forEach(function (value, index) {

                        if (__prettify) {
                            // 美化线条应该小于尾部的maxHeight。
                            if (index < __that.option.accuracy / 2) {
                                __maxHeight = (1 - (__that.option.accuracy / 2 - 1 - index) / (__that.option.accuracy / 2)) * __lightingOption.maxHeight;
                            } else {
                                __maxHeight = (1 - (index - __that.option.accuracy / 2) / (__that.option.accuracy / 2)) * __lightingOption.maxHeight;
                            }
                        } else {
                            __maxHeight = __lightingOption.maxHeight;
                        }

                        __x = __that.width / __that.option.accuracy * index;
                        var __tmpY = value / 256 * __maxHeight;

                        if (__lightingOption.verticalAlign === 'middle') {
                            __y = (__that.height - __tmpY) / 2;
                        } else if (__lightingOption.verticalAlign === 'bottom') {
                            __y = __that.height - __tmpY;
                        } else if (__lightingOption.verticalAlign === 'top') {
                            __y = __tmpY;
                        } else {
                            __y = (__that.height - __tmpY) / 2;
                        }

                        if (__isStart) {
                            __that.context2d.moveTo(__x, __y);
                            __isStart = false;
                        } else {
                            __that.context2d.lineTo(__x, __y);
                        }

                    });
                    __that.context2d.stroke();
                    __that.context2d.globalAlpha = .6;
                    __that.context2d.fill();
                },

                circlewave: function (freqByteData) {
                    var __circlewaveOption = __that.option.circlewave;
                    var __fadeSide = __circlewaveOption.fadeSide;
                    var __prettify = __circlewaveOption.prettify;
                    var __freqByteData = __that.__rebuildData(freqByteData, __circlewaveOption.horizontalAlign);
                    var __angle = Math.PI * 2 / __freqByteData.length;
                    var __maxHeight, __width, __height, __left, __top, __color, __linearGradient, __pos;
                    var circleRadius = __circlewaveOption.circleRadius;
                    var __particle = __circlewaveOption.particle;
                    var __maxParticle = __circlewaveOption.maxParticle;
                    var __showProgress = __circlewaveOption.showProgress;
                    var __progress = __that.audioSrc.currentTime / __that.audioSrc.duration;
                    var __isStart = true;
                    __color = __circlewaveOption.color;

                    if (__circlewaveOption.horizontalAlign !== 'center') {
                        __fadeSide = false;
                        __prettify = false;
                    }

                    // 清除画布
                    __that.context2d.clearRect(0, 0, __that.width, __that.height);
                    __that.context2d.save();
                    __that.context2d.lineWidth = 4;
                    __that.context2d.fillStyle = 'rgba(200, 200, 200, .2)';
                    __that.context2d.translate(__that.width / 2 - .5, __that.height / 2 - .5);

                    // 生成和渲染粒子，如果启用
                    if (__particle) {
                        const deg = Math.random() * Math.PI * 2;
                        __that.particles.push(new Particle({
                            x: (circleRadius + 20) * Math.sin(deg),
                            y: (circleRadius + 20) * Math.cos(deg),
                            vx: .3 * Math.sin(deg) + Math.random() * .5 - .3,
                            vy: .3 * Math.cos(deg) + Math.random() * .5 - .3,
                            life: Math.random() * 10,
                            color: __circlewaveOption.particleColor
                        }));
                        // should clean dead particle before render.
                        if (__that.particles.length > __maxParticle) {
                            __that.particles.shift();
                        }
                        __that.particles.forEach((dot) => { dot.update(__that.context2d); });
                    }

                    if (__circlewaveOption.shadowBlur > 0) {
                        __that.context2d.shadowBlur = __circlewaveOption.shadowBlur;
                        __that.context2d.shadowColor = __circlewaveOption.shadowColor;
                    }

                    __that.context2d.beginPath();

                    // draw circlewave
                    __freqByteData.forEach(function (value, index) {

                        __width = (circleRadius * Math.PI - __that.option.accuracy * __circlewaveOption.spacing) / __that.option.accuracy;
                        __left = index * (__width + __circlewaveOption.spacing);
                        __circlewaveOption.spacing !== 1 && (__left += __circlewaveOption.spacing / 2);

                        if (__prettify) {
                            if (index <= __that.option.accuracy / 2) {
                                __maxHeight = (1 - (__that.option.accuracy / 2 - 1 - index) / (__that.option.accuracy / 2)) * __circlewaveOption.maxHeight;
                            } else {
                                __maxHeight = (1 - (index - __that.option.accuracy / 2) / (__that.option.accuracy / 2)) * __circlewaveOption.maxHeight;
                            }
                        } else {
                            __maxHeight = __circlewaveOption.maxHeight;
                        }

                        __height = value / 256 * __maxHeight;
                        __height = __height < __circlewaveOption.minHeight ? __circlewaveOption.minHeight : __height;

                        if (__color instanceof Array) {

                            __linearGradient = __that.context2d.createLinearGradient(
                                -circleRadius - __maxHeight,
                                -circleRadius - __maxHeight,
                                circleRadius + __maxHeight,
                                circleRadius + __maxHeight
                            );

                            __color.forEach(function (color, index) {
                                var __pos, effectiveColor;
                                if (color instanceof Array) {
                                    effectiveColor = color[1];
                                } else {
                                    effectiveColor = color;
                                }
                                __pos = index / __color.length;
                                __linearGradient.addColorStop(__pos, effectiveColor);
                            });

                            __that.context2d.strokeStyle = __linearGradient;
                            __that.context2d.fillStyle = __linearGradient;
                        } else {
                            __that.context2d.strokeStyle = __color;
                            __that.context2d.fillStyle = __color;
                        }

                        if (__fadeSide) {
                            if (index <= __that.option.accuracy / 2) {
                                __that.context2d.globalAlpha = 1 - (__that.option.accuracy / 2 - 1 - index) / (__that.option.accuracy / 2);
                            } else {
                                __that.context2d.globalAlpha = 1 - (index - __that.option.accuracy / 2) / (__that.option.accuracy / 2);
                            }
                        } else {
                            __that.context2d.globalAlpha = 1;
                        }

                        var curAngle = __angle * index;
                        var __x = Math.sin(curAngle) * (circleRadius + __height);
                        var __y = Math.cos(curAngle) * (circleRadius + __height);

                        // __that.context2d.rotate(__angle * index);
                        if (__isStart) {
                            __that.context2d.moveTo(__x, __y);
                            __isStart = false;
                        } else {
                            __that.context2d.lineTo(__x, __y);
                        }
                    });
                    var globalAlpha = __that.context2d.globalAlpha;
                    __that.context2d.closePath();
                    __that.context2d.stroke();
                    __that.context2d.globalAlpha = .5;
                    __that.context2d.fill();
                    __that.context2d.globalAlpha = globalAlpha;

                    if (__showProgress) { __that.drawProgress(__color, __progress, circleRadius); }
                    __that.drawCover(__progress, circleRadius);

                    // need to restore canvas after translate to center..
                    __that.context2d.restore();
                },

                circlebar: function (freqByteData) {
                    var __circlebarOption = __that.option.circlebar;
                    var __fadeSide = __circlebarOption.fadeSide;
                    var __prettify = __circlebarOption.prettify;
                    var __freqByteData = __that.__rebuildData(freqByteData, __circlebarOption.horizontalAlign);
                    var __angle = Math.PI * 2 / __freqByteData.length;
                    var __maxHeight, __width, __height, __left, __top, __color, __pos;
                    var circleRadius = __circlebarOption.circleRadius;
                    var __particle = __circlebarOption.particle;
                    var __maxParticle = __circlebarOption.maxParticle;
                    var __showProgress = __circlebarOption.showProgress;
                    var __progress = __that.audioSrc.currentTime / __that.audioSrc.duration;

                    if (__circlebarOption.horizontalAlign !== 'center') {
                        __fadeSide = false;
                        __prettify = false;
                    }

                    // 清除画布
                    __that.context2d.clearRect(0, 0, __that.width, __that.height);
                    __that.context2d.save();
                    __that.context2d.translate(__that.width / 2 - .5, __that.height / 2 - .5);

                    // 生成和渲染粒子，如果启用
                    if (__particle) {
                        const deg = Math.random() * Math.PI * 2;
                        __that.particles.push(new Particle({
                            x: (circleRadius + 20) * Math.sin(deg),
                            y: (circleRadius + 20) * Math.cos(deg),
                            vx: .3 * Math.sin(deg) + Math.random() * .5 - .3,
                            vy: .3 * Math.cos(deg) + Math.random() * .5 - .3,
                            life: Math.random() * 10,
                            color: __circlebarOption.particleColor
                        }));
                        // should clean dead particle before render.
                        if (__that.particles.length > __maxParticle) {
                            __that.particles.shift();
                        }
                        __that.particles.forEach((dot) => { dot.update(__that.context2d); });
                    }

                    if (__circlebarOption.shadowBlur > 0) {
                        __that.context2d.shadowBlur = __circlebarOption.shadowBlur;
                        __that.context2d.shadowColor = __circlebarOption.shadowColor;
                    }

                    __that.context2d.beginPath();

                    // draw circlebar
                    // console.warn('__freqBytesData: ', __freqByteData, ' first entry height: ', __freqByteData[1] / 256 * __circlebarOption.maxHeight);
                    __freqByteData.forEach(function (value, index) {

                        __width = (circleRadius * Math.PI - __that.option.accuracy * __circlebarOption.spacing) / __that.option.accuracy;
                        __left = index * (__width + __circlebarOption.spacing);
                        // need angle to rotate canvas for each bar.

                        __circlebarOption.spacing !== 1 && (__left += __circlebarOption.spacing / 2);

                        if (__prettify) {
                            if (index <= __that.option.accuracy / 2) {
                                __maxHeight = (1 - (__that.option.accuracy / 2 - 1 - index) / (__that.option.accuracy / 2)) * __circlebarOption.maxHeight;
                            } else {
                                __maxHeight = (1 - (index - __that.option.accuracy / 2) / (__that.option.accuracy / 2)) * __circlebarOption.maxHeight;
                            }
                        } else {
                            __maxHeight = __circlebarOption.maxHeight;
                        }

                        __height = value / 256 * __maxHeight;
                        __height = __height < __circlebarOption.minHeight ? __circlebarOption.minHeight : __height;

                        if (__circlebarOption.verticalAlign === 'middle') {
                            __top = (__that.height - __height) / 2;
                        } else if (__circlebarOption.verticalAlign === 'top') {
                            __top = 0;
                        } else if (__circlebarOption.verticalAlign === 'bottom') {
                            __top = __that.height - __height;
                        } else {
                            __top = (__that.height - __height) / 2;
                        }

                        __color = __circlebarOption.color;
                        // since circlebar use ctx.rotate for each bar, so do NOT support gradient in bar currently.
                        __that.context2d.fillStyle = __color instanceof Array ? __color[0] : __color;

                        if (__fadeSide) {
                            if (index <= __that.option.accuracy / 2) {
                                __that.context2d.globalAlpha = 1 - (__that.option.accuracy / 2 - 1 - index) / (__that.option.accuracy / 2);
                            } else {
                                __that.context2d.globalAlpha = 1 - (index - __that.option.accuracy / 2) / (__that.option.accuracy / 2);
                            }
                        } else {
                            __that.context2d.globalAlpha = 1;
                        }

                        __that.context2d.save();
                        __that.context2d.rotate(__angle * index);
                        __that.context2d.fillRect(-__width / 2, circleRadius, __width, __height);
                        __that.context2d.restore();
                        __that.context2d.fill();

                    });

                    if (__showProgress) { __that.drawProgress(__that.context2d.fillStyle, __progress, circleRadius); }
                    __that.drawCover(__progress, circleRadius);

                    // need to restore canvas after translate to center..
                    __that.context2d.restore();

                },

                waveform: function (freqByteData) {

                    var __waveformOption = __that.option.waveform;
                    var __fadeSide = __waveformOption.fadeSide;
                    var __prettify = __waveformOption.prettify;
                    var __freqByteData = __that.__rebuildData(freqByteData, __waveformOption.horizontalAlign);
                    var __maxHeight, __width, __height, __left, __top, __color, __linearGradient, __pos;

                    if (__waveformOption.horizontalAlign !== 'center') {
                        __fadeSide = false;
                        __prettify = false;
                    }

                    // 清除画布
                    __that.context2d.clearRect(0, 0, __that.width, __that.height);

                    // 绘制柱状
                    __freqByteData.forEach(function (value, index) {

                        __width = (__that.width - __that.option.accuracy * __waveformOption.spacing) / __that.option.accuracy;
                        __left = index * (__width + __waveformOption.spacing);
                        __waveformOption.spacing !== 1 && (__left += __waveformOption.spacing / 2);

                        if (__prettify) {
                            if (index <= __that.option.accuracy / 2) {
                                __maxHeight = (1 - (__that.option.accuracy / 2 - 1 - index) / (__that.option.accuracy / 2)) * __waveformOption.maxHeight;
                            } else {
                                __maxHeight = (1 - (index - __that.option.accuracy / 2) / (__that.option.accuracy / 2)) * __waveformOption.maxHeight;
                            }
                        } else {
                            __maxHeight = __waveformOption.maxHeight;
                        }




                        __height = value / 256 * __maxHeight;
                        __height = __height < __waveformOption.minHeight ? __waveformOption.minHeight : __height;

                        if (__waveformOption.verticalAlign === 'middle') {
                            __top = (__that.height - __height) / 2;
                        } else if (__waveformOption.verticalAlign === 'top') {
                            __top = 0;
                        } else if (__waveformOption.verticalAlign === 'bottom') {
                            __top = __that.height - __height;
                        } else {
                            __top = (__that.height - __height) / 2;
                        }

                        __color = __waveformOption.color;

                        if (__color instanceof Array) {

                            __linearGradient = __that.context2d.createLinearGradient(
                                __left,
                                __top,
                                __left,
                                __top + __height
                            );

                            __color.forEach(function (color, index) {
                                if (color instanceof Array) {
                                    __pos = color[0];
                                    color = color[1];
                                } else if (index === 0 || index === __color.length - 1) {
                                    __pos = index / (__color.length - 1);
                                } else {
                                    __pos = index / __color.length + 0.5 / __color.length;
                                }
                                __linearGradient.addColorStop(__pos, color);
                            });

                            __that.context2d.fillStyle = __linearGradient;

                        } else {
                            __that.context2d.fillStyle = __color;
                        }

                        if (__waveformOption.shadowBlur > 0) {
                            __that.context2d.shadowBlur = __waveformOption.shadowBlur;
                            __that.context2d.shadowColor = __waveformOption.shadowColor;
                        }

                        if (__fadeSide) {
                            if (index <= __that.option.accuracy / 2) {
                                __that.context2d.globalAlpha = 1 - (__that.option.accuracy / 2 - 1 - index) / (__that.option.accuracy / 2);
                            } else {
                                __that.context2d.globalAlpha = 1 - (index - __that.option.accuracy / 2) / (__that.option.accuracy / 2);
                            }
                        } else {
                            __that.context2d.globalAlpha = 1;
                        }

                        __that.context2d.fillRect(__left, __top, __width, __height);
                        // 生成和渲染粒子，如果启用
                        if (__prettify) {
                            //  var dot = __that.context2d, gA;
                            // const randomNumber = generateRandomNumber(20, 20);
                            //  __that.context2d.beginPath();
                            // console.log(' __top+__height+randomNumber', __top+__height+randomNumber);
                            //  __that.context2d.arc(__left, __top+__height+randomNumber, 10, 0, Math.PI * 2);
                            //  __that.context2d.fill();

                        }

                    });

                },
                wavy: function (array) {
                    __that.context2d.clearRect(0, 0, __that.width, __that.height);

                    this.baseY = __that.height - 10

                    let waveArr1 = [], waveArr2 = [], waveTemp = [], leftTemp = [], rightTemp = [], waveStep = 50, leftStep = 70, rightStep = 90;
                    array.map((data, k) => {
                        if (waveStep == 50 && waveTemp.length < 9) {
                            waveTemp.push(data / 2.6);
                            waveStep = 0;
                        } else {
                            waveStep++;
                        }
                        if (leftStep == 0 && leftTemp.length < 5) {
                            leftTemp.unshift(Math.floor(data / 4.8));
                            leftStep = 70;
                        } else {
                            leftStep--;
                        }
                        if (rightStep == 0 && rightTemp.length < 5) {
                            rightTemp.push(Math.floor(data / 4.8));
                            rightStep = 90;
                        } else {
                            rightStep--;
                        }
                    });

                    waveArr1 = leftTemp.concat(waveTemp).concat(rightTemp);
                    waveArr2 = leftTemp.concat(rightTemp);
                    waveArr2.map((data, k) => {
                        waveArr2[k] = data * 1.8;
                    });
                    let waveWidth = Math.ceil(__that.width / (waveArr1.length - 3));
                    let waveWidth2 = Math.ceil(__that.width / (waveArr2.length - 3));
                    var __wavyOption = __that.option.wavy;
                    var __color = __wavyOption.color;
                    let color1 = 'rgba(255, 255, 255, 0.2)';
                    let color2 = 'rgba(255, 255, 255, 0.4)';

                    if (__color instanceof Array) {
                        color1 = __color[0]
                        color2 = __color[1]
                    } else {
                        color1 = __color
                        color2 = __color
                    }

                    __that.context2d.beginPath();
                    __that.context2d.fillStyle = color1
                    __that.context2d.moveTo(-waveWidth * 2, this.baseY - waveArr1[0]);
                    for (let i = 1; i < waveArr1.length - 2; i++) {
                        let p0 = { x: (i - 2) * waveWidth, y: waveArr1[i - 1] };
                        let p1 = { x: (i - 1) * waveWidth, y: waveArr1[i] };
                        let p2 = { x: (i) * waveWidth, y: waveArr1[i + 1] };
                        let p3 = { x: (i + 1) * waveWidth, y: waveArr1[i + 2] };

                        for (let j = 0; j < 100; j++) {
                            let t = j * (1.0 / 100);
                            let tt = t * t;
                            let ttt = tt * t;
                            let CGPoint = {};
                            CGPoint.x = 0.5 * (2 * p1.x + (p2.x - p0.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * tt + (3 * p1.x - p0.x - 3 * p2.x + p3.x) * ttt);
                            CGPoint.y = 0.5 * (2 * p1.y + (p2.y - p0.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * tt + (3 * p1.y - p0.y - 3 * p2.y + p3.y) * ttt);
                            __that.context2d.lineTo(CGPoint.x, this.baseY - CGPoint.y);
                        }
                        __that.context2d.lineTo(p2.x, this.baseY - p2.y);
                    }
                    __that.context2d.lineTo((waveArr1.length) * waveWidth, this.baseY - waveArr1[waveArr1.length - 1]);
                    __that.context2d.lineTo(__that.width + waveWidth * 2, this.baseY);
                    __that.context2d.lineTo(__that.width + waveWidth * 2, __that.height);
                    __that.context2d.lineTo(-2 * waveWidth, __that.height);
                    __that.context2d.fill();


                    __that.context2d.beginPath();
                    __that.context2d.fillStyle = color2

                    __that.context2d.moveTo(-waveWidth2 * 2, this.baseY - waveArr1[0]);
                    for (let i = 1; i < waveArr1.length - 2; i++) {
                        let p0 = { x: (i - 2) * waveWidth2, y: waveArr1[i - 1] };
                        let p1 = { x: (i - 1) * waveWidth2, y: waveArr1[i] };
                        let p2 = { x: (i) * waveWidth2, y: waveArr1[i + 1] };
                        let p3 = { x: (i + 1) * waveWidth2, y: waveArr1[i + 2] };

                        for (let j = 0; j < 100; j++) {
                            let t = j * (1.0 / 100);
                            let tt = t * t;
                            let ttt = tt * t;
                            let CGPoint = {};
                            CGPoint.x = 0.5 * (2 * p1.x + (p2.x - p0.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * tt + (3 * p1.x - p0.x - 3 * p2.x + p3.x) * ttt);
                            CGPoint.y = 0.5 * (2 * p1.y + (p2.y - p0.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * tt + (3 * p1.y - p0.y - 3 * p2.y + p3.y) * ttt);
                            __that.context2d.lineTo(CGPoint.x, this.baseY - CGPoint.y);
                        }
                        __that.context2d.lineTo(p2.x, this.baseY - p2.y);
                    }
                    __that.context2d.lineTo((waveArr1.length) * waveWidth2, this.baseY - waveArr1[waveArr1.length - 1]);
                    __that.context2d.lineTo(__that.width + waveWidth2 * 2, this.baseY);
                    __that.context2d.lineTo(__that.width + waveWidth2 * 2, __that.height);
                    __that.context2d.lineTo(-2 * waveWidth2, __that.height);
                    __that.context2d.fill();
                },
                bar: function (array) {
                    __that.context2d.clearRect(0, 0, __that.width, __that.height);

                    this.baseY = __that.height - 10

                    let waveArr1 = [], waveArr2 = [], waveTemp = [], leftTemp = [], rightTemp = [], waveStep = 50, leftStep = 70, rightStep = 90;
                    array.map((data, k) => {
                        if (waveStep == 50 && waveTemp.length < 9) {
                            waveTemp.push(data / 2.6);
                            waveStep = 0;
                        } else {
                            waveStep++;
                        }
                        if (leftStep == 0 && leftTemp.length < 5) {
                            leftTemp.unshift(Math.floor(data / 4.8));
                            leftStep = 70;
                        } else {
                            leftStep--;
                        }
                        if (rightStep == 0 && rightTemp.length < 5) {
                            rightTemp.push(Math.floor(data / 4.8));
                            rightStep = 90;
                        } else {
                            rightStep--;
                        }
                    });

                    waveArr1 = leftTemp.concat(waveTemp).concat(rightTemp);
                    waveArr2 = leftTemp.concat(rightTemp);
                    waveArr2.map((data, k) => {
                        waveArr2[k] = data * 1.8;
                    });
                    let waveWidth = Math.ceil(__that.width / (waveArr1.length - 3));
                    let waveWidth2 = Math.ceil(__that.width / (waveArr2.length - 3));
                    var __wavyOption = __that.option.wavy;
                    var __color = __wavyOption.color;
                    let color1 = 'rgba(255, 255, 255, 0.2)';
                    let color2 = 'rgba(255, 255, 255, 0.4)';

                    if (__color instanceof Array) {
                        color1 = __color[0]
                        color2 = __color[1]
                    } else {
                        color1 = __color
                        color2 = __color
                    }

                    __that.context2d.beginPath();
                    __that.context2d.fillStyle = color1
                    __that.context2d.moveTo(-waveWidth * 2, this.baseY - waveArr1[0]);
                    for (let i = 1; i < waveArr1.length - 2; i++) {
                        let p0 = { x: (i - 2) * waveWidth, y: waveArr1[i - 1] };
                        let p1 = { x: (i - 1) * waveWidth, y: waveArr1[i] };
                        let p2 = { x: (i) * waveWidth, y: waveArr1[i + 1] };
                        let p3 = { x: (i + 1) * waveWidth, y: waveArr1[i + 2] };

                        for (let j = 0; j < 100; j++) {
                            let t = j * (1.0 / 100);
                            let tt = t * t;
                            let ttt = tt * t;
                            let CGPoint = {};
                            CGPoint.x = 0.5 * (2 * p1.x + (p2.x - p0.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * tt + (3 * p1.x - p0.x - 3 * p2.x + p3.x) * ttt);
                            CGPoint.y = 0.5 * (2 * p1.y + (p2.y - p0.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * tt + (3 * p1.y - p0.y - 3 * p2.y + p3.y) * ttt);
                            __that.context2d.lineTo(CGPoint.x, this.baseY - CGPoint.y);
                        }
                        __that.context2d.lineTo(p2.x, this.baseY - p2.y);
                    }
                    __that.context2d.lineTo((waveArr1.length) * waveWidth, this.baseY - waveArr1[waveArr1.length - 1]);
                    __that.context2d.lineTo(__that.width + waveWidth * 2, this.baseY);
                    __that.context2d.lineTo(__that.width + waveWidth * 2, __that.height);
                    __that.context2d.lineTo(-2 * waveWidth, __that.height);
                    __that.context2d.fill();


                    __that.context2d.beginPath();
                    __that.context2d.fillStyle = color2

                    __that.context2d.moveTo(-waveWidth2 * 2, this.baseY - waveArr1[0]);
                    for (let i = 1; i < waveArr1.length - 2; i++) {
                        let p0 = { x: (i - 2) * waveWidth2, y: waveArr1[i - 1] };
                        let p1 = { x: (i - 1) * waveWidth2, y: waveArr1[i] };
                        let p2 = { x: (i) * waveWidth2, y: waveArr1[i + 1] };
                        let p3 = { x: (i + 1) * waveWidth2, y: waveArr1[i + 2] };

                        for (let j = 0; j < 100; j++) {
                            let t = j * (1.0 / 100);
                            let tt = t * t;
                            let ttt = tt * t;
                            let CGPoint = {};
                            CGPoint.x = 0.5 * (2 * p1.x + (p2.x - p0.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * tt + (3 * p1.x - p0.x - 3 * p2.x + p3.x) * ttt);
                            CGPoint.y = 0.5 * (2 * p1.y + (p2.y - p0.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * tt + (3 * p1.y - p0.y - 3 * p2.y + p3.y) * ttt);
                            __that.context2d.lineTo(CGPoint.x, this.baseY - CGPoint.y);
                        }
                        __that.context2d.lineTo(p2.x, this.baseY - p2.y);
                    }
                    __that.context2d.lineTo((waveArr1.length) * waveWidth2, this.baseY - waveArr1[waveArr1.length - 1]);
                    __that.context2d.lineTo(__that.width + waveWidth2 * 2, this.baseY);
                    __that.context2d.lineTo(__that.width + waveWidth2 * 2, __that.height);
                    __that.context2d.lineTo(-2 * waveWidth2, __that.height);
                    __that.context2d.fill();
                },
            }

        },

        // 开始
        dance: function () {
            if (this.stat === 0 || this.analyser.context.state === 'suspended') {
                this.analyser.context.resume();
                this.stat = 1;
                this.__animate();
            }
            return this;
        },

        // 暂停
        pause: function () {
            this.stat = 0;
            //// for saving CPU, could cancle animation.
            return this;
        },

        // 改变参数
        setOption: function (option) {
            this.option = __mergeOption(this.option, option);
        },

        drawCover: function (__progress, circleRadius) {
            var __that = this;
            // draw cover image
            if (__that.coverImg.width !== 0) {
                var img = __that.coverImg;
                __that.context2d.save();
                __that.context2d.beginPath();
                __that.context2d.lineWidth = .5;
                __that.context2d.globalCompositeOperation = 'source-over';
                __that.context2d.rotate(Math.PI * 2 * __progress / 2);
                __that.context2d.arc(0, 0, circleRadius - 13, -Math.PI / 2, Math.PI * 2 - Math.PI / 2);
                __that.context2d.stroke();
                __that.context2d.clip();
                if (img.width / img.height > 1) {
                    var croppedImgWidth = circleRadius * 2 * (img.width - img.height) / (img.height);
                    __that.context2d.drawImage(img, -circleRadius - 10 - croppedImgWidth / 2, -circleRadius - 10, circleRadius * 2 * img.width / img.height, circleRadius * 2);
                } else {
                    __that.context2d.drawImage(img, -circleRadius - 10, -circleRadius - 10, circleRadius * 2, circleRadius * 2 * img.height / img.width);
                }
                __that.context2d.restore();
            }
        },

        drawProgress: function (__color, __progress, circleRadius) {
            // draw progress circular.
            var __that = this;
            __that.context2d.beginPath();
            __that.context2d.strokeStyle = __color;
            __that.context2d.lineWidth = 4;
            __that.context2d.lineCap = 'round';
            __that.context2d.shadowBlur = 8;
            __that.context2d.arc(0, 0, circleRadius - 10, -Math.PI / 2, Math.PI * 2 * __progress - Math.PI / 2);
            __that.context2d.stroke();
        }

    };

    return Vudio;

});
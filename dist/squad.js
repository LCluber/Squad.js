/** MIT License
* 
* Copyright (c) 2015 Ludovic CLUBER 
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
* http://squadjs.lcluber.com
*/

(function(global, factory) {
    typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define([ "exports" ], factory) : factory(global.SQUAD = {});
})(this, function(exports) {
    "use strict";
    var Message = function() {
        function Message(author, text) {
            this.author = author;
            this.time = this.getTime();
            this.text = text;
            this.html = this.setHTML();
        }
        Message.prototype.setHTML = function() {
            var c = '<li class="left clearfix">';
            c += '<div class="chat-body clearfix">';
            c += '<small class=" text-muted">' + this.time + "</small> ";
            c += "[" + this.author.name + "] ";
            c += this.text;
            c += "</div>";
            c += "</li>";
            return c;
        };
        Message.prototype.getTime = function() {
            var d = new Date();
            return this.pad(d.getHours()) + ":" + this.pad(d.getMinutes()) + ":" + this.pad(d.getSeconds());
        };
        Message.prototype.pad = function(n) {
            return ("0" + n).slice(-2);
        };
        return Message;
    }();
    var DOM = function() {
        function DOM() {
            this.chatBox = this.findDOMElementById("chat");
            this.messageInput = this.findDOMElementById("message");
        }
        DOM.prototype.getNewMessage = function() {
            return this.messageInput.value;
        };
        DOM.prototype.displayMessage = function(message) {
            this.chatBox.innerHTML += message;
            this.scrollToBottom();
        };
        DOM.prototype.scrollToBottom = function() {
            this.chatBox.scrollTop = this.chatBox.scrollHeight;
        };
        DOM.prototype.clearMessageInput = function() {
            this.messageInput.value = "";
        };
        DOM.prototype.findDOMElementById = function(id) {
            return document.getElementById(id);
        };
        return DOM;
    }();
    var User = function() {
        function User(name) {
            this.setName(name);
        }
        User.prototype.setName = function(name) {
            if (name) {
                this.name = name;
            } else {
                this.name = localStorage.getItem("userName") ? localStorage.getItem("userName") : this.makeId();
            }
        };
        User.prototype.makeId = function() {
            var text = "";
            var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < 5; i++) {
                text += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            }
            localStorage.setItem("userName", text);
            return text;
        };
        return User;
    }();
    var Chat = function() {
        function Chat(userName) {
            var _this = this;
            this.socket = io();
            this.msgMaxLength = 140;
            this.user = new User(userName);
            this.DOM = new DOM();
            this.socket.on("message", function(msg) {
                _this.DOM.displayMessage(msg);
            });
        }
        Chat.prototype.sendMessage = function() {
            var msgContent = this.DOM.getNewMessage();
            if (msgContent) {
                var message = new Message(this.user, msgContent);
                this.socket.emit("message", message.html);
                this.DOM.clearMessageInput();
            }
        };
        return Chat;
    }();
    exports.Chat = Chat;
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
});
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

class Message {
    constructor(author, text) {
        this.author = author;
        this.time = this.getTime();
        this.text = text;
        this.html = this.setHTML();
    }
    setHTML() {
        let c = '<li class="left clearfix">';
        c += '<div class="chat-body clearfix">';
        c += '<small class=" text-muted">' + this.time + '</small> ';
        c += '[' + this.author.name + '] ';
        c += this.text;
        c += '</div>';
        c += '</li>';
        return c;
    }
    getTime() {
        let d = new Date();
        return this.pad(d.getHours()) + ':' + this.pad(d.getMinutes()) + ':' + this.pad(d.getSeconds());
    }
    pad(n) {
        return ("0" + n).slice(-2);
    }
}

class DOM {
    constructor() {
        this.chatBox = this.findDOMElementById('chat');
        this.messageInput = this.findDOMElementById('message');
    }
    getNewMessage() {
        return this.messageInput.value;
    }
    displayMessage(message) {
        this.chatBox.innerHTML += message;
        this.scrollToBottom();
    }
    scrollToBottom() {
        this.chatBox.scrollTop = this.chatBox.scrollHeight;
    }
    clearMessageInput() {
        this.messageInput.value = '';
    }
    findDOMElementById(id) {
        return document.getElementById(id);
    }
}

class User {
    constructor(name) {
        this.setName(name);
    }
    setName(name) {
        if (name) {
            this.name = name;
        }
        else {
            this.name = localStorage.getItem('userName') ? localStorage.getItem('userName') : this.makeId();
        }
    }
    makeId() {
        let text = "";
        let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 5; i++) {
            text += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        }
        localStorage.setItem('userName', text);
        return text;
    }
}

class Chat {
    constructor(userName) {
        this.socket = io();
        this.msgMaxLength = 140;
        this.user = new User(userName);
        this.DOM = new DOM();
        this.socket.on('message', (msg) => {
            this.DOM.displayMessage(msg);
        });
    }
    sendMessage() {
        let msgContent = this.DOM.getNewMessage();
        if (msgContent) {
            let message = new Message(this.user, msgContent);
            this.socket.emit('message', message.html);
            this.DOM.clearMessageInput();
        }
    }
}

export { Chat };

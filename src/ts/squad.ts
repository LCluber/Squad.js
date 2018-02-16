import { Message } from './message';
import { DOM } from './dom';
import { User } from './user';

export class Chat {
  socket: any;//@types for socket.io 2 not available yet
  msgMaxLength: number;
  user: User;
  DOM : DOM;

  constructor(userName:string) {
    this.socket = io();
    this.msgMaxLength = 140;
    this.user = new User(userName);
    this.DOM = new DOM();
    
    this.socket.on('message', (msg: string)=>{
      this.DOM.displayMessage(msg);
    });
  }
  
  public sendMessage(): void {
    let msgContent: string = this.DOM.getNewMessage();
    if (msgContent) {
      //var p = JSON.stringify(msgsToSend);
      //console.log(p);
      let message: Message = new Message(this.user, msgContent);
      
      this.socket.emit('message', message.html);
      this.DOM.clearMessageInput();
    }
  }

  // private addMessage(msgHTML: string ): void {
  //   this.DOM.displayMessage(msgHTML);
  // }

  
}

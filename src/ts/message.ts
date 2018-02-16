import { User } from './user';

export class Message {
  author: User;
  //recipient: string;
  time: string;
  text: string;
  html: string;
  
  constructor(  author: User,
                //recipient: string,
                text: string
              ){
    this.author     = author;
    //this.recipient  = recipient;
    this.time       = this.getTime();
    this.text       = text;
    this.html       = this.setHTML();
  }
  
  private setHTML(): string{
    let c: string = '<li class="left clearfix">';
    c += '<div class="chat-body clearfix">';
    //c += '<div class="pull-right">';
    
    //c += '</div>';
    //c += '<p>';
    c += '<small class=" text-muted">' + this.time + '</small> ';
    c += '[' + this.author.name + '] ';
    c += this.text;
    //c += '</p>';
    c += '</div>';
    c += '</li>';
    
    return c;
  }
  
  private getTime(): string {
    let d = new Date();
    return this.pad(d.getHours()) + ':' + this.pad(d.getMinutes()) + ':' + this.pad(d.getSeconds());
  }

  private pad(n:number): string {
    return ("0" + n).slice(-2);
  }
  
}

export class DOM {
  chatBox: HTMLElement;
  messageInput: HTMLInputElement;
  
  constructor(){
    this.chatBox = this.findDOMElementById('chat');
    this.messageInput = <HTMLInputElement>this.findDOMElementById('message');
  }
  
  public getNewMessage(){
    return this.messageInput.value;
  }
  
  public displayMessage(message: string): void{
    this.chatBox.innerHTML += message;
    this.scrollToBottom();
  }
  
  public scrollToBottom(): void{
    this.chatBox.scrollTop = this.chatBox.scrollHeight;
  }
  
  public clearMessageInput(): void {
    this.messageInput.value = '';
    //findDOMElementById('textareaCounter').innerText = msgMaxLength + '';
  }

  private findDOMElementById(id: string): HTMLElement | HTMLInputElement {
    return document.getElementById(id);
  }
  
}

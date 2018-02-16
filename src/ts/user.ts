
export class User {
  name: string;

  constructor(name:string) {
    this.setName(name);
  }

  private setName(name:string):void{
    if(name) {
      this.name = name;
    } else {
      this.name = localStorage.getItem('userName') ? localStorage.getItem('userName') : this.makeId();
    }
  }

  private makeId():string {
    let text = "";
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++) {
      text += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    localStorage.setItem('userName', text);
    return text;
  }

  
}

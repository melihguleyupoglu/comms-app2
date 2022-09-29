import { emitDistinctChangesOnlyDefaultValue } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { data } from 'jquery';
import * as JsSIP from 'jssip';
import { RTCSession } from 'jssip/lib/RTCSession';
import { isEmpty } from 'jssip/lib/Utils';

@Component({
  selector: 'app-receive-call',
  templateUrl: './receive-call.component.html',
  styleUrls: ['./receive-call.component.css']
})
export class ReceiveCallComponent implements OnInit {

  constructor() { }


  sipUA!: JsSIP.UA;

  isLineEmpty: boolean = true;




  ngOnInit(){;
  }

 /*initSip(){

    var socket = new JsSIP.WebSocketInterface('wss://192.168.1.128:8089/ws');

    const configuration = {
      sockets: [ socket ],
      ws_servers: 'ws://192.168.1.128:8089',
      uri: '6002@192.168.1.128',
      password: '6002'
  };


    this.sipUA = new  JsSIP.UA(configuration);


    this.sipUA.start();


    this.sipUA.on("newRTCSession", function(e) {
      console.log("newRTCSession works.");
      var session = e.session;


      var callOptions = {
        mediaConstraints: {
          audio: true, // only audio calls
          video: false
        }
      };
  

      if(session.originator === "remote") {

        
        session.on("accepted", function(){
          
        });
        session.on("confirmed", function(){
          // this handler will be called for incoming calls too.
        });
        session.on("ended", function(){
          // the call has ended.
        });
        session.on("failed", function(){
          // unable to establish the call
        });
        session.on('addstream', function(e) {
          const remoteAudio = document.createElement('audio');
          remoteAudio.srcObject = e['stream'];
          remoteAudio.play();
        });
        session.answer(callOptions);
      }      
      });
      

    console.log("DONE.");
    }

    
*/    
}




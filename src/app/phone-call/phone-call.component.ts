import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Options } from 'select2';
import { Select2OptionData } from 'ng-select2';
import * as JsSIP from 'jssip';
import { OnHoldResult, RTCSession }  from 'jssip/lib/RTCSession';


(window as any).global = window;
@Component({
    selector: 'app-phone-call',
    templateUrl: './phone-call.component.html',
    styleUrls: ['./phone-call.component.css']
})




export class PhoneCallComponent implements OnInit, AfterViewInit {


    constructor(private modalService: NgbModal) { }


    callInprogress = false;


    s2Options: Options = {
        multiple: true,
        width: '100'
    }
    

    phoneNumbers!: Select2OptionData[];

    selectedPhoneNumber : string = '6001';

    sipUA!: JsSIP.UA;

    rtcSession!: RTCSession;

    sipStatus!: string;

    //callStatus: string;

    sounds: any;

    callStatus_!: string;

    callStatus: CallStatus = new CallStatus;

    isReady: boolean = false;

    callStart: boolean = false;

    @ViewChild('incoming', { static: false }) incomingSound!: ElementRef<HTMLAudioElement>;

    @ViewChild('outgoing', { static: false }) outgoingSound!: ElementRef<HTMLAudioElement>;

    @ViewChild('dmtf', { static: false }) dmtfSound!: ElementRef<HTMLAudioElement>;

    timer: number = 0;

    interval;


    ngOnInit() {
        this.initSip();
    }

    
    ngAfterViewInit() {
        this.sounds = {
            incoming: this.incomingSound.nativeElement,
            outgoing: this.incomingSound.nativeElement,
            dmtf: this.incomingSound.nativeElement,
        },
        this.receiveCalls();
    }


    initSip() {


        var socket = new JsSIP.WebSocketInterface('ws://YOUR_IP:8089/ws');


        const configuration = {
            sockets: [ socket ],
            ws_servers: 'ws://YOUR_IP:8089/ws',
            uri: '6002@YOUR_IP',
            password: '6002'
        };

        this.sipUA = new JsSIP.UA(configuration);
        
  
        var eventHandlers = {
            'progress': function(e) {
              console.log('call is in progress');
            },
            'failed': function(e) {
              console.log('call failed with cause: '+ e.data.cause);
            },
            'ended': function(e) {
              console.log('call ended with cause: '+ e.data.cause);
            },
            'confirmed': function(e) {
              console.log('call confirmed');
            },
            'addstream': function(e) {
                var stream = e.stream;
            }
          };
        
        
        var options = {
            'eventHandlers'    : eventHandlers,
            'mediaConstraints' : { 'audio': true, 'video': false }
          };

        
        this.sipUA.on('connecting', e => {
            this.sipStatus = 'Connecting...';
        });

        this.sipUA.on('connected', e => {
            this.sipStatus = 'Connected';
        });

        this.sipUA.on('disconnected', e => {
            this.sipStatus = 'Disconnected';
        });

        this.sipUA.on('registered', e => {
            this.sipStatus = 'Ready';
            this.isReady = true;
        });

        this.sipUA.on('unregistered', e => {
            this.sipStatus = 'UnRegistered';
        });

        this.sipUA.on('registrationFailed', e => {
            console.log(e)
            this.sipStatus = 'Registration Failed';
        });

        this.sipUA.start();
       
        this.phoneNumbers = [
            {
                id: '6002',
                text: '6002'
            }
        ];   
    }


    open(content) { 

        this.sipUA.start();

        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {

        }, (reason) => {

        });
    }


    receiveCalls() {
        this.sipUA.on("newRTCSession", function(e) {
            var session = e.session
            console.log("new rtc session initiated.")
            console.log(session)
            
            
            const callOptions = {
                mediaConstraints: { audio: true, video: false }
            };
            if (session.originator === "local") {
                console.log("local call...")
            }
            if (session.originator === 'remote') {
                console.log("remote call...");

                session.on("accepted", function() {

                });
                
                session.on("confirmed", function(){

                });

                session.on("ended", function(){
                    // the call has ended.
                  });
                session.on("failed", function(){
                    // unable to establish the call
                });
                
                session.answer(callOptions);
                const remoteAudio = document.createElement('audio');
                remoteAudio.srcObject = e.stream;
                remoteAudio.play();
            }      
        });
    }

    
    async makeCall() {

        var eventHandlers = {
            'progress': function(e) {
              console.log('call is in progress');
            },
            'failed': function(e) {
              console.log('call failed with cause: '+ e.data.cause);
            },
            'ended': function(e) {
              console.log('call ended with cause: '+ e.data.cause);
            },
            'confirmed': function(e) {
              console.log('call confirmed');
            },
            'addstream': function(e) {
                var stream = e.stream;
            }
          };


        if (this.rtcSession && this.rtcSession.isInProgress()) {
            this.rtcSession.terminate();
            return true;
        }


        const callOptions = {
            mediaConstraints: { audio: true, video: false },            
        };


        const number = this.phoneNumbers[0]['id'];


        this.rtcSession = this.sipUA.call("6003@YOUR_IP, callOptions);


        //remote audio part.
        this.rtcSession.connection.addEventListener('addstream', function(e) {
            const remoteAudio = document.createElement('audio');
            remoteAudio.srcObject = e['stream'];
            remoteAudio.play();
        });   


        this.rtcSession.on('peerconnection', () => {
            this.callStatus.currentStatus = 'DAILING';
            this.callStatus.resetCallStatus().dailing = true;
            this.stopSound()['outgoing'].play();
        });
        
        
        this.rtcSession.on('progress', e => {
            this.callStatus.resetCallStatus().inProgress = true;
        });

        this.rtcSession.on('accepted', e => {
            this.stopSound();
            this.startCallTimer();
        });

        this.rtcSession.on('ended', e => {
            this.callTerminated();
            this.stopCallTimer();
        });

        this.rtcSession.on('failed', e => {
            this.callTerminated();
            this.stopCallTimer();
        });

        this.rtcSession.on('hold', e => {
            this.callStatus.currentStatus = 'ON HOLD';
            this.callStatus.onHold = true;
        });

        this.rtcSession.on('unhold', e => {

            this.callStatus.currentStatus = 'IN PROGRESS';
            this.callStatus.onHold = false;
        });

        this.rtcSession.on('muted', e => {
            this.callStatus.currentStatus = 'MUTE';
            this.callStatus.onMute = true;
        });

        this.rtcSession.on('unmuted', e => {
            this.callStatus.onMute = false;
        });
    }

    callTerminated() {
        this.callStatus.resetCallStatus();
        this.stopCallTimer();
        
        
        this.callStatus.currentStatus = 'CALL ENDED';

        setTimeout(() => {
            this.callStatus.currentStatus = '';
        }, 1000);

        this.stopSound();
        this.sipUA.terminateSessions()
    }

    onMute() {

        if (this.isMuted()) {
            this.rtcSession.unmute();
            return;
        }

        this.rtcSession.mute()
    }


    stopSound(): CallSounds {
        Object.keys(this.sounds).map((value) => (this.sounds[value].pause()));

        return this.sounds;
    }


    isInProgress(): boolean {
        return this.rtcSession.isInProgress();
    }

    isEstablished(): boolean {
        if (!this.rtcSession) return false;
        return this.rtcSession.isEstablished();
    }

    isEnded(): boolean {
        return this.rtcSession.isEnded();
    }

    isReadyToReOffer(): boolean {
        return this.rtcSession.isReadyToReOffer();
    }

    isMuted(): boolean | undefined {
        if (!this.rtcSession) return false;
        return this.rtcSession.isMuted().audio ;
    }

    isOnHold(): boolean | OnHoldResult {
        if (!this.rtcSession) return true;
        return this.rtcSession.isOnHold();
    }

    startCallTimer() {
        this.interval = setInterval(() => {
            this.timer += 1000;
        }, 1000)
    }

    stopCallTimer() {
        clearInterval(this.interval);
    }
}

interface CallSounds {
    [key: string]: HTMLAudioElement;
}


class CallStatus {

    dailing!: boolean;

    connecting!: boolean;

    inProgress: boolean = false;

    onHold!: boolean;

    onMute!: boolean;

    currentStatus!: string;

    isReadyToCall!: boolean;


    resetCallStatus = (): CallStatus => {
        this.dailing = false;
        this.connecting = false;
        this.inProgress = false;
        this.onHold = false;
        this.onMute = false;

        return this;
    }

    isCalling(): boolean {
        return this.dailing || this.inProgress;
    }

}


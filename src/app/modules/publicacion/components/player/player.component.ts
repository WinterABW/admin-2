import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {Publicacion} from '../../../../models/publicacion';

declare let shaka: any;

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('videoPlayer') videoElementRef: ElementRef | undefined;
  @ViewChild('videoContainer') videoContainerRef: ElementRef | undefined;

  videoElement: HTMLVideoElement | undefined;
  videoContainerElement: HTMLDivElement | undefined;
  
  @Input() publicacion: Publicacion;
  player: any;

  constructor(
    private deviceService: DeviceDetectorService,
  ) {
  }

  ngOnDestroy(): void {
    this.player.destroy();
    delete this.player;
  }

  ngOnInit() {
    if (this.publicacion) {
      
    }
  }

  ngAfterViewInit(): void {
    shaka.polyfill.installAll();
    if (shaka.Player.isBrowserSupported()) {
      this.videoElement = this.videoElementRef?.nativeElement;
      this.videoContainerElement = this.videoContainerRef?.nativeElement;
      this.initPlayer();
    } else {
      console.error('Browser not supported!');
    }
  }

  private async initPlayer() {

    this.player = new shaka.Player();
    await this.player.attach(this.videoElement);
    const ui = new shaka.ui.Overlay(
      this.player,
      this.videoContainerElement,
      this.videoElement,
    );
    
    const config = {
      'seekBarColors': {
        base: 'rgba(255,255,255,.2)',
        buffered: 'rgba(255,255,255,.4)',
        played: 'rgb(33, 150, 243)'
      },
      'enableTooltips' : true,
      'overflowMenuButtons' : ['quality', 'language', 'captions', 'playback_rate'],
      controlPanelElements: [
        'play_pause',
        'mute',
        'volume',
        'time_and_duration',
        'spacer',
        'fullscreen',
        'overflow_menu',
      ],
    };

    let videoUrl = this.publicacion.url_manifiesto;
    let subUrl = this.publicacion.url_subtitulo;

    if ( (this.deviceService.os === 'mac' || this.deviceService.os === 'Mac' || this.deviceService.os === 'iOS') && (this.publicacion.tipo != 'live') ) {
      let url = this.publicacion.url_manifiesto.slice(0, -12);
      videoUrl = `${url}master.m3u8`;
    }

    ui.configure(config);
    this.player.load(videoUrl).then(() => {
      if(subUrl) {
        this.player.addTextTrackAsync(subUrl+'.vtt', "es", "subtitle", 'text/vtt').then(() => {
        });
      }
    })
    .catch((e: any) => {
      console.error(e);
    });
  }

}

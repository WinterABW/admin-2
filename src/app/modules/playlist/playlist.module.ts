import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PlaylistRoutingModule} from './playlist-routing.module';
import {PlaylistComponent} from './components/playlist/playlist.component';
import {PlaylistFormComponent} from './components/playlist-form/playlist-form.component';
import {PlaylistNewComponent} from './components/playlist-new/playlist-new.component';
import {PlaylistEditComponent} from './components/playlist-edit/playlist-edit.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PlaylistBottomSheetComponent} from './components/playlist-bottom-sheet/playlist-bottom-sheet.component';

import { CommonComponentsModule } from 'src/app/common/common-components.module';
import { DemoMaterialModule } from 'src/app/demo-material-module';


@NgModule({
    declarations: [
        PlaylistComponent,
        PlaylistFormComponent,
        PlaylistNewComponent, 
        PlaylistEditComponent, 
        PlaylistBottomSheetComponent,
    ],
        
    imports: [
        CommonModule,
        PlaylistRoutingModule,
        DemoMaterialModule,
        ReactiveFormsModule,
        NgSelectModule,
        DragDropModule,
        CommonComponentsModule,
    ],
    exports: [
        PlaylistComponent,
        PlaylistFormComponent,
        PlaylistNewComponent, 
        PlaylistEditComponent, 
        PlaylistBottomSheetComponent,
    ]
})
export class PlaylistModule {
}

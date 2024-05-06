import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicacionRoutingModule } from './publicacion-routing.module';
import { PublicationListComponent } from './components/publication-list/publication-list.component';
import { PublicationCommentsDialogComponent } from './components/publication-comments-dialog/publication-comments-dialog.component';
import { PublicationDownloadDialogComponent } from './components/publication-download-dialog/publication-download-dialog.component';
import { PlayerComponent } from './components/player/player.component';
import { PublicationEditComponent } from './components/publication-edit/publication-edit.component';
import { PublicationAddComponent } from './components/publication-add/publication-add.component';
import { PublicationReproduccionDialogComponent } from './components/publication-reproduccion-dialog/publication-reproduccion-dialog.component';
import { PublicationVoteDialogComponent } from './components/publication-vote-dialog/publication-vote-dialog.component';
import { PublicationBottomSheetComponent } from './components/publication-bottom-sheet/publication-bottom-sheet.component';
import { DetailsPublicationComponent } from './components/details-publication/details-publication.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonComponentsModule } from 'src/app/common/common-components.module';
import { ShortNumberPipe } from 'src/app/pipes/short-number.pipe';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { PlaylistModule } from '../playlist/playlist.module';


@NgModule({
    declarations: [
        PublicationListComponent,
        PublicationAddComponent,
        PublicationEditComponent,
        PlayerComponent,
        PublicationCommentsDialogComponent,
        PublicationDownloadDialogComponent,
        PublicationReproduccionDialogComponent,
        PublicationVoteDialogComponent,
        PublicationBottomSheetComponent,
        DetailsPublicationComponent,
        ShortNumberPipe,
    ],
    exports: [
    ],
    imports: [
        CommonModule,
        PublicacionRoutingModule,
        ReactiveFormsModule,
        NgSelectModule,
        DemoMaterialModule,
        NgSelectModule,
        CommonComponentsModule,
        PlaylistModule
    ]
})
export class PublicacionModule {
}

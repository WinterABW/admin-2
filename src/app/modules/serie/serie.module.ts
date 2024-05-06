import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SerieListComponent } from './serie-list/serie-list.component';
import { SerieRoutingModule } from './serie-routing.module';

import { SerieAddComponent } from './serie-add/serie-add.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SerieEditComponent } from './serie-edit/serie-edit.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SerieBottomSheetComponent } from './serie-bottom-sheet/serie-bottom-sheet.component';

import { PublicacionModule } from "../publicacion/publicacion.module";
import { CommonComponentsModule } from 'src/app/common/common-components.module';
import { DemoMaterialModule } from 'src/app/demo-material-module';


@NgModule({
    declarations: [SerieListComponent, SerieAddComponent, SerieEditComponent, SerieBottomSheetComponent],
    imports: [
        CommonModule,
        SerieRoutingModule,
        DemoMaterialModule,
        ReactiveFormsModule,
        NgSelectModule,
        CommonComponentsModule,
        PublicacionModule
    ],
    exports: []
})
export class SerieModule { }

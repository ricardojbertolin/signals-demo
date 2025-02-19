import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { LightColor } from '../../app.definitions';
import { JunctionControllerService } from '../../services/junction-controller.service';

@Component({
    selector: 'app-force-selector',
    imports: [
        ReactiveFormsModule,
        MatIcon,
        MatMiniFabButton,
        AsyncPipe
    ],
    templateUrl: './force-selector.component.html',
    styleUrls: [
        '../shared/force-styles.scss',
        './force-selector.component.scss'
    ]
})
export class ForceSelectorComponent {
    readonly lightColors = LightColor;
    readonly junctionControllerService = inject(JunctionControllerService);

    forceLightColor(lightColor: LightColor) {
        this.junctionControllerService.forceLightColor(lightColor);
    }
}

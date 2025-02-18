import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LightColor } from '../../app.definitions';
import { JunctionControllerService } from '../../services/junction-controller.service';

@Component({
    selector: 'app-force-selector',
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './force-selector.component.html',
    styleUrl: './force-selector.component.scss'
})
export class ForceSelectorComponent {
    readonly forcedFormControl = new FormControl<LightColor>(LightColor.Red);
    readonly lightColors = LightColor;
    private readonly junctionControllerService = inject(JunctionControllerService);

    forceLightColor() {
        this.junctionControllerService.forceLightColor(this.forcedFormControl.value!);
    }
}

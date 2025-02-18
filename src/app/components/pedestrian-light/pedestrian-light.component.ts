import { Component, input } from '@angular/core';
import { LightColor } from '../../app.definitions';

@Component({
    selector: 'app-pedestrian-light',
    imports: [],
    templateUrl: './pedestrian-light.component.html',
    styleUrl: './pedestrian-light.component.scss'
})
export class PedestrianLightComponent {

    lightColor = input(LightColor.Red);
    readonly LightColor = LightColor;

}

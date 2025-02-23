import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LightColor } from '../../app.definitions';

@Component({
    selector: 'app-notifications-area',
    templateUrl: 'notifications-area.component.html',
    styleUrl: 'notifications-area.component.scss',
    imports: [
        TitleCasePipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsAreaComponent {
    statusText = input('');
    controllerLightColor = input<LightColor | null>(null);
    requestsText = input('');
}

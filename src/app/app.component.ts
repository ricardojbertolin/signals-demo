import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { JunctionComponent } from './components/junction/junction.component';
import { JunctionControllerService } from './services/junction-controller.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    imports: [
        JunctionComponent,
        AsyncPipe
    ],
    providers: [JunctionControllerService],
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    readonly junctionControllerService = inject(JunctionControllerService);
}

import { LightColor } from '../../app.definitions';

export const getRequestsText = (pedestrianRequest: boolean, pedestrianRequestStarted: boolean) =>
    (pedestrianRequest && !pedestrianRequestStarted) ? 'Pedestrian green light requested' : '';

export const getStatusText = (pedestrianRequestStarted: boolean) =>
    pedestrianRequestStarted ? 'Pedestrian light is green' : 'Controller light';

export const getPedestrianLightColor = (pedestrianRequestStarted: boolean) =>
    pedestrianRequestStarted ? LightColor.Green : LightColor.Red;

export const getTrafficLightColor = (pedestrianRequestStarted: boolean, controllerLightColor: LightColor) =>
    pedestrianRequestStarted ? LightColor.Red : controllerLightColor;

export const pedestrianStageShouldBeStarted = (pedestrianRequestStarted: boolean, pedestrianRequest: boolean, controllerLightColor: LightColor) =>
    !pedestrianRequestStarted && pedestrianRequest && controllerLightColor === LightColor.Red;

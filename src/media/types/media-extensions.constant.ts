import { MediaAcceptableMimeTypes } from "./media-acceptable-mime-type.enum";

export const mediaExtensions = new Map();
mediaExtensions.set(MediaAcceptableMimeTypes.png, '.png');
mediaExtensions.set(MediaAcceptableMimeTypes.jpg, '.jpg');
mediaExtensions.set(MediaAcceptableMimeTypes.jpeg, '.jpeg');

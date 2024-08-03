import { EventEmitterModuleOptions } from "@nestjs/event-emitter/dist/interfaces";

export const eventEmitterConfig: EventEmitterModuleOptions = {
  delimiter: '.',
  newListener: false,
  removeListener: false,
  maxListeners: 20,
  ignoreErrors: false,
};
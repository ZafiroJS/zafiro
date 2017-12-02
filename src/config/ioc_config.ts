import { ContainerModule } from "inversify";
import { ZAFIRO_TYPE } from "../constants/types";
import * as interfaces from "../interfaces";
import Logger from "../logging/logger";

export const coreBindings = new ContainerModule((bind) => {

    bind<interfaces.Logger>(ZAFIRO_TYPE.Logger)
        .to(Logger)
        .inRequestScope();

});

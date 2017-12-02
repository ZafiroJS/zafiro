import { interfaces } from "inversify-express-utils";
import Principal from "./principal";

export function principalFactory(userDetails?: any): Promise<interfaces.Principal> {
    return Promise.resolve<interfaces.Principal>(new Principal(
        userDetails ? userDetails : null,
        this
    ));
}

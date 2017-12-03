# Configuration

The `createApp` function takes a configuration object that can be used to configure your application:

- The `database` property allows you to select the database server to be used. Please refer to TypeORM to learn more about the supported databases.
- The `dbLogging` **[Optional]** property allows you enable databade logging.
- The `containerModules` **[Optional]** property allows you to declare the dependency injection bindings using an array of InversifyJS `ContainerModule`.
- The `dir` **[Optional]** property allows you to customize the root directory of your application. This directory is expected to contain the `controllers` and `entities` directories.
- The `container` **[Optional]** property allows you to provide a custom InversifyJS `Container` instance.
- The `customRouter` **[Optional]** property allows you to provide a custom Express `Router` instance.
- The `routingConfig` **[Optional]** property allows you to provide a custom inversify-express-utils `RoutingConfig`.
- The `customApp` **[Optional]** property allows you to provide a custom Express application instance.
- The `AccountRepository` **[Optional]** property allows you to provide a custom `AccountRepository`.
- The `expressConfig` **[Optional]** property is a function `(app: express.Application) => void` that can be used to set some Express config.

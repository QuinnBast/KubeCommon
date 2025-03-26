# ChronosConf

ChronosConf allows you to map local Configuration data types, to be provided through a dynamic web interface for users of the application.
This allows operators and users to modify the config on the fly, and have that config dynamically fed back into your application.

## Registering Configuration Files

By default, the server will not know about any configuration files and will not provide any by default.

It is likely that you want to map a custom configuration data type, for example `ApplicationConfig`, and have that get provided to your app.
In order to expose your configuration, register the default files that should be provided through the `ConfigurationMapper` object.

First, set up your configuration object to be serializable:
```kotlin
@Serializable
data class ApplicationConfiguration(
    private val someField: String,
    private val someOtherField: Int,
)

```

Finally, register your configuration file to be serialized by your class:

```kt
// Register the config file
configMapper.registerConfig("application-config.yaml", ApplicationConfiguration.serializer())

// Start the server with the provided config
LocalConfigProviderMain(configMapper).runApplication()
```

# Configuration

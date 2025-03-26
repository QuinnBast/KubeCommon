import io.gitlab.arturbosch.detekt.Detekt
import io.gitlab.arturbosch.detekt.extensions.DetektExtension
import org.jetbrains.dokka.DokkaConfiguration
import org.jetbrains.dokka.gradle.DokkaTaskPartial
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.jlleitschuh.gradle.ktlint.KtlintExtension

plugins {
    id(Plugins.KOTLIN_JVM) version Versions.KOTLIN // needs to be applied here and to the subprojects block to resolve the implementation function
    id(Plugins.KOTLIN_SERIALIZATION) version Versions.KOTLIN
    id(Plugins.KTLINT) version Versions.KTLINT_PLUGIN apply false
    jacoco
    id(Plugins.DETEKT) version Versions.DETEKT
    id(Plugins.JACOCOLOG) version Versions.JACOCOLOG
    id(Plugins.DEPENDENCY_LICENSE_REPORT) version Versions.DEPENDENCY_LICENSE_REPORT
    id(Plugins.DOKKA) version Versions.DOKKA
}

repositories {
    mavenCentral()
}

val viewReports =
    task("viewReports") {
        dependsOn(tasks.test)
        doLast {
            fun browse(path: File) {
                val operatingSystem = org.gradle.internal.os.OperatingSystem.current()
                if (operatingSystem.isWindows) {
                    exec { commandLine("cmd", "/c", "start $path") }
                } else if (operatingSystem.isMacOsX) {
                    exec { commandLine("open", "$path") }
                } else if (operatingSystem.isLinux || operatingSystem.isUnix) {
                    exec { commandLine("xdg-open", "$path") }
                }
            }

            browse(project.file("build/reports/jacoco/jacocoAggregatedReport/html/index.html"))
            browse(project.file("build/reports/detekt.html"))
        }
    }

tasks {
    test {
        finalizedBy(jacocoAggregatedReport)
    }
    build {
        dependsOn(generateLicenseReport)
    }
}

configure<JacocoPluginExtension> {
    toolVersion = Versions.JACOCO
}

configure<DetektExtension> {
    toolVersion = Versions.DETEKT
    config = files("${rootProject.projectDir}/detekt-config.yml")
    buildUponDefaultConfig = true
    source = files(rootDir)
    parallel = true
}

tasks.withType<Detekt>().configureEach {
    exclude("**/build/**") // exclude all generated files in the build directories
    exclude("**/testutils/data/**")
    exclude("**/integrationTest/**")
    reports {
        xml.required.set(true)
        xml.outputLocation.set(file("$buildDir/reports/detekt.xml"))

        html.required.set(true)
        html.outputLocation.set(file("$buildDir/reports/detekt.html"))

        txt.required.set(true)
        txt.outputLocation.set(file("$buildDir/reports/detekt.txt"))

        custom {
            reportId = "JsonReport"
            outputLocation.set(file("$buildDir/reports/detekt.json"))
        }
    }
}

subprojects {
    apply(plugin = Plugins.KOTLIN_JVM)
    apply(plugin = Plugins.KOTLIN_SERIALIZATION)
    apply(plugin = "jacoco")
    apply(plugin = Plugins.KTLINT)
    apply(plugin = "java-test-fixtures")
    apply(plugin = "jvm-test-suite")
    apply(plugin = Plugins.DOKKA)

    repositories {
        mavenCentral()
    }

    testing {
        suites {
            // configure the existing test configuration
            val test by getting(JvmTestSuite::class) {
                useJUnitJupiter()
                targets {
                    all {
                        testTask.configure {
                            finalizedBy(tasks.named<JacocoReport>("jacocoTestReport")) // report is always generated after tests run
                        }
                    }
                }
            }

            val integrationTest by registering(JvmTestSuite::class) {
                useJUnitJupiter()
                dependencies {
                    implementation(project)
                }
            }
        }
    }

    dependencies {
        implementation(kotlin("stdlib-jdk8"))
        implementation(kotlin("reflect"))

        implementation(Dependencies.COROUTINES_CORE)
        implementation(Dependencies.SERIALIZATION_CORE)
        implementation(Dependencies.SLF4J_API)

        testImplementation(Dependencies.COROUTINES_TEST)
        testImplementation(platform(Dependencies.JUNIT_BOM))
        testImplementation(Dependencies.JUNIT_JUPITER)
    }

    configure<JacocoPluginExtension> {
        toolVersion = Versions.JACOCO
        reportsDirectory.set(file("$buildDir/reports/jacoco"))
    }

    configure<KtlintExtension> {
        version.set(Versions.KTLINT)
        disabledRules.set(setOf("experimental:enum-entry-name-case", "experimental:trailing-comma", "experimental:argument-list-wrapping"))
        enableExperimentalRules.set(true)
        filter {
            exclude { projectDir.toURI().relativize(it.file.toURI()).path.contains("/generated/") }
        }
    }

    tasks {
        jacocoTestReport {
            reports {
                xml.required.set(true)
                xml.outputLocation.set(file("$buildDir/reports/jacoco/jacoco.xml"))
                csv.required.set(false)
            }
            dependsOn(test) // tests are required to run before generating the report

            excludeFilesFromJacocoReport(
                this,
                project,
                listOf(),
            )
        }

        compileJava {
            options.release.set(Versions.JVM)
        }

        compileKotlin {
            findByName("compileIntegrationTestKotlin")?.let { task ->
                finalizedBy(task)
            }
        }

        withType<KotlinCompile>().configureEach {
            kotlinOptions {
                jvmTarget = "${Versions.JVM}"
                allWarningsAsErrors = false
            }
        }
    }
}

/*
The task :jacocoAggregatedReport executes the :jacocoTestReport task for each subproject (which is being
configured here in this block) and then calls the task :jacocoMergeSubprojects to collect the aggregated
results. My efforts to configure :jacocoAggregatedReport did not discover an interface for excluding
subprojects from the aggregated report, so I've had to revert to this ugly workaround that excludes
the built classes by using exclude patterns (https://stackoverflow.com/questions/29887805/filter-jacoco-coverage-reports-with-gradle)

This has limitations including hardcoded package paths (in its present form - there might be a way around
that with more effort), and the inability to generate separate reports that include the excluded classes here
(because the effects arise out of modifying the individual tasks).

More complicated ways of using jacoco are available that would help us work around these limitations, but
in my estimation they are not worth the effort. If that changes, this might serve as a good jumping-off
point: https://docs.gradle.org/current/samples/sample_jvm_multi_project_with_code_coverage.html

(JD)
*/
fun excludeFilesFromJacocoReport(
    jacocoReport: JacocoReport,
    project: Project,
    excludeFiles: List<String>,
) {
    jacocoReport.classDirectories.setFrom(
        project.files(
            jacocoReport.classDirectories.files.map {
                project.fileTree(it) {
                    // more detail on exclude patterns: https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/util/PatternFilterable.html
                    excludes.addAll(excludeFiles)
                }
            },
        ),
    )
}

/**
 * This task is for building HTML documentation from our kotlin source code.
 * To invoke it, run `./gradlew dokkaHtmlMultiModule`
 * This configuration block goes into each subproject (tcp proxy, sftp proxy, etc.) and configures
 * the "dokkaHtmlPartial" task for that subproject.
 * The "dokkaHtmlPartial" tasks are all dependencies for "dokkaHtmlMultiModule", and so they are all
 * invoked when the multi-module HTML task is run.
 * This particular configuration tells dokka to include both the main source code and the tests,
 * and to include functions with every level of visibility.
 */
subprojects {
    tasks.withType<DokkaTaskPartial>().configureEach {
        dokkaSourceSets {
            configureEach {
                sourceRoots.from(file("src/test/kotlin"))
                sourceRoots.from(file("src/integrationTest/kotlin"))
                sourceRoots.from(file("src/main/kotlin"))
                documentedVisibilities.set(
                    setOf(
                        DokkaConfiguration.Visibility.PUBLIC,
                        DokkaConfiguration.Visibility.PACKAGE,
                    ),
                )
            }
        }
    }
}

java {
    withSourcesJar()
}

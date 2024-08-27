import fs from 'fs';
import path from 'path';
import { Reporter, FullConfig, Suite } from '@playwright/test/reporter';
import { parseString, Builder } from 'xml2js';

class CustomReporter implements Reporter {
    private baseURL: string | undefined;

    onBegin(config: FullConfig, suite: Suite) {
        const projectConfig = config.projects.find(project => project.name === 'chromeMobile');
        if (projectConfig && projectConfig.use) {
            this.baseURL = projectConfig.use.baseURL as string;
        }
    }

    async onEnd() {
        if (!this.baseURL) {
            console.warn('Base URL not found, skipping baseURL addition.');
            return;
        }

        const xmlFilePath = path.resolve('./reports/junit.xml');

        if (fs.existsSync(xmlFilePath)) {
            const xmlContent = fs.readFileSync(xmlFilePath, 'utf-8');

            parseString(xmlContent, (err, result) => {
                if (err) {
                    console.error('Error parsing XML:', err);
                    return;
                }

                if (result && result.testsuites && result.testsuites.testsuite) {
                    for (const suite of result.testsuites.testsuite) {
                        if (suite.testcase) {
                            for (const testcase of suite.testcase) {
                                // Add the baseURL attribute to each testcase element
                                testcase.$.baseURL = this.baseURL;
                            }
                        }
                    }

                    const builder = new Builder({ headless: true, xmldec: { version: '1.0', encoding: 'UTF-8', standalone: true } });
                    const updatedXML = builder.buildObject(result);

                    fs.writeFileSync(xmlFilePath, updatedXML, 'utf-8');
                    console.log('Updated XML report with baseURL:', this.baseURL);
                }
            });
        } else {
            console.warn('XML report not found, skipping baseURL addition.');
        }
    }
}

export default CustomReporter;

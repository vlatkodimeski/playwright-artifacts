import fs from 'fs';
import path from 'path';
import { Reporter, FullResult, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import { parseString, Builder } from 'xml2js';
import { FullConfig } from '@playwright/test';

class CustomReporter implements Reporter {
    private baseURL: string | undefined;

    // Fetch the baseURL from the configuration when the tests start
    onBegin(config: FullConfig, suite: Suite) {
        const projectConfig = config.projects.find(project => project.name === 'chromeMobile');
        if (projectConfig && projectConfig.use) {
            this.baseURL = projectConfig.use.baseURL as string;
        }
    }

    // Modify the XML report after the tests are completed
    async onEnd(result: FullResult) {
        if (!this.baseURL) {
            console.warn('Base URL not found, skipping baseURL addition.');
            return;
        }

        // Define the path to the existing XML report generated by Playwright
        const xmlFilePath = path.resolve('./reports/junit.xml');

        if (fs.existsSync(xmlFilePath)) {
            const xmlContent = fs.readFileSync(xmlFilePath, 'utf-8');

            parseString(xmlContent, (err, result) => {
                if (err) {
                    console.error('Error parsing XML:', err);
                    return;
                }

                // Modify the XML to include the baseURL attribute for all <testsuite> elements
                if (result && result.testsuites && result.testsuites.testsuite) {
                    for (const suite of result.testsuites.testsuite) {
                        // Add the baseURL attribute
                        suite.$.baseURL = this.baseURL;
                    }

                    // Convert the modified JSON back to XML
                    const builder = new Builder({ headless: true, xmldec: { version: '1.0', encoding: 'UTF-8', standalone: true } });
                    const updatedXML = builder.buildObject(result);

                    // Write the updated XML back to the file
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

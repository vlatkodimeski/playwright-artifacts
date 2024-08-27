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
                        suite.$.baseURL = this.baseURL;

                        if (suite.testcase && suite.testcase[0] && suite.testcase[0].failure) {
                            const failure = suite.testcase[0].failure[0];
                            const cdataContent = `  [chromeMobile] › ${suite.$.name} › ${suite.testcase[0].$.name} ──────────────────────────────\n\n    Test timeout of 30000ms exceeded.\n\n    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────\n    test-results\\ui-ui-fixture-Player-can-register-chromeMobile\\test-failed-1.png\n    ────────────────────────────────────────────────────────────────────────────────────────────────\n\n    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────\n    test-results\\ui-ui-fixture-Player-can-register-chromeMobile\\trace.zip\n    Usage:\n\n        npx playwright show-trace test-results\\ui-ui-fixture-Player-can-register-chromeMobile\\trace.zip\n\n    ────────────────────────────────────────────────────────────────────────────────────────────────\n`;
                            failure._ = `<![CDATA[${cdataContent}]]>`;
                        }
                    }

                    const builder = new Builder({ headless: true, xmldec: { version: '1.0', encoding: 'UTF-8', standalone: true } });
                    const updatedXML = builder.buildObject(result);

                    fs.writeFileSync(xmlFilePath, updatedXML, 'utf-8');
                    console.log('Updated XML report with baseURL and properly formatted CDATA content:', this.baseURL);
                }
            });
        } else {
            console.warn('XML report not found, skipping baseURL addition.');
        }
    }
}

export default CustomReporter;

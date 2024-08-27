import { Reporter, TestResult, TestCase, FullResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';
import { parseStringPromise, Builder } from 'xml2js';

class CustomXMLReporter implements Reporter {
    private results: string[] = [];
    private reportPath = path.join(process.cwd(), 'reports', 'junit.xml');
    private baseURL: string = 'unknown';

    async onTestEnd(test: TestCase, result: TestResult) {
        console.log(`Test ended: ${test.title}, status: ${result.status}`);

        // Update baseURL if needed
        this.baseURL = test.parent?.project()?.use?.baseURL || this.baseURL;

        const errorMessage = result.errors.map(error => error.message).join('\n');
        const testResultXML = result.status === 'failed'
            ? `<testcase name="${test.title}" classname="${test.parent?.title || 'unknown'}" time="${result.duration / 1000}">
                    <failure message="${errorMessage}" type="FAILURE">
                        <![CDATA[
    [chromeMobile] › ${test.title} ──────────────────────────────

    ${errorMessage}

    attachment #1: screenshot (image/png)
    test-results/${test.title.replace(/\s+/g, '-')}-chromeMobile/test-failed-1.png

    attachment #2: trace (application/zip)
    test-results/${test.title.replace(/\s+/g, '-')}-chromeMobile/trace.zip
                        ]]>
                    </failure>
                </testcase>`
            : `<testcase name="${test.title}" classname="${test.parent?.title || 'unknown'}" time="${result.duration / 1000}" />`;

        this.results.push(testResultXML);
    }

    async onEnd(result: FullResult) {
        console.log('Appending to XML report...');  // Verify execution

        let xmlData: any = { testsuites: {} };

        // Read the existing XML file
        if (fs.existsSync(this.reportPath)) {
            const xmlContent = fs.readFileSync(this.reportPath, 'utf-8');
            xmlData = await parseStringPromise(xmlContent);
        }

        // Ensure testsuites and testsuite exist
        const testsuites = xmlData.testsuites || {};
        let testsuite = (testsuites.testsuite || [])[0] || {};

        // Update the baseURL in testsuite
        testsuite.$ = { ...testsuite.$, baseURL: this.baseURL };

        // Append new test cases
        testsuite.testcase = [...(testsuite.testcase || []), ...this.results];

        // Build the updated XML content
        const updatedXML = new Builder({ headless: true, xmldec: { version: '1.0', encoding: 'UTF-8' } }).buildObject({
            testsuites: { ...testsuites, testsuite: [testsuite] }
        });

        // Write the updated XML back to the file
        fs.writeFileSync(this.reportPath, updatedXML);
        console.log(`XML report updated at ${this.reportPath}`);
    }
}

export default CustomXMLReporter;

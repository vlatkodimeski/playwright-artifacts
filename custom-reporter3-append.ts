import { Reporter, TestResult, TestCase, FullResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';
import { parseStringPromise, Builder } from 'xml2js';

class CustomXMLReporter implements Reporter {
    private results: string[] = [];
    private reportPath = path.join(process.cwd(), 'reports', 'junit.xml');

    async onTestEnd(test: TestCase, result: TestResult) {
        console.log(`Test ended: ${test.title}, status: ${result.status}`);
    
        const baseURL = test.parent?.project()?.use?.baseURL || 'unknown';
    
        const errorMessage = result.errors.map(error => error.message).join('\n');
        const testResultXML = result.status === 'failed' 
            ? `<testcase name="${test.title}" baseURL="${baseURL}">
                    <failure>${errorMessage}</failure>
                </testcase>`
            : `<testcase name="${test.title}" baseURL="${baseURL}" />`;

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

        // Ensure the testsuites and testsuite structure exists
        const testsuites = xmlData.testsuites || {};
        const testsuite = testsuites.testsuite || [];

        // Append new test cases
        testsuite[0] = {
            ...testsuite[0],
            testcase: (testsuite[0]?.testcase || []).concat(this.results)
        };

        // Build the updated XML content
        const updatedXML = new Builder({ headless: true }).buildObject({ testsuites: { ...xmlData.testsuites, testsuite } });

        // Write the updated XML back to the file
        fs.writeFileSync(this.reportPath, updatedXML);
        console.log(`XML report updated at ${this.reportPath}`);
    }
}

export default CustomXMLReporter;

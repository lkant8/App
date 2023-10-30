import Config from '../../../tests/e2e/config';
import Routes from '../../../tests/e2e/server/routes';

type TestResult = {
    name: string;
    duration?: number;
    error?: string;
};

type TestConfig = {
    name: string;
};

const SERVER_ADDRESS = `http://localhost:${Config.SERVER_PORT}`;

/**
 * Submits a test result to the server.
 * Note: a test can have multiple test results.
 */
const submitTestResults = (testResult: TestResult): Promise<void> =>
    fetch(`${SERVER_ADDRESS}${Routes.testResults}`, {
        method: 'POST',
        headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(testResult),
    }).then((res) => {
        if (res.status === 200) {
            console.debug(`[E2E] Test result '${testResult.name}' submitted successfully`);
            return;
        }
        const errorMsg = `Test result submission failed with status code ${res.status}`;
        res.json()
            .then((responseText) => {
                throw new Error(`${errorMsg}: ${responseText}`);
            })
            .catch(() => {
                throw new Error(errorMsg);
            });
    });

const submitTestDone = () => fetch(`${SERVER_ADDRESS}${Routes.testDone}`);

const getTestConfig = (): Promise<TestConfig> =>
    fetch(`${SERVER_ADDRESS}${Routes.testConfig}`)
        .then((res: Response): Promise<TestConfig> => res.json())
        .then((config: TestConfig) => config);

export default {
    submitTestResults,
    submitTestDone,
    getTestConfig,
};

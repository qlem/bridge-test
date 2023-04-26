import * as fs from 'fs';
import { getAccounts } from './services';

const main = async () => {
  const accounts = await getAccounts();
  fs.writeFile('result.json', JSON.stringify(accounts), (err) => {
    if (err) {
      console.error('Unable to write result JSON file!');
    } else {
      console.log('Check result.json');
    }
  });
};

main().then(() => {
  /* nothing to do */
});

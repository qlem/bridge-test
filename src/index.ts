import { Accounts } from './http';

const main = async () => {
  const accounts = await Accounts();
  console.log(accounts);
};

main();

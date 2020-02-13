Skip to content
Search or jump to…

Pull requests
Issues
Marketplace
Explore
 
@vermashanti 
Learn Git and GitHub without any code!
Using the Hello World guide, you’ll start a branch, write comments, and open a pull request.


zemse
/
simple-lottery
generated from zemse/smart-solidity-template
1
00
 Code Issues 0 Pull requests 0 Actions Projects 0 Wiki Security Insights
simple-lottery/test/SimpleStorage.test.js
@zemse zemse add rollno and test cases
b85f0c6 22 minutes ago
115 lines (84 sloc)  4.36 KB
  
/*
  Author: Soham Zemse (https://github.com/zemse)
  In this file you should write tests for your smart contract as you progress in developing your smart contract. For reference of Mocha testing framework, you can check out https://devdocs.io/mocha/.
*/

/// @dev importing packages required
const assert = require('assert');
const ethers = require('ethers');
const ganache = require('ganache-cli');

/// @dev initialising development blockchain
const provider = new ethers.providers.Web3Provider(ganache.provider({ gasLimit: 8000000 }));

/// @dev importing build file
const simpleStorageJSON = require('../build/SimpleStorage_SimpleStorage.json');

/// @dev initialize global variables
let accounts, simpleStorageInstance;

/// @dev this is a test case collection
describe('Ganache Setup', async() => {

  /// @dev this is a test case. You first fetch the present state, and compare it with an expectation. If it satisfies the expectation, then test case passes else an error is thrown.
  it('initiates ganache and generates a bunch of demo accounts', async() => {

    /// @dev for example in this test case we are fetching accounts array.
    accounts = await provider.listAccounts();

    /// @dev then we have our expection that accounts array should be at least having 1 accounts
    assert.ok(accounts.length >= 1, 'atleast 2 accounts should be present in the array');
  });
});

/// @dev this is another test case collection
describe('Simple Storage Contract', () => {

  /// @dev describe under another describe is a sub test case collection
  describe('Simple Storage Setup', async() => {

    /// @dev this is first test case of this collection
    it('deploys Simple Storage contract from first account with initial storage: Hello World', async() => {

      /// @dev you create a contract factory for deploying contract. Refer to ethers.js documentation at https://docs.ethers.io/ethers.js/html/
      const SimpleStorageContractFactory = new ethers.ContractFactory(
        simpleStorageJSON.abi,
        simpleStorageJSON.evm.bytecode.object,
        provider.getSigner(accounts[0])
      );
      simpleStorageInstance =  await SimpleStorageContractFactory.deploy('hello world');

      assert.ok(simpleStorageInstance.address, 'conract address should be present');
    });

    /// @dev this is second test case of this collection
    it('value should be set properly while deploying', async() => {

      /// @dev you access the value at storage with ethers.js library of our custom contract method called getValue defined in contracts/SimpleStorage.sol
      const currentValue = await simpleStorageInstance.functions.getValue();

      /// @dev then you compare it with your expectation value
      assert.equal(
        currentValue,
        'hello world',
        'value set while deploying must be visible when get'
      );
    });
  });

  describe('Simple Storage Functionality', async() => {

    /// @dev this is first test case of this collection
    it('should change storage value to a new value', async() => {

      /// @dev you sign and submit a transaction to local blockchain (ganache) initialized on line 10.
      const tx = await simpleStorageInstance.functions.setValue('Zemse');

      /// @dev you can wait for transaction to confirm
      await tx.wait();

      /// @dev now get the value at storage
      const currentValue = await simpleStorageInstance.functions.getValue();

      /// @dev then comparing with expectation value
      assert.equal(
        currentValue,
        'Zemse',
        'value set must be able to get'
      );
    });

    it('should have initial value of rollNumber as 0', async() => {
      const output = await simpleStorageInstance.functions.rollNumber();

      // console.log({output});
      assert.ok(output.eq(0), 'rollNumber should be equal to 0 as it is not initialised yet');
    });

    it('when update function is called, rollNumber storage should be updated', async() => {
      const newRollNo = 345;

      const rollNumberBefore = await simpleStorageInstance.functions.rollNumber();
      console.log({rollNumberBefore});

      const tx = await simpleStorageInstance.functions.updateRollNumber(newRollNo);
      await tx.wait();

      const rollNumberAfter = await simpleStorageInstance.functions.rollNumber();
      console.log({rollNumberAfter});

      assert.ok(rollNumberAfter.eq(newRollNo), 'rollNumber storage should be updated with new value');

    });
  });
});
© 2020 GitHub, Inc.
Terms
Privacy
Security
Status
Help
Contact GitHub
Pricing
API
Training
Blog
About

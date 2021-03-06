require('./src/init');

const program = require('commander');
const chalk = require('chalk');

const confirmAppName = require('./src/confirmAppName');
const createNew = require('./src/createNew');
const utils = require('./src/utils');

program
  .option('-C, --confirmAppName', 'Confirm appName without interactive prompt')
  .option(
    '-t, --template <template>',
    'Specify a template by id. Current choices: grove-react-template, grove-vue-template'
  )
  .option(
    '-r, --templateRelease <templateRelease>',
    'Use a specific version of the template, if available'
  )
  .option(
    '-g, --git <gitOption>',
    'By default, the cli will initialize a new git repo with an initial commit, unless you are generating within an existing git or mercurial repo. Specify "false" to prevent this. Specify "keep" to maintain upstream git remotes pointing to Grove core repos.'
  )
  .parse(process.argv);

confirmAppName(program)
  .then(mlAppName => {
    const config = { mlAppName };
    return createNew({ config, program });
  })
  .then(function(config) {
    console.log(
      chalk.green(
        '\nCongratulations, you successfully generated a new Grove project.'
      )
    );

    console.log(chalk.cyan('\nNow you can view your new Grove Project:'));
    console.log('\n    cd ' + config.mlAppName);

    console.log(
      chalk.cyan(
        '\nYou may need to configure some application settings, such as hosts and port:'
      )
    );
    console.log('\n    grove config');

    console.log(
      chalk.cyan(
        '\nYou might already have a MarkLogic database, user, and REST server. Otherwise, you can invoke ml-gradle to deploy the MarkLogic config found in the `/marklogic` directory:'
      )
    );
    console.log('\n    cd marklogic');
    console.log('    ' + utils.gradleExecutable() + ' mlDeploy');
    console.log('    cd ..');
    console.log(
      '\nSee https://github.com/marklogic-community/ml-gradle for other tasks and details.'
    );

    console.log(
      chalk.cyan('\nRun the following to install javascript dependencies:')
    );
    console.log('\n    npm install');

    console.log(
      chalk.cyan(
        '\nYou can also start your application if you wish, though you will need a MarkLogic REST server running on the configured host and port (see above on using ml-gradle).'
      )
    );
    console.log('\n    npm start');

    console.log(
      chalk.cyan(
        '\nLog into your application using any MarkLogic user with sufficient permissions.\n'
      )
    );

    process.exit();
  })
  .catch(utils.handleError);

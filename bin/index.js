#!/usr/bin/env node

const program = require('commander');
const fse = require('fs-extra');
const extfs = require('extfs')
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const hidefile = require('hidefile');
const os = require('os');

let version = '1.2.0'

function save_load_boilerplate(src, dest) {
	fse.copy(src, dest)
		.then(() => {
			console.log(chalk.blue(`\n  Copied contents of ${src} to ${dest}`));
		})
		.catch((err) => {
			console.error(err);
		})
}

let boilerplate_dir = path.resolve(os.homedir(), './.boilerplates');

fse.ensureDir(boilerplate_dir)
	.catch(err => {
		console.error(err)
	})

hidefile.isHidden(boilerplate_dir, (err, result) => {
	if (err) {
		console.error(err);
	} else {
		if (!result) {
			hidefile.hide(boilerplate_dir, function(err, newpath) {
				if (err) {
					console.error(err);
				}
			});
		}
	}
});

program.version(version, '-v, --version')

program
	.command('list')
	.description('list all the currently stored boilerplates')
	.action(() => {
		extfs.getDirs(boilerplate_dir, function(err, dirs) {
			if (err) {
				console.error(error);
			} else {

				if (dirs.length > 0) {
					console.log(`\n  Boilerplates: \n`);
					for (let dir of dirs) {
						console.log(chalk.green(`   - ${dir}`));
					}
				} else {
					console.log(`\nNo currently available boilerplates. To save a boilerplate, use the ${chalk.blue('save')} ${chalk.white('command.')}`)
				}

			}
		});
	});

program
	.command('save [dir]')
	.description('store a project as a boilerplate')
	.option("-t, --title [title]", "What to store the boilerplate as")
	.action((dir, options) => {



		let src = path.resolve(dir || process.cwd());
		let title = options.title || path.resolve(src).split(path.sep).pop();
		let dest = path.resolve(boilerplate_dir, `./${title}`)




		fse.pathExists(dest)
			.then((exists) => {
				if (exists) {

					console.error(`\n${chalk.red('[!]')} The '${chalk.green(title)}' boilerplate already exists. Try changing the name of your boilerplate.\n\nIf you are changing/updating an existing boilerplate, use the ${chalk.blue('update')} ${chalk.white('command.\n\nRun')} ${chalk.blue('fibr -h')} ${chalk.white('for more info.')}`)

				} else {
					save_load_boilerplate(src, dest);
				}
			});

	});

program
	.command('new <boilerplate>')
	.alias('load')
	.description('load existing boilerplate into project')
	.option("-d, --dir [path]", "path that specifies where to load boilerplate")
	.action((boilerplate, options) => {

		let src = path.resolve(boilerplate_dir, `./${boilerplate}`);
		let dest = path.resolve(options.dir || process.cwd());

		fse.pathExists(src)
			.then((exists) => {
				if (exists) {
					extfs.isEmpty(dest, function(isEmpty) {
						if (isEmpty) {
							save_load_boilerplate(src, dest);
						} else {
							inquirer
								.prompt([{
									name: 'overwrite_confirm',
									type: 'list',
									message: `${chalk.yellow('[!]')} The destination folder is currently ${chalk.red('NOT')} empty!\n\n  Do you wish to overwrite the contents of this folder?`,
									choices: ['Yes', 'No'],
									default: 'No'

								}])
								.then(answers => {
									if (answers.overwrite_confirm === 'No') {
										console.log(chalk.blue(`\n  Overwrite of ${dest} has been successfully cancelled.`));
									} else {
										save_load_boilerplate(src, dest);
									}
								});
						}
					});
				} else {
					console.error(`\n${chalk.red('[!]')} The '${chalk.green(boilerplate)}' boilerplate doesn't exist. Check to make sure you spelled the name of the boilerplate correctly.\n\nAlso, use the ${chalk.blue('list')} ${chalk.white('command to display the available boilerplates.\n\nRun')} ${chalk.blue('fibr -h')} ${chalk.white('for more info.')}`)
				}
			});
	});

program
	.command('update <title>')
	.description('update a stored boilerplate')
	.option("-d, --dir <path>", "path to directory containing content for updating the specified boilerplate")
	.action((title, options) => {

		let src = path.resolve(options.dir || process.cwd());
		let dest = path.resolve(boilerplate_dir, `./${title}`)



		fse.pathExists(dest)
			.then((exists) => {
				if (exists) {
					inquirer
						.prompt([{
							name: 'update_confirm',
							type: 'list',
							message: `${chalk.yellow('[!]')} Are you sure you want to overwrite/update the '${chalk.green(title)}' boilerplate?\n\n  This action is ${chalk.red('NOT')} reversible.`,
							choices: ['Yes', 'No'],
							default: 'Yes'

						}])
						.then(answers => {
							if (answers.update_confirm === 'No') {
								console.log(chalk.blue(`\n  Update of ${dest} has been successfully cancelled.`));
							} else {
								save_load_boilerplate(src, dest);
							}
						});

				} else {
					console.error(`\n${chalk.red('[!]')} The '${chalk.green(title)}' boilerplate doesn't exist. Check to make sure you spelled the name of the boilerplate correctly.\n\nAlso, use the ${chalk.blue('list')} ${chalk.white('command to display the available boilerplates.\n\nRun')} ${chalk.blue('fibr -h')} ${chalk.white('for more info.')}`)

				}
			});

	});

program
	.command('remove <title>')
	.alias('rm')
	.description('delete a stored boilerplate')
	.action((title) => {

		let dest = path.resolve(boilerplate_dir, `./${title}`)

		fse.pathExists(dest)
			.then((exists) => {
				if (exists) {
					inquirer
						.prompt([{
							name: 'delete_confirm',
							type: 'list',
							message: `${chalk.yellow('[!]')} Are you sure you want to ${chalk.red('delete')} the '${chalk.green(title)}' boilerplate?\n\n  This action is ${chalk.red('NOT')} reversible.`,
							choices: ['Yes', 'No'],
							default: 'No'

						}])
						.then(answers => {
							if (answers.delete_confirm === 'No') {
								console.log(chalk.blue(`\n  Deletion of ${dest} has been successfully cancelled.`));
							} else {
								fse.remove(dest, (err) => {
									if (err) {
										console.error(err);
									} else {
										console.log(chalk.blue(`\n  Successfully deleted the ${dest} folder.`));
									}

								})
							}
						});

				} else {
					console.error(`\n${chalk.red('[!]')} The '${chalk.green(title)}' boilerplate doesn't exist. Check to make sure you spelled the name of the boilerplate correctly.\n\nAlso, use the ${chalk.blue('list')} ${chalk.white('command to display the available boilerplates.\n\nRun')} ${chalk.blue('fibr -h')} ${chalk.white('for more info.')}`)
				}
			});

	});
program.on('command:*', function() {
	console.error('\n  Invalid command: %s\n  See --help for a list of available commands.', program.args.join(' '));
	process.exit(1);
});

program.on('--help', function() {
	console.log('\n  Options:');
	console.log('    fibr save [options]:');
	console.log('      -t, --title: specifiy what to name your boilerplate.\n\t\tdefaults to project folder name.');
	console.log('    fibr new|load [options]:');
	console.log('      -d, --dir: specifiy what folder to load boilerplate into.\n\t\tdefaults to current working directory.');
	console.log('    fibr update [options]:');
	console.log('      -d, --dir: specifiy the folder that has the updated boilerplate code.\n\t\tdefaults to current working directory.');

	console.log('\n  Examples:');
	console.log('    $ fibr list');
	console.log('    $ fibr save ./ --title html5_boilerplate');
	console.log('    $ fibr new html5_boilerplate --dir ./');
	console.log('    $ fibr update html5_boilerplate --dir ./');
	console.log('    $ fibr remove html5_boilerplate');
});

if (process.argv.length > 2) {
	program.parse(process.argv);
} else {
	console.log(chalk.blue('  Fibr is a magical application that lets you save your custom boilerplates for use later on.'))
	console.log(chalk.white(`\n  Fibr version: ${version}\n  Node version: ${process.version}`));
	program.outputHelp();
}
import { $ } from "bun";
import prompts from "prompts";
import chalk from "chalk";

type BranchInfo = { name: string; lastActive: string };

// const branches = await getGitBranches();
//
// if (!branches.length) {
// 	console.log('No git branches found, exiting.');
// 	process.exit(0);
// }
//
// const selected = await prompt(branches);
//
// if (!selected.length) {
// 	console.log('No branches selected.')
// 	process.exit(0);
// }
//
// console.log(selected);

deleteGitBranches(['foo', 'bar', 'baz'])

// TODO: test in directory with no git repo
async function getGitBranches() {
	const res = await $`git branch --format='%(refname:short) %(committerdate:relative)' --sort=-committerdate`.text();

	return res
		?.split('\n')
		.map(line => {
			const [name, ...rest] = line.split(' ');
			return {
				name,
				lastActive: rest.join(' ')
			} as BranchInfo;
		})
		.filter(branch => branch.name.length)
}

async function deleteGitBranches(branches: string[]) {

	// const res = await $`git branch -D ${branches.join(' ')}`.quiet();
	const res = await $`git branch -D foo testbranch2`.quiet();

	const stdout = res.stdout.toString();
	const stderr = res.stderr.toString();

	console.log('out', stdout);
	console.log('err', stderr);
	

	// console.log(res);

	// const results = await Promise.all(branches.map(branch => {
	// 	return $`git branch -D ${branch}`;
	// }));
	//
	// let successCount = 0;
	// let errorCount = 0;
	//
	// for (const result of results) {
	// 	result.
	// }
}

async function prompt(branches: BranchInfo[]) {
    const result = await prompts([
        {
            type: "multiselect",
            name: "value",
            message: "Select branches to delete",
			choices: branches.map(branch => ({
				title: branch.name + chalk.reset.gray(` (${branch.lastActive})`),
				value: branch.name
			})),
            hint: "Use space to select and return to submit",
            instructions: false,
        },
		{
			type: (prev) => prev.length ? 'confirm' : null,
			name: 'confirm',
			message: (prev) => `Confirm deletion of ${prev.length} branches`
		}
    ]);

	return result.value as string[];
}



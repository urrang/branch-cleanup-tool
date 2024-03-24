import { exec } from 'child_process';
import prompts from 'prompts';
import chalk from 'chalk';

type BranchInfo = { name: string; lastActive: string };

// Close app on q being pressed
process.stdin.setEncoding('utf-8');
process.stdin.on('keypress', (key) => {
    if (key === 'q') {
        process.exit(0);
    }
});


const branches = await getGitBranches();
if (!branches?.length) {
    console.log('No git branches found, exiting.');
    process.exit(0);
}

const selected = await promptUser(branches);
if (!selected?.length) {
    console.log('No branches selected.');
    process.exit(0);
}

deleteGitBranches(selected);


function getGitBranches() {
    return new Promise<BranchInfo[]>((resolve) => {
        const command = `git branch --format='%(refname:short) %(committerdate:relative)' --sort=-committerdate`;

        exec(command, (_, stdout, stderr) => {
            if (stderr) {
                console.log(stderr);
                process.exit(0);
            }

            const lines = stdout?.split('\n') || [];
            const branches = lines
                .map((line) => {
                    const [name, ...rest] = line.split(' ');
                    return { name, lastActive: rest.join(' ') } as BranchInfo;
                })
                .filter((branch) => branch.name.length);

            resolve(branches);
        });
    });
}

async function deleteGitBranches(branches: string[]) {
    exec(`git branch -D ${branches.join(' ')}`, (_, stdout, stderr) => {
        if (stdout) console.log(stdout);
        if (stderr) console.log(stderr);

        process.exit(0);
    });
}

async function promptUser(branches: BranchInfo[]) {
    const result = await prompts([
        {
            type: 'multiselect',
            name: 'value',
            message: 'Select branches to delete',
            choices: branches.map((branch) => ({
                title:
                    branch.name + chalk.reset.gray(` (${branch.lastActive})`),
                value: branch.name,
            })),
            hint: 'Use space to select and return to submit',
            instructions: false,
        },
        {
            type: (prev) => (prev.length ? 'confirm' : null),
            name: 'confirm',
            message: (prev) => `Confirm deletion of ${prev.length} branches`,
        },
    ]);

	if (result.confirm) {
		return result.value as string[];
	}
}


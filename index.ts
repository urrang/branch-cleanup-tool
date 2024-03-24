import prompts from "prompts";
import chalk from "chalk";

type BranchInfo = { name: string; lastActive: string };

const branches = await getGitBranches();
const selected = await prompt(branches);

console.log(selected);

async function getGitBranches() {
    return [
        { name: "main", lastActive: "10 minutes ago" },
        { name: "feature/au/some-feature", lastActive: "2 days ago" },
        { name: "rc-217", lastActive: "7 days ago" },
    ] as BranchInfo[];
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
            // choices: [
            //     {
            //         title: "main" + chalk.reset.gray(" (3 days ago)"),
            //         value: "#ff0000",
            //     },
            //     { title: "Green", value: "#00ff00" },
            //     { title: "Blue", value: "#0000ff" },
            // ],
            hint: "Use space to select and return to submit",
            instructions: false,
        },
    ]);

    return result.value;
}


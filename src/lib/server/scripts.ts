import { exec } from 'child_process';
import { loadConfig } from './config.js';

interface ScriptParam {
	name: string;
	label: string;
	type: string;
	required: boolean;
	placeholder?: string;
}

interface ScriptDef {
	id: string;
	name: string;
	description: string;
	icon: string;
	color?: string;
	command: string;
	parameters: ScriptParam[];
	timeout?: number;
	confirm?: boolean;
}

interface ScriptsConfig {
	scripts: ScriptDef[];
}

function sanitizeParam(value: string): string {
	// Remove dangerous shell characters
	return value.replace(/[;&|`$(){}[\]!#~<>]/g, '').trim();
}

export async function getScripts(): Promise<ScriptDef[]> {
	const config = await loadConfig<ScriptsConfig>('scripts');
	return config.scripts || [];
}

export async function executeScript(
	scriptId: string,
	params: Record<string, string>
): Promise<{ success: boolean; output: string; error?: string }> {
	const scripts = await getScripts();
	const script = scripts.find((s) => s.id === scriptId);

	if (!script) {
		return { success: false, output: '', error: `Script "${scriptId}" not found in whitelist` };
	}

	// Validate required params
	for (const param of script.parameters) {
		if (param.required && !params[param.name]) {
			return { success: false, output: '', error: `Missing required parameter: ${param.label}` };
		}
	}

	// Build command with sanitized params
	let command = script.command;
	for (const [key, value] of Object.entries(params)) {
		const sanitized = sanitizeParam(value);
		command += ` --${key} "${sanitized}"`;
	}

	const timeout = (script.timeout || 30) * 1000;

	return new Promise((resolve) => {
		exec(command, { timeout, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
			if (error) {
				resolve({
					success: false,
					output: stdout || '',
					error: error.message || stderr
				});
			} else {
				resolve({
					success: true,
					output: stdout || 'Script executed successfully',
					error: stderr || undefined
				});
			}
		});
	});
}

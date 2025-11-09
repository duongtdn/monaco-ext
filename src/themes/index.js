// Import all theme configuration files
import githubDark from './github-dark.json';
import githubLight from './github-light.json';
import solarizedDark from './solarized-dark.json';
import solarizedLight from './solarized-light.json';
import tealWaveLight from './tealwave-light.json';
import tealWaveDark from './tealwave-dark.json';

// Export theme configurations as an array of [name, config] pairs
// This format matches what MonacoEditor.loadThemes expects

const themes = [
	['github-dark', githubDark],
	['github-light', githubLight],
	['solarized-dark', solarizedDark],
	['solarized-light', solarizedLight],
	['tealwave-light', tealWaveLight],
	['tealwave-dark', tealWaveDark],
];

export default themes;
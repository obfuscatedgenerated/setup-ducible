const core = require("@actions/core");
const tc = require("@actions/tool-cache");

function isSemver(version) {
    return (new RegExp(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gm)).test(version);
}

function getDownloadURL(version) {
    if (!isSemver(version)) {
        throw new Error(`Invalid version: ${version}`);
    }

    return `https://github.com/jasonwhite/ducible/releases/download/${version}/ducible-windows-x64-Release.zip`
}

async function setup() {
    if (process.platform !== "win32") {
        core.setFailed("This action only supports Windows.");
        return;
    }

    // Get version of tool to be installed
    const version = core.getInput("version");

    // Download the specific version of the tool, e.g. as a tarball
    const pathToTarball = await tc.downloadTool(getDownloadURL(version));

    // Extract the tarball onto the runner
    const pathToCLI = await tc.extractTar(pathToTarball);

    // Expose the tool by adding it to the PATH
    core.addPath(pathToCLI)
}

module.exports = setup
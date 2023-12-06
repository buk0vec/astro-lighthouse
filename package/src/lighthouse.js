/**
 * @type {() => import('astro').AstroIntegration}
 */
import { spawn } from "node:child_process";

export default () => ({
  name: "lighthouse",
  hooks: {
    "astro:config:setup": ({ addDevToolbarApp }) => {
      addDevToolbarApp("./src/lighthouse-toolbar.js");
    },
    "astro:server:setup": ({ server }) => {
      // TODO: error handle if lighthouse run fails for some reason
      server.ws.on("astro-dev-toolbar:lighthouse:run-lighthouse", (data) => {
        runLighthouse(
          data.url,
          () => {},
          (s) => {
            server.ws.send("astro-dev-toolbar:lighthouse:on-success", s);
          },
          data.isDesktop
        );
      });
    },
  },
});

function runLighthouse(url, onError, onSuccess, isDesktop) {
  var invoked = false;
  var proc = spawn(
    "./node_modules/.bin/lighthouse",
    [
      url,
      "--output=json",
      "--output-path=stdout",
      "--quiet",
      "--disable-full-page-screenshot",
      isDesktop ? "--preset desktop" : "---preset perf",
      "--only-categories=performance",
      '--chrome-flags="--headless"',
    ],
    {
      stdio: "pipe",
    }
  );

  let capturedStdout = "";

  proc.stdout.setEncoding("utf8");
  proc.stdout.on("data", (data) => {
    capturedStdout += data.toString();
  });

  proc.on("error", function (err) {
    if (invoked) return;
    invoked = true;
    onError(err);
  });

  proc.on("exit", function () {
    if (invoked) return;
    invoked = true;
    onSuccess(capturedStdout);
  });
}

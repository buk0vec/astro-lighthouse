export default {
  id: "lighthouse",
  name: "Lighthouse Pagespeed",
  icon: "lightbulb",
  init(canvas, eventTarget) {
    console.log('pog')
    var parser = new DOMParser();
    const w = document.createElement("astro-dev-toolbar-window");

    const title = document.createElement("h1");
    title.textContent = "Lighthouse Pagespeed";

    const buttons = document.createElement("div");
    buttons.style.display = "flex";
    buttons.style.flexDirection = "row";
    buttons.style.justifyContent = "space-around";
    buttons.style.gap = "16px";

    const content = document.createElement("div");
    content.style.overflowY = "scroll";
    content.style.display = "none";
    content.style.paddingRight = "12px";

    const back = document.createElement("button");
    back.textContent = "Back";

    const running = document.createElement("p");
    running.style.paddingTop = "4px";
    running.style.paddingBottom = "4px";
    running.style.margin = "0px";
    running.style.display = "none";

    w.appendChild(title);
    w.appendChild(buttons);
    w.appendChild(running);
    w.appendChild(content);

    canvas.appendChild(w);

    const desktopCard = document.createElement("div");
    desktopCard.style.padding = "24px";
    desktopCard.style.border = "2px solid grey";
    desktopCard.style.borderRadius = "4px";
    desktopCard.style.height = "100%";
    desktopCard.style.display = "flex";
    desktopCard.style.flexDirection = "column";
    desktopCard.style.alignItems = "center";
    desktopCard.style.gap = "2px";
    desktopCard.style.cursor = "pointer";
    desktopCard.style.border = "2px solid grey";
    desktopCard.style.transition = "background-color 0.3s ease";
    desktopCard.onmouseover = function () {
      this.style.backgroundColor = "grey";
    };
    desktopCard.onmouseout = function () {
      this.style.backgroundColor = "";
    };

    const desktopText = document.createElement("p");
    desktopText.textContent = "Run on Desktop";

    const desktopSvg = parser.parseFromString(desktopIcon, "image/svg+xml")
      .childNodes[0];

    desktopCard.appendChild(desktopSvg);
    desktopCard.appendChild(desktopText);

    const mobileCard = document.createElement("div");
    mobileCard.style.padding = "24px";
    mobileCard.style.borderRadius = "4px";
    mobileCard.style.height = "100%";
    mobileCard.style.border = "2px solid grey";
    mobileCard.style.display = "flex";
    mobileCard.style.flexDirection = "column";
    mobileCard.style.alignItems = "center";
    mobileCard.style.gap = "2px";
    mobileCard.style.cursor = "pointer";

    mobileCard.style.border = "2px solid grey";
    mobileCard.style.transition = "background-color 0.3s ease";
    mobileCard.onmouseover = function () {
      this.style.backgroundColor = "grey";
    };
    mobileCard.onmouseout = function () {
      this.style.backgroundColor = "";
    };

    const mobileText = document.createElement("p");
    mobileText.textContent = "Run on Mobile";

    const mobileSvg = parser.parseFromString(mobileIcon, "image/svg+xml")
      .childNodes[0];

    mobileCard.appendChild(mobileSvg);
    mobileCard.appendChild(mobileText);

    desktopCard.addEventListener("click", () => {
      buttons.style.display = "none";
      running.style.display = "block";
      running.textContent = "Running lighthouse audits...";
      if (import.meta.hot) {
        import.meta.hot.send("astro-dev-toolbar:lighthouse:run-lighthouse", {
          url: document.location.href,
          isDesktop: true,
        });
      }
    });

    mobileCard.addEventListener("click", () => {
      buttons.style.display = "none";
      running.style.display = "block";
      running.textContent = "Running lighthouse audits...";

      if (import.meta.hot) {
        import.meta.hot.send("astro-dev-toolbar:lighthouse:run-lighthouse", {
          url: document.location.href,
          isDesktop: false,
        });
      }
    });

    back.addEventListener("click", () => {
      buttons.style.display = "flex";
      while (content.firstChild) {
        content.removeChild(content.firstChild);
      }
      content.style.display = "none";
      running.style.display = "none";
    });

    buttons.appendChild(desktopCard);
    buttons.appendChild(mobileCard);

    import.meta.hot.on("astro-dev-toolbar:lighthouse:on-success", (event) => {
      content.style.display = "block";
      content.append(back);

      let data = JSON.parse(event);
      running.textContent =
        "Report for " +
        data.finalDisplayedUrl +
        " generated at " +
        data.fetchTime;

      function createProgressBar(value) {
        let container = document.createElement("div");
        let bar = document.createElement("div");
        bar.style.width = "100%";
        bar.style.height = "20px";
        bar.style.backgroundColor = "#ddd";
        bar.style.borderRadius = "10px";

        let headerDiv = document.createElement("div");
        headerDiv.style.display = "flex";
        headerDiv.style.flexDirection = "row";
        headerDiv.style.justifyContent = "space-between";
        headerDiv.style.alignItems = "baseline";
        let title = document.createElement("h3");
        title.textContent = value.title;
        let numericValue = document.createElement("p");
        numericValue.textContent =
          value.numericValue.toFixed(1) +
          (value.numericUnit == "unitless"
            ? ""
            : " " + value.numericUnit + (value.numericValue == 1 ? "" : "s"));
        headerDiv.appendChild(title);
        headerDiv.appendChild(numericValue);
        container.appendChild(headerDiv);

        let progress = document.createElement("div");
        progress.style.height = "100%";
        progress.style.width = "0%";
        progress.style.transition = "width 2s";
        progress.style.borderRadius = "10px";

        setTimeout(() => {
          progress.style.width = value.score * 100 + "%";
        }, 0);

        if (value.score <= 0.49) {
          progress.style.backgroundColor = "red";
        } else if (value.score <= 0.89) {
          progress.style.backgroundColor = "yellow";
        } else {
          progress.style.backgroundColor = "green";
        }

        bar.appendChild(progress);
        container.appendChild(bar);
        return container;
      }
      let audits = data.audits;
      for (const key of [
        "first-contentful-paint",
        "largest-contentful-paint",
        "total-blocking-time",
        "cumulative-layout-shift",
        "speed-index",
      ]) {
        let bar = createProgressBar(audits[key]);
        content.appendChild(bar);
      }
    });
  },
};

const mobileIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="64px" height="64px" viewBox="0 0 768 1280"><rect x="0" y="0" width="768" height="1280" fill="rgba(255, 255, 255, 0)" /><path fill="currentColor" d="M464 1152q0-33-23.5-56.5T384 1072t-56.5 23.5T304 1152t23.5 56.5T384 1232t56.5-23.5T464 1152zm208-160V288q0-13-9.5-22.5T640 256H128q-13 0-22.5 9.5T96 288v704q0 13 9.5 22.5t22.5 9.5h512q13 0 22.5-9.5T672 992zM480 144q0-16-16-16H304q-16 0-16 16t16 16h160q16 0 16-16zm288-16v1024q0 52-38 90t-90 38H128q-52 0-90-38t-38-90V128q0-52 38-90t90-38h512q52 0 90 38t38 90z"/></svg>';
const desktopIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="64px" height="64px" viewBox="0 0 24 24"><rect x="0" y="0" width="24" height="24" fill="none" stroke="none" /><path fill="currentColor" d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>';

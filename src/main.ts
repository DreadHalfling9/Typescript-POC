import "./style.css";

type OutputItem = {
  text: string;
  checked: boolean;
};

const inputBox = document.getElementById("inputBox")! as HTMLInputElement;
const submitBtn = document.getElementById("submitBtn")! as HTMLButtonElement;
const clear = document.getElementById("clearBtn")! as HTMLButtonElement;
const clearChecked = document.getElementById("clearCheckedBtn")! as HTMLButtonElement;
const outputContainer = document.getElementById("outputContainer") as HTMLDivElement | null;

if (outputContainer) {
  submitBtn.addEventListener("click", () => {
    const typedText = inputBox.value.trim();
    if (!typedText) return;

    const newOutput = document.createElement("div");
    newOutput.classList.add("output");
    newOutput.style.cursor = "pointer";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const textSpan = document.createElement("span");
    textSpan.innerText = ` ${typedText}`;

    newOutput.appendChild(checkbox);
    newOutput.appendChild(textSpan);

    newOutput.addEventListener("click", (event) => {
      if (event.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
        handleSave();
      }
    });

    checkbox.addEventListener("change", handleSave);

    outputContainer.appendChild(newOutput);
    inputBox.value = "";

    handleSave();
  });

  clear.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all outputs?")) {
      const elements = document.querySelectorAll(".output");
      elements.forEach((el) => el.remove());
      handleSave();
    }
  });

  clearChecked.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear checked outputs?")) {
      const outputs = document.querySelectorAll(".output");

      outputs.forEach((output) => {
        const checkbox = output.querySelector("input[type='checkbox']") as HTMLInputElement;
        if (checkbox && checkbox.checked) {
          output.remove();
        }
      });

      handleSave();
    }
  });

  function handleSave() {
    const outputs: OutputItem[] = [];
    const outputElements = document.querySelectorAll(".output");

    outputElements.forEach((output) => {
      const checkbox = output.querySelector("input[type='checkbox']") as HTMLInputElement;
      const textSpan = output.querySelector("span");

      if (checkbox && textSpan) {
        outputs.push({
          text: textSpan.innerText.trim(),
          checked: checkbox.checked,
        });
      }
    });

    localStorage.setItem("outputs", JSON.stringify(outputs));
  }

  function handleLoad() {
    const data = localStorage.getItem("outputs");
    if (!data) return;

    const outputs: OutputItem[] = JSON.parse(data);
    outputs.forEach(({ text, checked }) => {
      const newOutput = document.createElement("div");
      newOutput.classList.add("output");
      newOutput.style.cursor = "pointer";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = checked;

      const textSpan = document.createElement("span");
      textSpan.innerText = ` ${text}`;

      newOutput.appendChild(checkbox);
      newOutput.appendChild(textSpan);

      newOutput.addEventListener("click", (event) => {
        if (event.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
          handleSave();
        }
      });

      checkbox.addEventListener("change", handleSave);

      outputContainer?.appendChild(newOutput);
    });
  }

  handleLoad();
}

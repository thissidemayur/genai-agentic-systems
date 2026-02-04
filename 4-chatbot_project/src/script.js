const chatContainer = document.getElementById("chat-container");
const userInput = document.getElementById("user-input");
const button = document.getElementById("button");
const ServerURL = "http://localhost:3000";
const tokenId = Date.now().toString(36) + Math.random().toString(36)

// create loading state
function toogleLoader(show) {
  const loaderId = "loader";
  let existingLoader = document.getElementById(loaderId);

  if (show) {
    if (existingLoader) return;
    const loaderDiv = document.createElement("div");
    loaderDiv.id = loaderId;
    loaderDiv.className =
      "px-4 py-3 rounded-2xl bg-[#1f1e20] text-slate-300 w-fit mr-auto mt-4 border border-white/5 shadow-md flex items-center gap-3";

    loaderDiv.innerHTML = `
      <span class="text-sm font-medium text-slate-200">Maya is thinking</span>
      <div class="flex gap-1.5">
        <div class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:-0.3s]"></div>
        <div class="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:-0.15s]"></div>
        <div class="w-2 h-2 bg-indigo-300 rounded-full animate-bounce [animation-duration:0.8s]"></div>
      </div>
    `;
    chatContainer.appendChild(loaderDiv);
    loaderDiv.scrollIntoView({ behavior: "smooth" });
  } else {
    if (existingLoader) existingLoader.remove();
  }
}

async function showMessage(userInputData) {
  if (userInputData !== "" && userInputData) {
    // show user input in UI
    createChatDiv(userInputData);
    toogleLoader(true)
    // send userInput to server
    const llmRespData = await callToServer(userInputData);
    toogleLoader(false)
    // llm response show in ui
    if (llmRespData !== "") {
      createLlmRespDiv(llmRespData);
    }
  }
}

function enterToShowMessage() {
  userInput.addEventListener("keyup", async (e) => {
    if (e.key === "Enter") {
      const userInputData = userInput.value.trim();
      if (userInputData !== "" && userInputData) {
        showMessage(userInputData);
      }
    }
  });
}

function clickToShowMessage() {
  button.addEventListener("click", async () => {
    const userInputData = userInput.value.trim();
    if (!userInputData && userInputData !== "") {
      showMessage(userInputData);
    }
  });
}

// ************************ HELPER FUNCATION ************************

function createChatDiv(userInputData) {
  const chatDiv = document.createElement("div");
  chatDiv.className =
    "px-4 py-2 rounded-xl bg-[#292a2d] text-slate-100 w-fit ml-auto mt-2";
  chatDiv.innerText = userInputData;
  chatContainer.appendChild(chatDiv);
  userInput.value = "";
  chatDiv.scrollIntoView({ behavior: "smooth" });
}

function createLlmRespDiv(llmRespData) {
  const llmResDiv = document.createElement("div");
  ((llmResDiv.className =
    "px-4 py-2 rounded-xl  text-slate-100 w-fit mr-auto mt-2"),
    (llmResDiv.innerText = llmRespData));
  chatContainer.appendChild(llmResDiv);
  llmResDiv.scrollIntoView({ behavior: "smooth" });
}

async function callToServer(userInput) {
  try {
    const response = await fetch(`${ServerURL}/llm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userInput,
        tokenId
      }),
    });

    const result = await response.json();

    if (result.status == "ok") {
      return result.message;
    } else {
      return `Error: ${result.details}`;
    }
  } catch (error) {
    return "Failed to connect to the server.";
  }
}

// *************************** function call ***************************
enterToShowMessage();
clickToShowMessage();

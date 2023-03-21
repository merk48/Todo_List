const $ = (s) => document.querySelector(s);

const listsContainer = $(".lists");
const inputList = $("#add-list");
const clearBtn = $(".clear");

function useState(initState, onchange) {
  let state = initState;

  onchange(state);

  const getState = () => {
    return state;
  };

  const setState = (callback) => {
    state = callback(state);
    onchange(state);

    onchange(state);
  };

  return [getState, setState];
}

const initState = [
  {
    id: 1,
    name: "sport",
    filter: "",
    todos: [
      { id: 1, text: "Basketball #monday", done: false },
      { id: 2, text: "Swimming", done: true },
    ],
  },
];
const init = localStorage.data ? JSON.parse(localStorage.data) : initState;

const [getState, setState] = useState(init, (state) => {
  listsContainer.innerHTML = "";

  state.forEach(({ id, name, filter, todos }, listIndex) => {
    listsContainer.innerHTML += ` 
      <div class="list">
        <i class="delete_list" onclick="deleteList(${id}) ">✖</i>
        <span class="todos_count">0/0</span>
        <h2>${name}</h2>
        <ul class='options'>
          <li class="all_done" onclick= "allDone(${listIndex})">All Done</li>
          <li class="all_Un_done" onclick= "allUnDone(${listIndex})">All Un Done</li>
          <li class="all_Un_done" onclick= "clearTodos(${listIndex})">Clear All</li>
        </ul>
        <p class="menu" onclick =" displayOptions(${listIndex})">≣</p>
        <ul class = 'todos' id="list-${id}">
        </ul>
        <button class ="filter_btn ${
          filter.length || "hidden"
        }" id="${id}" >Clear Filter</button>
        <input class="add-todo" placeholder="Add a todo" />
      </div>
    `;
    const ul = $("#list-" + id);

    const filteredTodos = todos.filter(({ text }) => text.includes(filter));
    console.log(filteredTodos.length);
    filteredTodos.length === 0 &&
      (ul.innerHTML += `<h2>There is no todos yet...</h2>`);

    filteredTodos.forEach((todo, index) => {
      ul.innerHTML += `
        <li class="${todo.done && "done"}">
          <div class = 'todo'>
            <div class="check_box" onclick="toggleTodo(${listIndex}, ${index})"/> </div>
            ${todo.text
              .split(" ")
              .map(
                (word) =>
                  `<span  class="${word[0] === "#" && "hash"}" >${word}</span>`
              )
              .join(" ")}
          </div>
          <i class="delete_todo" onclick="deleteTodo(${listIndex},${
        todo.id
      }) ">✖<i>
        </li>
      `;
    });
  });

  document.querySelectorAll(".hash").forEach(
    (span) =>
      (span.onclick = () => {
        const listIndex = [...document.querySelectorAll(".add-todo")].findIndex(
          (ele) => ele === span.closest(".list").lastElementChild
        );
        setfilter(listIndex, span.innerText);
      })
  );

  document
    .querySelectorAll(".add-todo")
    .forEach(
      (inputTodo, index) =>
        (inputTodo.onchange = () => addTodo(index, inputTodo.value))
    );

  document
    .querySelectorAll(".filter_btn")
    .forEach(
      (clearBtn, index) => (clearBtn.onclick = () => setfilter(index, ""))
    );

  [...document.querySelectorAll(".list")].forEach((list, index) => {
    if (index % 2 === 0)
      list.style.backgroundImage =
        "linear-gradient(to top left, #39b385, #2bcd71)";
    else
      list.style.backgroundImage =
        "linear-gradient(to top left, #e52a5a, #ff585f)";
  });

  const doneTodos = state.map(
    ({ todos }) => todos.filter((todo) => todo.done).length
  );
  const totalTodos = state.map(({ todos }) => todos.length);
  document
    .querySelectorAll(".todos_count")
    .forEach(
      (todoCount, index) =>
        (todoCount.textContent = `Todos: ${doneTodos[index]}/${totalTodos[index]}`)
    );

  state.length > 0
    ? (clearBtn.style.display = "inline")
    : (clearBtn.style.display = "none");

  localStorage.data = JSON.stringify(state);
});

inputList.onchange = () => {
  addList(inputList.value);

  inputList.value = "";
};

clearBtn.onclick = () => clear();

// Functions
function addList(name) {
  const newList = {
    id: Date.now(),
    name,
    filter: "",
    todos: [],
  };
  setState((state) => [...state, newList]);
}
function addTodo(listIndex, text) {
  setState((state) => {
    state[listIndex].todos.push({ id: Date.now(), text, done: false });
    return state;
  });
}
function deleteTodo(listIndex, id) {
  setState((state) => {
    const newTodos = state[listIndex].todos.filter((todo) => todo.id !== +id);
    state[listIndex] = { ...state[listIndex], todos: newTodos };
    return state;
  });
}
function deleteList(id) {
  setState((state) => {
    state = state.filter((state) => state.id !== id);
    return state;
  });
}
function toggleTodo(listIndex, i) {
  setState((state) => {
    const filteredTodos = state[listIndex].todos.filter((todo) =>
      todo.text.includes(state[listIndex].filter)
    );
    filteredTodos[i].done = !filteredTodos[i].done;
    return state;
  });
}
function setfilter(listIndex, filter) {
  setState((state) => {
    state[listIndex] = { ...state[listIndex], filter: filter };
    return state;
  });
}
function clear() {
  setState((state) => {
    state.length = 0;
    return state;
  });
}
function allDone(listIndex) {
  setState((state) => {
    state[listIndex].todos.forEach((todo) => (todo.done = true));
    return state;
  });
}
function allUnDone(listIndex) {
  setState((state) => {
    state[listIndex].todos.forEach((todo) => (todo.done = false));
    return state;
  });
}
function clearTodos(listIndex) {
  setState((state) => {
    state[listIndex].todos.length = 0;
    return state;
  });
}
function displayOptions(listIndex) {
  document.querySelectorAll(".options")[listIndex].style.display === "block"
    ? (document.querySelectorAll(".options")[listIndex].style.display = "none")
    : (document.querySelectorAll(".options")[listIndex].style.display =
        "block");
}


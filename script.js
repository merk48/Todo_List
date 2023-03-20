const $ = (s) => document.querySelector(s);

const listsContainer = $(".lists");
const inputList = $("#add-list");

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
        <h2>${name}</h2>
        <ul id="list-${id}">
        </ul>
        <button class ="filter_btn ${
          filter.length || "hidden"
        }" id="${id}" >Clear Filter</button>
        <input class="add-todo" placeholder="Add a todo" />
      </div>
    `;

    const ul = $("#list-" + id);
    console.log(ul);

    const filteredTodos = todos.filter((todo) => todo.text.includes(filter));

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
          <i class="delete_btn" onclick="deleteTodo(${listIndex},${
        todo.id
      }) ">❌<i>
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

  document.querySelectorAll(".add-todo").forEach((inputTodo, index) => {
    inputTodo.onchange = () => addTodo(index, inputTodo.value);
    inputTodo.onfocus = () => (inputTodo.style.width = "100%");
    inputTodo.onblur = () => (inputTodo.style.width = "80px");
  });
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
        "linear-gradient(to top left, #e52a5a, #ef8aa5)";
  });

  localStorage.data = JSON.stringify(state);
});

inputList.onchange = () => {
  addList(inputList.value);

  inputList.value = "";
};

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
function toggleTodo(li, i) {
  setState((state) => {
    const filteredTodos = state[li].todos.filter((todo) =>
      todo.text.includes(state[li].filter)
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

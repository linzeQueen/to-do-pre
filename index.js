let items = [
  "Сделать проектную работу",
  "Полить цветы",
  "Пройти туториал по Реакту",
  "Сделать фронт для своего проекта",
  "Прогуляться по улице в солнечный день",
  "Помыть посуду",
];

const storageKey = "tasks";
const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");
const itemTemplate = document
  .querySelector("#to-do__item-template")
  .content.querySelector(".to-do__item");
const storageStatus = document.createElement("p");
storageStatus.setAttribute("role", "status");

function loadTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(storageKey));

    if (
      Array.isArray(savedTasks) &&
      savedTasks.every((task) => typeof task === "string")
    ) {
      return savedTasks;
    }
  } catch {
    // При ошибке чтения используем предустановленные задачи.
  }

  return items;
}

function createItem(item) {
  const clone = itemTemplate.cloneNode(true);
  const textElement = clone.querySelector(".to-do__item-text");
  const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
  const duplicateButton = clone.querySelector(
    ".to-do__item-button_type_duplicate",
  );
  const editButton = clone.querySelector(".to-do__item-button_type_edit");
  let taskText = item;

  textElement.textContent = taskText;

  deleteButton.addEventListener("click", () => {
    clone.remove();
    saveCurrentTasks();
  });

  duplicateButton.addEventListener("click", () => {
    const newItem = createItem(textElement.textContent);
    listElement.prepend(newItem);
    saveCurrentTasks();
  });

  editButton.addEventListener("click", () => {
    textElement.contentEditable = "true";
    textElement.focus();
  });

  textElement.addEventListener("blur", () => {
    const editedText = textElement.innerText
      .replace(/[\r\n]+/g, " ")
      .trim();
    taskText = editedText || taskText;
    textElement.textContent = taskText;
    textElement.contentEditable = "false";
    saveCurrentTasks();
  });

  textElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.isComposing) {
      event.preventDefault();
      editButton.focus();
    }
  });

  return clone;
}

function getTasksFromDOM() {
  const itemNameElements = listElement.querySelectorAll(".to-do__item-text");
  const tasks = [];

  itemNameElements.forEach((itemNameElement) => {
    tasks.push(itemNameElement.textContent);
  });

  return tasks;
}

function saveTasks(tasks) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
    storageStatus.remove();
  } catch {
    formElement.after(storageStatus);
    storageStatus.textContent =
      "Браузер не сохранил список. Изменения доступны до перезагрузки.";
  }
}

function saveCurrentTasks() {
  items = getTasksFromDOM();
  saveTasks(items);
}

formElement.addEventListener("submit", (event) => {
  event.preventDefault();
  const item = inputElement.value.trim();

  if (!item) {
    return;
  }

  listElement.prepend(createItem(item));
  saveCurrentTasks();
  formElement.reset();
});

items = loadTasks();
items.forEach((item) => {
  listElement.append(createItem(item));
});

const form = document.querySelector('form');
const input = document.querySelector('.task-title > input');
const option = document.querySelector('.taskStatus');
const taskList = document.querySelector('.taskOption');
let taskObj = {};
const clickRecord = [];

document.addEventListener('DOMContentLoaded', () => {
  taskObj = JSON.parse(window.localStorage.getItem('taskItems'))
    ? JSON.parse(window.localStorage.getItem('taskItems'))
    : {};
  if (taskObj && Object.getOwnPropertyNames(taskObj).length) {
    const taskStatusArray = Object.keys(taskObj);
    taskStatusArray.forEach((item, index) => {
      addBoxes(taskObj[item]);
    });
  }
});

const handleSubmit = (e) => {
  e.preventDefault();
  taskObj = {
    ...taskObj,
    [option.value]: [
      ...(taskObj[option.value] || []),
      {
        title: input.value,
        taskOptions: clickRecord,
        taskStatus: option.value,
        id: Date.now() + '-' + Math.floor(Math.random() * 10000),
      },
    ],
  };
  let isTaskObjHasProperty = Object.getOwnPropertyNames(taskObj).length;

  // Object.getOwnPropertyNames <-- this will not include symbol while checking obj has property
  // Reflect.ownKeys(taskObj) <-- get or include symbol property too while checking

  if (isTaskObjHasProperty) {
    window.localStorage.setItem('taskItems', JSON.stringify(taskObj));
  }

  let test = taskObj || JSON.parse(window.localStorage.getItem('taskItems'));

  // running loop taskObj to add items
  if (Object.getOwnPropertyNames(test).length) {
    const taskStatusArray = Object.keys(test);
    taskStatusArray.forEach((item, index) => {
      addBoxes(test[item]);
    });
  }
  input.value = '';
};

const handleDelete = (currentTask1, boxId) => {
  const index = taskObj?.[currentTask1].findIndex((item) => item?.id === boxId);
  taskObj?.[currentTask1]?.splice(index, 1);

  Object.getOwnPropertyNames(taskObj).forEach((item) => {
    const parentElement = document.querySelector(`.${item}`);
    // delete all the child of particulare task status if it has no length
    if (!taskObj?.[item]?.length) {
      Array.from(parentElement.children)
        .slice(1)
        .forEach((child) => parentElement.removeChild(child));
      delete taskObj[item];
    } else {
      // delete the child element of specific task box which is not taskObj but in DOM
      let idArray = taskObj?.[currentTask1]?.map((subItem) => {
        return subItem?.id;
      });
      const parentElement = document.querySelector(`.${currentTask1}`);
      Array.from(parentElement.children).forEach((item) => {
        if (item?.id && !idArray.includes(item?.id)) {
          parentElement.removeChild(item);
        }
      });
    }
  });
  window.localStorage.setItem('taskItems', JSON.stringify(taskObj));
};

const addBoxes = (currentTask) => {
  // append the box to currentTask
  currentTask?.forEach((item, index) => {
    let currentStateElement = document.querySelector(`.${item?.taskStatus}`);
    if (!document.querySelector(`.${item?.taskStatus}-${index}`)) {
      const statusBox = document.createElement('div');
      statusBox.className = `box ${item?.taskStatus}-${index}`;
      statusBox.id = `${item?.id}`;
      const titleDiv = document.createElement('div');
      titleDiv.className = 'title';
      const boxTitle = document.createElement('span');
      boxTitle.innerText = item?.title;
      const img = document.createElement('img');
      img.src = './icons/delete.svg';
      img.addEventListener('click', () => {
        handleDelete(item?.taskStatus, item?.id);
      });
      titleDiv.appendChild(boxTitle);
      titleDiv.appendChild(img);
      statusBox.appendChild(titleDiv);
      const taskOptions = document.createElement('ul');
      item?.taskOptions?.forEach((taskName) => {
        const task = document.createElement('li');
        task.innerText = taskName;
        taskOptions.appendChild(task);
      });
      statusBox.appendChild(taskOptions);
      currentStateElement.appendChild(statusBox);
    }
  });
};

taskList.addEventListener('click', (e) => {
  // adding bg color to task in taskBox
  Array.from(taskList?.children).forEach((item, index) => {
    if (
      item?.textContent === e.target.textContent &&
      !clickRecord.includes(e.target.textContent)
    ) {
      e.target.style.backgroundColor = `hsla(${
        Math.random() * 360
      }, 100%, 50%, 1)`;
      clickRecord.push(e.target.textContent);
    } else if (
      item?.textContent === e.target.textContent &&
      clickRecord.includes(e.target.textContent)
    ) {
      e.target.style.backgroundColor = 'inherit';
      let index = clickRecord.findIndex(
        (item) => item === e.target.textContent
      );
      clickRecord.splice(index, 1);
    }
  });
});

form.addEventListener('submit', handleSubmit);

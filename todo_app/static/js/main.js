const addBtn = document.getElementById("add-btn");
const clearBtn = document.getElementById("clear-btn");
const tasksList = document.getElementById("all-tasks");
const addInput = document.getElementById("input-add");
const filterInput = document.getElementById("input-filter");
const darkCheckbox = document.getElementById("dark-mode");
let tasks = [];

async function buildList() {
    let res = await fetch(tasksListUrl);
    tasks = await res.json();
    tasksList.append(...tasks.map(task => createLi(task)));
}

window.addEventListener("load", () => {
    if (localStorage.getItem("dark") === "true") {
        document.body.classList.add("dark");
        darkCheckbox.checked = true;
    }
    buildList();
});

async function addTask() {
    if(addInput.value) {
        let title = addInput.value;
        addInput.value = "";
        let completed = false;
        let res = await fetch(addInput.dataset.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title, completed})
        });
        let task = await res.json();
        tasks.push(task);
        tasksList.prepend(createLi(task));
    }
}

async function removeTask(id) {
    await fetch(taskDeleteUrl.replace(0, id), {method: 'DELETE'});
}
function createLi(task) {
    const li = document.createElement("li");
    li.innerHTML = `<span>${task.title}</span>${svgTimes}`;
    if (task.completed) {
        li.classList.add("completed");
    }
    li.children[1].addEventListener("click", async function() {
        this.parentElement.remove();
        removeTask(task.id);
    });
    li.children[0].addEventListener("click", async function() {
        task.completed = !task.completed;
        await fetch(taskUpdateUrl.replace(0, task.id), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });
        li.classList.toggle("completed");
    })
    return li;
}

addBtn.addEventListener("click", addTask);

clearBtn.addEventListener("click", function() {
    tasksList.innerHTML = "";
    fetch(this.dataset.url, { method: 'DELETE' });
});

//filtering
filterInput.addEventListener("input", function() {
    [...tasksList.children].forEach(el => {
        if(!el.textContent.includes(this.value)) {
            el.style.display = "none";
        } else {
            el.style.display = "";
        }
    });
});
[addInput, filterInput].forEach(el => 
    el.addEventListener("blur", function() {
        if (this.value) {
            this.nextElementSibling.classList.add("to-top");
        } else {
            this.nextElementSibling.classList.remove("to-top");
        }
}));

darkCheckbox.addEventListener("change", function() {
    document.body.classList.toggle("dark");
    localStorage.setItem("dark", this.checked);
});

const svgTimes = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" class="svg-inline--fa fa-times fa-w-11" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" style="color:orange;width:15px;margin-right:25px;"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>`;
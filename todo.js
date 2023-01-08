/* eslint-disable no-undef */
/* eslint-disable no-alert */
/* eslint-disable no-use-before-define */
const todoList = document.querySelector('#todoList');
const todoInput = document.querySelector('#todoInput');
const todoText = document.querySelector('#todoText');
const todoCount = document.querySelector('#todoCount');
const delAll = document.querySelector('#delAll');
const tab = document.querySelector('#tab');
const logOut = document.querySelector('#logOut');
const userName = document.querySelector('#userName');

const url = 'https://todoo.5xcamp.us';
const authorization = localStorage.getItem('Authorization');
const nickName = localStorage.getItem('nickName');
let data = [];

// todo1 => 先做好CRUD
//  *Read
//  *Create
//  *Delete
//  *DeleteAll
//  *Update (立即函式待修正)
//  *待完成計算
//  *清除已完成
//  *篩選功能
//  *篩選狀況下新增
//  *篩選狀況下更改
//  *刪除更改的更加確定(並跳alert)
//  *使用者姓名顯示,以及刪除

// todo2
// *使用者登出
// *進網頁後授權測試,不符合回到上一頁
// *alert modal置換
// 授權過期 alert
// 已完成項目計算更動

// todo3
// 所有狀況下斷網情況

// ! function declare
const init = async () => {
  data = await getTodo();
  render();
};

const permissCheck = async (Authorization) => {
  try {
    const response = await fetch(`${url}/check`, {
      headers: {
        Authorization,
      },
    });
    // eslint-disable-next-line no-shadow
    const data = await response.json();
    return { data, response };
  } catch (err) {
    return [];
  }
};

const checkAuthorization = async () => {
  userName.innerHTML = `${nickName}的待辦`;
  const resData = await permissCheck(authorization);
  if (resData.response.status === 401) {
    alert('授權過期，自動跳轉自登入頁面');
    window.location.replace('/index.html');
  }
};

const getTodo = async () => {
  try {
    const response = await fetch(`${url}/todos`, {
      headers: {
        Authorization: authorization,
      },
    });
    const resData = await response.json();
    return resData.todos;
  } catch (err) {
    return [];
  }
};

const addTodo = async (text) => {
  try {
    const obj = {
      content: text,
    };
    const response = await fetch(`${url}/todos`, {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
    });
    const resData = await response.json();
    return resData;
  } catch (err) {
    return [];
  }
};

const delTodo = async (id) => {
  // 這邊不能加(不用)try catch，因為需要Promise還未被判定
  const response = await fetch(`${url}/todos/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: authorization,
    },
  });
  const resData = await response.json();
  return { resData, response };
};

const changeTodo = async (id) => {
  try {
    const response = await fetch(`${url}/todos/${id}/toggle`, {
      method: 'PATCH',
      headers: {
        Authorization: authorization,
      },
    });
    const resData = await response.json();
    return resData;
  } catch (err) {
    return [];
  }
};

const logOutDelete = async () => {
  const response = await fetch(`${url}/users/sign_out`, {
    method: 'DELETE',
    headers: {
      Authorization: authorization,
    },
  });
  const resData = await response.json();
  return { resData, response };
};

const render = () => {
  if (data.length === 0) {
    todoList.innerHTML = `<li class="pb-4 -ml-4 space-x-4 relative after:content-[''] after:absolute after:bg-[#E5E5E5] after:bottom-0 after:left-4 after:w-[calc(100%-64px)] after:h-[1px]">
    <p class="text-center text-[#9F9A91]">目前無待辦事項</p>
    </li>`;
    todoCount.textContent = '0 個待完成項目';
  } else {
    let str = '';
    let count = 0;
    data.map((item) => {
      if (item.completed_at) {
        str += `
          <li data-id=${item.id} data-checked=${item.completed_at} class="del flex group relative pb-4 space-x-4 after:content-[''] after:absolute after:bg-[#E5E5E5] after:bottom-0 after:w-[calc(100%-48px)] after:h-[1px]">
            <img src="./dist/image/checking.svg" alt="" class="checkbox" width="20px" height="24px">
            <p>${item.content}</p>
            <button data-id=${item.id} data-del="true" class="group-hover:block hidden absolute -top-1 right-2"><img src="./dist/image/close.png" alt="" class="p-2"></button>
          </li>`;
      } else {
        count += 1;
        str += `
          <li data-id=${item.id} data-checked=${item.completed_at} class="flex group relative pb-4 space-x-4 after:content-[''] after:absolute after:bg-[#E5E5E5] after:bottom-0 after:w-[calc(100%-48px)] after:h-[1px]">
            <img src="./dist/image/checkbox.svg" alt="" class="checkbox" width="20px" height="24px">
            <p>${item.content}</p>
            <button data-id=${item.id} data-del="true" class="group-hover:block hidden absolute -top-1 right-2"><img src="./dist/image/close.png" alt="" class="p-2"></button>
          </li>`;
      }
      return item;
    });
    todoList.innerHTML = str;
    todoCount.textContent = `${count} 個待完成項目`;
  }
};

const filterRender = (bool) => {
  const newData = data.filter((item) => {
    if (bool) {
      return item.completed_at;
    }
    return (item.completed_at === null || item.completed_at === false);
  });
  if (bool === true && newData.length === 0) {
    todoList.innerHTML = `
      <li class="pb-4 -ml-4 space-x-4 relative after:content-[''] after:absolute after:bg-[#E5E5E5] after:bottom-0 after:left-4 after:w-[calc(100%-64px)] after:h-[1px]">
        <p class="text-center text-[#9F9A91]">目前無完成事項</p>
      </li>`;
    return;
  }
  function renderWithParm(parmData) {
    if (parmData.length === 0) {
      todoList.innerHTML = `
        <li class="pb-4 -ml-4 space-x-4 relative after:content-[''] after:absolute after:bg-[#E5E5E5] after:bottom-0 after:left-4 after:w-[calc(100%-64px)] after:h-[1px]">
          <p class="text-center text-[#9F9A91]">目前無待辦事項</p>
        </li>`;
      todoCount.textContent = '0 個待完成項目';
    } else {
      let str = '';
      let count = 0;
      parmData.forEach((item) => {
        if (item.completed_at) {
          str += `<li data-id=${item.id} data-checked=${item.completed_at} class="del flex group relative pb-4 space-x-4 after:content-[''] after:absolute after:bg-[#E5E5E5] after:bottom-0 after:w-[calc(100%-48px)] after:h-[1px]">
              <img src="./dist/image/checking.svg" alt="" class="checkbox" width="20px" height="24px">
              <p>${item.content}</p>
              <button data-id=${item.id} data-del="true" class="group-hover:block hidden absolute -top-1 right-2"><img src="./dist/image/close.png" alt="" class="p-2"></button>
          </li>`;
        } else {
          count += 1;
          str += `<li data-id=${item.id} data-checked=${item.completed_at} class="flex group relative pb-4 space-x-4 after:content-[''] after:absolute after:bg-[#E5E5E5] after:bottom-0 after:w-[calc(100%-48px)] after:h-[1px]">
              <img src="./dist/image/checkbox.svg" alt="" class="checkbox" width="20px" height="24px">
              <p>${item.content}</p>
              <button data-id=${item.id} data-del="true" class="group-hover:block hidden absolute -top-1 right-2"><img src="./dist/image/close.png" alt="" class="p-2"></button>
          </li>`;
        }
      });
      todoList.innerHTML = str;
      todoCount.textContent = `${count} 個待完成項目`;
    }
  }
  renderWithParm(newData);
};

const changeChecked = (id) => {
  data.map((item) => {
    if (item.id === id) {
      // eslint-disable-next-line no-param-reassign
      item.completed_at = !item.completed_at;
    }
    return item;
  });
};

const tabStateRender = () => {
  const list = tab.childNodes;
  if (list[1].classList.contains('tab--active')) { // 全部
    render();
  } else if (list[5].classList.contains('tab--active')) { // 已完成
    filterRender(true);
  } else { // 待完成
    filterRender(false);
  }
};

init();
checkAuthorization();

// ! DOM EventListner
// addTodo(Enter)
todoText.addEventListener('keydown', async (e) => {
  const text = todoText.value;
  const list = tab.childNodes;
  if (e.key === 'Enter' && todoText.value !== '') {
    todoText.value = '';
    await addTodo(text);
    data = await getTodo();
    list[1].classList.add('tab--active');
    list[3].classList.remove('tab--active');
    list[5].classList.remove('tab--active');
    render();
  }
});

// addTodo
todoInput.addEventListener('click', async (e) => {
  const text = todoText.value;
  const list = tab.childNodes;
  if (e.target.parentNode.nodeName !== 'BUTTON' || todoText.value === '') {
    return;
  }
  todoText.value = '';
  await addTodo(text);
  data = await getTodo();
  list[1].classList.add('tab--active');
  list[3].classList.remove('tab--active');
  list[5].classList.remove('tab--active');
  render();
});

// delTodo
todoList.addEventListener('click', async (e) => {
  if (e.target.parentNode.dataset.del) {
    Swal.fire({
      title: '請等候',
      text: '刪除待辦中...',
      icon: 'info',
      showConfirmButton: false,
      showCancelButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      willOpen: swalWillOpen,
    });
    // eslint-disable-next-line no-inner-declarations
    async function swalWillOpen() {
      try {
        Swal.showLoading();
        const { id } = e.target.parentNode.dataset;
        // eslint-disable-next-line no-promise-executor-return
        await new Promise((resolve) => setTimeout(resolve, 500));
        await delTodo(id);
        swalUpdate();
        data = await getTodo();
        // alert('刪除待辦成功');
        tabStateRender();
        setTimeout(() => {
          Swal.close();
        }, 1000);
      } catch (err) {
        Swal.fire({
          title: '刪除待辦失敗',
          text: '請重新檢查網路連線',
          icon: 'error',
        });
      }
    }
    // eslint-disable-next-line no-inner-declarations
    function swalUpdate() {
      Swal.update(
        {
          title: '刪除成功',
          text: '您的待辦已成功刪除',
          icon: 'success',
          showConfirmButton: false,
          showCancelButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
        },
      );
    }
  }
});

// delAll 全部成功跳通知
delAll.addEventListener('click', async () => {
  try {
    Swal.fire({
      title: '請等候',
      text: '刪除待辦中...',
      icon: 'info',
      showConfirmButton: false,
      showCancelButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      willOpen: swalWillOpen,
    });
  } catch (err) {
    console.error(err);
    alert('刪除失敗，網路連線異常');
  }
  async function swalWillOpen() {
    Swal.showLoading();
    const res = await promiseFn();
    // 回傳後暫時等待
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 500));
    // 有無刪除數量 Response陣列判斷
    // eslint-disable-next-line no-unused-expressions
    res.length ? updateInit() : swalWarnig();
  }
  function updateInit() {
    swalUpdate();
    init();
    setTimeout(Swal.close, 1000);
  }
  async function promiseFn() {
    // 回傳Promise pending陣列
    // eslint-disable-next-line array-callback-return, consistent-return
    const apiArr = data.map((item) => {
      if (item.completed_at) {
        return delTodo(item.id);
      }
    }).filter((item) => item !== undefined);
    // Promis.all
    const res = await Promise.all(apiArr);
    return res;
  }
  function swalUpdate() {
    Swal.update(
      {
        title: '刪除成功',
        text: '成功刪除已完成事項',
        icon: 'success',
        showConfirmButton: false,
        showCancelButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      },
    );
  }
  function swalWarnig() {
    Swal.fire({
      title: '沒有項目',
      text: '趕快去完成待辦吧',
      icon: 'warning',
    });
  }
});

// checked
todoList.addEventListener('click', (e) => {
  if (e.target.nodeName !== 'UL') {
    if (e.target.nodeName === 'LI' && e.target.dataset.id !== undefined) {
      const { id } = e.target.dataset;
      changeChecked(id);
      tabStateRender();
      changeTodo(id);
    } else if (e.target.parentNode.nodeName !== 'BUTTON' && e.target.parentNode.dataset.id !== undefined) {
      // ? (!==delButton)
      const { id } = e.target.parentNode.dataset;
      changeChecked(id);
      tabStateRender();
      changeTodo(id);
    }
  }
});

// changeTab
tab.addEventListener('click', (e) => {
  const list = tab.childNodes;
  // const value = e.target.value;
  const { value } = e.target;
  switch (value) {
    case '全部': {
      list[1].classList.add('tab--active');
      list[3].classList.remove('tab--active');
      list[5].classList.remove('tab--active');
      render();
      break;
    }
    case '待完成': {
      list[1].classList.remove('tab--active');
      list[3].classList.add('tab--active');
      list[5].classList.remove('tab--active');
      filterRender(false);
      break;
    }
    case '已完成': {
      list[1].classList.remove('tab--active');
      list[3].classList.remove('tab--active');
      list[5].classList.add('tab--active');
      filterRender(true);
      break;
    }
    default: {
      break;
    }
  }
});

// log_out
logOut.addEventListener('click', async () => {
  try {
    const result = await Swal.fire({
      title: '確定登出嗎?',
      text: null,
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonColor: '#d33',
      allowOutsideClick: true,
      allowEscapeKey: true,
    });
    if (result.value) {
      Swal.fire({
        title: '正在登出中',
        text: '請稍候...',
        icon: 'warning',
        showConfirmButton: true,
        showCancelButton: false,
        allowOutsideClick: true,
        allowEscapeKey: false,
      });
      Swal.showLoading();
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await logOutDelete();
      Swal.update(
        {
          title: '登出成功',
          text: '稍後自動跳轉自登入頁面...',
          icon: 'success',
          showConfirmButton: false,
          showCancelButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
        },
      );
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((resolve) => setTimeout(resolve, 1000));
      localStorage.removeItem('Authorization');
      localStorage.removeItem('nickName');
      Swal.close();
      window.location.replace('#/index.html');
    }
  } catch (err) {
    Swal.fire(
      {
        title: '登出失敗',
        text: '請重新檢查網路狀態',
        icon: 'warning',
        showConfirmButton: true,
        showCancelButton: false,
        allowOutsideClick: true,
        allowEscapeKey: false,
      },
    );
    console.error('登出失敗');
  }
});

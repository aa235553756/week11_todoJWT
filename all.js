/* eslint-disable array-callback-return */
/* eslint-disable no-promise-executor-return */
/* eslint-disable no-undef */
/* eslint-disable no-alert */
const signInForm = document.forms[0];
const register = document.forms[1];
const chageToRegister = document.querySelector('#chageToRegister');
const chageSignIn = document.querySelector('#chageToSignIn');
const registerToggle = document.querySelector('#registerToggle');
const registerTogglePC = document.querySelector('#registerTogglePC');
const regexAry = [];

const url = 'https://todoo.5xcamp.us';
const authorization = localStorage.getItem('Authorization');

// todo1
// *註冊帳號and登入 切換頁面,
// *localStroge測試根據網域
// *決定換頁or渲染
// *找response內的Authornation
// *密碼驗證及顯示

// todo2
// *註冊post,post之後成功訊息(之後跳轉)
// *登入get,跳轉(渲染or換頁)
// *重複帳號註冊alert

// todo3
// *所有狀況下斷網情況
// 儲存不同信箱的授權及nickName

// ! function declare
const init = async () => {
  if (localStorage.getItem('Authorization') !== null) {
    // eslint-disable-next-line no-use-before-define
    const data = await permissCheck(authorization);
    if (data.response.status === 200) {
      alert('登入成功,請稍等');
      setTimeout(() => {
        window.location.replace('/todo.html');
      }, 1000);
    }
  }
  // eslint-disable-next-line no-use-before-define
  regexFn();
};

const logIn = async (email, password) => {
  const response = await fetch(`${url}/users/sign_in`, {
    method: 'POST',
    body: JSON.stringify({
      user: {
        // email:email;
        email,
        password,
      },
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return { data, response };
};

const registerPost = async (email, nickname, password) => {
  const response = await fetch(`${url}/users`, {
    method: 'POST',
    body: JSON.stringify({
      user: {
        email,
        nickname,
        password,
      },
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return { data, response };
};

const permissCheck = async (Authorization) => {
  try {
    const response = await fetch(`${url}/check`, {
      headers: {
        Authorization,
      },
    });
    const data = await response.json();
    return { data, response };
  } catch (err) {
    return [];
  }
};

const formValue = (form) => {
  const formAry = [];
  [...form.elements].map((item) => {
    formAry.push(item.value);
    return [];
  });
  return formAry;
};

const statusAlert = async (res, status) => {
  const warnighText = res.response.status === 401 ? '請重新確認帳號及密碼' : '電子信箱重複，請輸入其他信箱';
  if (res.response.status === status) {
    // !每次登入授權都會不一樣
    // !且一個帳號允許有許多授權
    // !待會以一個帳號為單位為存取
    localStorage.setItem('Authorization', res.response.headers.get('Authorization'));
    localStorage.setItem('nickName', res.data.nickname);
    Swal.update({
      title: res.data.message,
      text: '自動為您跳轉畫面...',
      icon: 'success',
      showConfirmButton: false,
      showCancelButton: false,
      allowOutsideClick: false,
    });
    await new Promise((reslove) => setTimeout(reslove, 2000));
    window.location = 'todo.html';
  } else {
    Swal.fire({
      title: res.data.message,
      text: warnighText,
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: false,
      allowOutsideClick: true,
    });
  }
};

const regexFn = () => {
  function emailTest(str) {
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return regex.test(str);
  }
  function nickNameTest(str) {
    const regex = /./;
    return regex.test(str);
  }
  function passwordTest(str) {
    const regex = /^.{6,}$/;
    return regex.test(str);
  }
  regexAry.push(emailTest, nickNameTest, passwordTest);
};

init();

// ! addEventListener

// preventDefault
signInForm.addEventListener('submit', (e) => {
  e.preventDefault();
});

// preventDefault
register.addEventListener('submit', (e) => {
  e.preventDefault();
});

// !表單驗證系統
// *logIn
signInForm.submit.addEventListener('click', async () => {
  try {
    // 表單取值
    const accountAry = formValue(signInForm);
    // 表單漏填
    if (accountAry.includes('')) {
      return;
    }
    // 登入POST
    Swal.fire({
      title: '登入中',
      icon: 'info',
      showConfirmButton: false,
      showCancelButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
    Swal.showLoading();
    const res = await logIn(...accountAry);
    await new Promise((reslove) => setTimeout(reslove, 1000));
    statusAlert(res, 200);
  } catch (err) {
    console.error(err);
    Swal.fire({
      title: '網路連線異常',
      icon: 'error',
    });
  }
});

// *register
register.registerSubmit.addEventListener('click', async () => {
  try {
    // 表單取值
    const registerAry = formValue(register);
    // 表單漏填
    if (registerAry.includes('')) {
      Swal.fire('請確實填寫註冊內容', '', 'warning');
      register.passwordTwice.previousElementSibling.classList.remove('hidden');
    } else if (register.password_2.value !== register.passwordTwice.value) {
      Swal.fire('密碼不一致，請重新輸入', '', 'warning');
      register.passwordTwice.previousElementSibling.classList.remove('hidden');
      return;
    } else {
      register.passwordTwice.previousElementSibling.classList.add('hidden');
    }
    // 表單驗證,開啟錯誤訊息
    // eslint-disable-next-line consistent-return
    const beforePostAry = [...register.elements].map((item, i) => {
      if (regexAry[i]) {
        if (!regexAry[i](item.value)) {
          item.previousElementSibling.classList.remove('hidden');
          return false;
        }
        item.previousElementSibling.classList.add('hidden');
        return true;
      }
    }).filter((item) => item !== undefined);
    // 逐一確認
    const beforePostBool = beforePostAry.every((item) => item === true);
    // 前台確認Regex
    if (beforePostBool) {
      // 註冊POST
      Swal.fire({
        title: '註冊中',
        icon: 'info',
        showConfirmButton: false,
        showCancelButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      Swal.showLoading();
      const res = await registerPost(...registerAry);
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((reslove) => setTimeout(reslove, 1000));
      statusAlert(res, 201);
    }
  } catch (err) {
    console.error(err);
    Swal.fire({
      title: '網路連線異常',
      icon: 'error',
    });
  }
});

// chage
chageToRegister.addEventListener('click', () => {
  signInForm.classList.add('hidden');
  register.classList.remove('hidden');
  registerToggle.textContent = '註冊帳號';
  registerTogglePC.textContent = '註冊帳號';
});

// textChage
chageSignIn.addEventListener('click', () => {
  register.classList.add('hidden');
  signInForm.classList.remove('hidden');
  registerToggle.textContent = '最實用的線上待辦事項服務';
  registerTogglePC.textContent = '最實用的線上待辦事項服務';
});

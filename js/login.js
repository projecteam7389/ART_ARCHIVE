import { supabase } from "./common.js";

const form = document.querySelector('#auth-form');
const message = document.querySelector('#message');

//submit: 폼의 확인 버튼을 누르면 실행되는 이벤트
//async: 이 함수 안에서 await(서버 응답 기다리기)를 사용
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value;

    //input[name='mode']:checked => 로그인/회원가입 중 선택된 라디오 버튼
    const mode = document.querySelector('input[name="mode"]:checked').value;

    const button = form.querySelector('button')
    button.disabled = true;
    message.textContent = '처리 중입니다...';

    let result;

    if (mode === 'signup') {
        result = await supabase.auth.signUp({ email, password });
    } else {
        result = await supabase.auth.signInWithPassword({ email, password });
    }

    button.disabled = false;

    if (result.error) {
        message.textContent = result.error.message;
        return;
    }
    location.href = 'index.html'
})
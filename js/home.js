//메인 페이지 : 작품 조회 , 더보기 클릭 시 추가로 조회
import { supabase, escapeHTML, won } from "./common.js";

const list = document.querySelector("#featured");
const moreBtn = document.querySelector('#more-btn');
const PAGE_SIZE = 8; //한번에 가져올 작품 수
let nextStart = 0; //다음 조회가 시작되는 위치

//supabase에서 작품을 8개씩 가져오는 함수
async function loadFeatured() {
    moreBtn.hidden = false;
    moreBtn.disabled = true;
    moreBtn.textContent = '불러오는 중';

    const { data, error, count } = await supabase
        .from('ART ARCHIVE')
        .select('*', { count: 'exact' })
        .order('id', { ascending: true })
        .range(nextStart, nextStart + PAGE_SIZE - 1);

    /* range({시작위치},{마지막위치}) */
    // .range(0, 0+8-1 = 7) => index 0~7까지 로드

    console.log("데이터:", data);
    console.log("에러:", error);
    console.log("전체 개수:", count);

    //error 발생
    if (error) {
        if (nextStart === 0) list.textContent = '작품을 불러오지 못했습니다.'
        else alert('추가작품 조회 실패: ' + error.message)
        moreBtn.hidden = false;
        moreBtn.disabled = false;
        moreBtn.textContent = '다시 시도';
        return;
    }

    //처음 조회 시 데이터가 없을 경우
    if (nextStart === 0) list.innerHTML = ''
    if (data.length === 0 && nextStart === 0) {
        list.textContent = '등록된 작품이 없습니다.';
        moreBtn.hidden = true;
        return;
    }

    // 조회한 작품을 기존 카드 아래에 추가합니다.
    data.forEach((art) => {
        list.innerHTML += `
        <a class="art-card" href="detail.html?id=${encodeURIComponent(art.id)}">
            ${art.image_url
                ? `<img src="${escapeHTML(art.image_url)}" alt="${escapeHTML(art.title)}">`
                : '<div class="no-image">ART SPACE</div>'
            }
            <div class="art-info">
                <h3>${escapeHTML(art.title)}</h3>
                <p>${escapeHTML(art.artist)}</p>
                <strong>${won(art.price)}</strong>
            </div>
        </a>
    `;
    });

    nextStart += data.length; //다음에는 이번에 가져온 개수만큼 뒤에서 시작
    moreBtn.hidden = nextStart >= (count ?? 0) || data.length === 0;
    moreBtn.disabled = false;
    moreBtn.textContent = '더보기';
}

//버튼을 누르면 다음 8개 조회
moreBtn.addEventListener('click', loadFeatured);
loadFeatured();